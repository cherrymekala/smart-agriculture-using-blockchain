'use strict';
const socketIO = require('socket.io');
const axios = require('axios');
const fetchSensorData = require('./app/fetchSensorData');
const uuid = require('uuid');

const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const bodyParser = require('body-parser');
const http = require('http');
const util = require('util');
const express = require('express');
const app = express();
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const cors = require('cors');
const constants = require('./config/constants.json');

const host = process.env.HOST || constants.host;
let port = process.env.PORT || constants.port; // Change var to let

const helper = require('./app/helper');
const invoke = require('./app/invoke');
const qscc = require('./app/qscc');
const query = require('./app/query');

const server = http.createServer(app);
const io = socketIO(server);

app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Set secret variable
app.set('secret', 'thisismysecret');

// Set JWT expiration time to 365 days
const jwt_expiretime = 365 * 24 * 60 * 60;

// Middleware to check JWT token and authenticate requests
app.use(
  expressJWT({
    secret: 'thisismysecret'
  }).unless({
    path: ['/users', '/users/login', '/register']
  })
);
app.use(bearerToken());

logger.level = 'debug';

// Middleware to handle JWT token and extract username and organization name
app.use((req, res, next) => {
  logger.debug('New req for %s', req.originalUrl);
  if (
    req.originalUrl.indexOf('/users') >= 0 ||
    req.originalUrl.indexOf('/users/login') >= 0 ||
    req.originalUrl.indexOf('/register') >= 0
  ) {
    return next();
  }
  var token = req.token;
  jwt.verify(token, app.get('secret'), (err, decoded) => {
    if (err) {
      console.log(`Error ================:${err}`);
      res.send({
        success: false,
        message:
          'Failed to authenticate token. Make sure to include the ' +
          'token returned from /users call in the authorization header ' +
          ' as a Bearer token'
      });
      return;
    } else {
      req.username = decoded.username;
      req.orgname = decoded.orgName;
      logger.debug(
        util.format(
          'Decoded from JWT token: username - %s, orgname - %s',
          decoded.username,
          decoded.orgName
        )
      );
      return next();
    }
  });
});

// Function to get error message
function getErrorMessage(field) {
  var response = {
    success: false,
    message: field + ' field is missing or Invalid in the request'
  };
  return response;
}

// Register and enroll user
app.post('/users', async function (req, res) {
  var username = req.body.username;
  var orgName = req.body.orgName;
  logger.debug('End point : /users');
  logger.debug('User name : ' + username);
  logger.debug('Org name  : ' + orgName);
  if (!username) {
    res.json(getErrorMessage('\'username\''));
    return;
  }
  if (!orgName) {
    res.json(getErrorMessage('\'orgName\''));
    return;
  }

  var token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + jwt_expiretime,
      username: username,
      orgName: orgName
    },
    app.get('secret')
  );

  let response = await helper.getRegisteredUser(username, orgName, true);

  logger.debug(
    '-- returned from registering the username %s for organization %s',
    username,
    orgName
  );
  if (response && typeof response !== 'string') {
    logger.debug(
      'Successfully registered the username %s for organization %s',
      username,
      orgName
    );
    response.token = token;
    res.json(response);
  } else {
    logger.debug(
      'Failed to register the username %s for organization %s with::%s',
      username,
      orgName,
      response
    );
    res.json({ success: false, message: response });
  }
});

// Register and enroll user
app.post('/register', async function (req, res) {
  var username = req.body.username;
  var orgName = req.body.orgName;
  logger.debug('End point : /users');
  logger.debug('User name : ' + username);
  logger.debug('Org name  : ' + orgName);
  if (!username) {
    res.json(getErrorMessage('\'username\''));
    return;
  }
  if (!orgName) {
    res.json(getErrorMessage('\'orgName\''));
    return;
  }

  var token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + jwt_expiretime,
      username: username,
      orgName: orgName
    },
    app.get('secret')
  );

  console.log(token);

  let response = await helper.registerAndGerSecret(username, orgName);

  logger.debug(
    '-- returned from registering the username %s for organization %s',
    username,
    orgName
  );
  if (response && typeof response !== 'string') {
    logger.debug(
      'Successfully registered the username %s for organization %s',
      username,
      orgName
    );
    response.token = token;
    res.json(response);
  } else {
    logger.debug(
      'Failed to register the username %s for organization %s with::%s',
      username,
      orgName,
      response
    );
    res.json({ success: false, message: response });
  }
});

// Login and get jwt
app.post('/users/login', async function (req, res) {
  var username = req.body.username;
  var orgName = req.body.orgName;
  logger.debug('End point : /users');
  logger.debug('User name : ' + username);
  logger.debug('Org name  : ' + orgName);
  if (!username) {
    res.json(getErrorMessage('\'username\''));
    return;
  }
  if (!orgName) {
    res.json(getErrorMessage('\'orgName\''));
    return;
  }

  var token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + jwt_expiretime,
      username: username,
      orgName: orgName
    },
    app.get('secret')
  );

  let isUserRegistered = await helper.isUserRegistered(username, orgName);

  if (isUserRegistered) {
    res.json({ success: true, message: { token: token } });
  } else {
    res.json({
      success: false,
      message: `User with username ${username} is not registered with ${orgName}, Please register first.`
    });
  }
});


async function sendOneSignalNotification(userId,message,url) {
  try {
    // Replace 'YOUR_ONESIGNAL_APP_ID' and 'YOUR_ONESIGNAL_REST_API_KEY' with your actual OneSignal app ID and REST API key.
     console.log('Attempting to send notification...');
    const oneSignalAppId = '6fd688e0-c4c4-4a91-abf9-70f05fe26516';
    const oneSignalRestApiKey = 'N2ViZjEzNzktODIwNi00NDg5LTkyODctODFiNDJmNTJlYjRi';



    if (message) {
      const notification = {
        app_id: oneSignalAppId,
        contents: { en: message },
        include_external_user_ids: [userId],
        url: url, // Add the custom URL here
      };

      await axios.post('https://onesignal.com/api/v1/notifications', notification, {
        headers: {
          'Authorization': `Basic ${oneSignalRestApiKey}`,
        },
      });

      console.log('Notification sent successfully to OneSignal:', message);
    }
  } catch (error) {
    console.error('Error sending notification to OneSignal:', error.message);
  }
}

// When the server starts, send the "Sensor data is coming!" notification
const sensorDataNotificationUrl = 'http://127.0.0.1:5500/farmers.html'; // Replace with your sensor data URL
// When the server starts, send the "Sensor data is coming!" notification
sendOneSignalNotification('014789', 'Sensor data is coming!',sensorDataNotificationUrl);

// Invoke transaction on chaincode on target peers
app.post('/channels/:channelName/chaincodes/:chaincodeName', async function (
  req,
  res
) {
  try {
    logger.debug('==================== INVOKE ON CHAINCODE ==================');
    var peers = req.body.peers;
    var chaincodeName = 'fabcar';
    var channelName = 'mychannel';
    var fcn = req.body.fcn;
    var args = req.body.args;
    var transient = req.body.transient;
    console.log(`Transient data is ;${transient}`);
    logger.debug('channelName  : ' + channelName);
    logger.debug('chaincodeName : ' + chaincodeName);
    logger.debug('fcn  : ' + fcn);
    logger.debug('args  : ' + args);
    if (!chaincodeName) {
      res.json(getErrorMessage('\'chaincodeName\''));
      return;
    }
    if (!channelName) {
      res.json(getErrorMessage('\'channelName\''));
      return;
    }
    if (!fcn) {
      res.json(getErrorMessage('\'fcn\''));
      return;
    }
    if (!args) {
      res.json(getErrorMessage('\'args\''));
      return;
    }

    let message = await invoke.invokeTransaction(
      channelName,
      chaincodeName,
      fcn,
      args,
      req.username,
      req.orgname,
      transient
    );
    console.log(`message result is : ${JSON.stringify(message)}`);

    // Fetch sensor data from the result, e.g., sensorData.humidity and sensorData.temperature
    const sensorData = message.result; // Replace 'sensorData' with the actual property name containing the sensor data.

    const response_payload = {
      result: message,
      error: null,
      errorData: null
    };
    res.send(response_payload);
  } catch (error) {
    const response_payload = {
      result: null,
      error: error.name,
      errorData: error.message
    };
    res.send(response_payload);
  }
});



    
app.get('/channels/mychannel/chaincodes/fabcar', async function (req, res) {
  try {
    logger.debug('==================== QUERY BY CHAINCODE ==================');

    var channelName = 'mychannel';
    var chaincodeName = 'fabcar';
    let args = req.query.args;
    let fcn = req.query.fcn;

    logger.debug('channelName : ' + channelName);
    logger.debug('chaincodeName : ' + chaincodeName);
    logger.debug('fcn : ' + fcn);
    logger.debug('args : ' + args);

    if (!chaincodeName) {
      res.json(getErrorMessage('\'chaincodeName\''));
      return;
    }
    if (!channelName) {
      res.json(getErrorMessage('\'channelName\''));
      return;
    }
    if (!fcn) {
      res.json(getErrorMessage('\'fcn\''));
      return;
    }
    if (!args) {
      res.json(getErrorMessage('\'args\''));
      return;
    }

    args = args.replace(/'/g, '"');
    args = JSON.parse(args);
    logger.debug(args);

    let message;
    if (fcn === 'getAllSensorData') {
      // Call the function to fetch all sensor data
      message = await fetchSensorData(channelName, chaincodeName, args[0], fcn);
    } else {
      // Call the existing query function for other queries
      message = await query.query(
        channelName,
        chaincodeName,
        args,
        fcn,
        req.username,
        req.orgname
      );
    }

    const response_payload = {
      result: message,
      error: null,
      errorData: null
    };

    res.send(response_payload);
  } catch (error) {
    const response_payload = {
      result: null,
      error: error.name,
      errorData: error.message
    };
    res.send(response_payload);
  }
});



// Array to store queries
const queries = [];

// Function to generate a unique query ID
function generateUniqueQueryId() {
    return uuid.v4(); // Generate a version 4 (random) UUID
}

// Handle incoming queries
app.post('/send-query', async function (req, res) {
    try {
        const selectedQuestion = req.body.question;

        // Generate a unique query ID
        const queryId = generateUniqueQueryId();

        // Store the query and its associated query ID in the 'queries' array
        queries.push({
            queryId: queryId,
            question: selectedQuestion,
            timestamp: new Date()
        });
console.log("Queries: ",queries);
        // Send a success response with the generated query ID
        res.json({ success: true, message: 'Query received successfully', queryId: queryId });

        // Send the "A new query has been received!" notification
        const expertsNotificationUrl = 'http://127.0.0.1:5500/expert.html';
        sendOneSignalNotification('014789', 'A new query has been received!', expertsNotificationUrl);
    } catch (error) {
        console.error('Error processing query:', error);
        res.json({ success: false, message: 'An error occurred while processing the query' });
    }
});





// Add an endpoint to fetch queries
app.get('/get-queries', async function (req, res) {
    try {
        res.json(queries);
    } catch (error) {
        console.error('Error fetching queries:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching queries' });
    }
});






app.post('/send-response', function (req, res) {
    try {
        const queryId = req.body.queryId;
        const answer = req.body.answer;

        // Find the query in the 'queries' array by its query ID
        const queryToUpdate = queries.find(query => query.queryId === queryId);
        if (!queryToUpdate) {
            res.json({ success: false, message: 'Query not found' });
            return;
        }

        // Update the query with the provided answer
        queryToUpdate.answer = answer;

        // You can add additional logic here if needed, such as sending notifications to farmers

        res.json({ success: true, message: 'Answer sent successfully' });
           // Send a notification to the farmer
        const farmerUserId = '014789'; // You need to replace this with the actual user ID of the farmer
        const notificationMessage = 'An expert has responded to your query!';
        const notificationUrl = 'http://127.0.0.1:5500/farmers.html'; // Replace with the desired URL
        sendOneSignalNotification(farmerUserId, notificationMessage, notificationUrl);
    } catch (error) {
        console.error('Error sending answer:', error);
        res.json({ success: false, message: 'An error occurred while sending the answer' });
    }
});

// Add an endpoint to fetch responses
app.get('/get-responses', async function (req, res) {
    try {
        // Fetch the responses from your storage or database
        // For example, you can fetch responses from the 'queries' array
        const responses = queries.map(query => ({
            queryId: query.queryId,
            question: query.question,
            answer: query.answer || 'No answer yet', // Provide a default if answer is not available
            timestamp: query.timestamp
        }));

        res.json(responses);
    } catch (error) {
        console.error('Error fetching responses:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching responses' });
    }
});



// Start the server
server.listen(port, () => {
  console.log(`Server started on ${port}`);
  logger.info('****************** SERVER STARTED ************************');
  logger.info('***************  http://%s:%s  ******************', host, port);
  server.timeout = 240000;
});



