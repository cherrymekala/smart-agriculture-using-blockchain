document.addEventListener('DOMContentLoaded', function () {
  // Establish WebSocket connection
  var socket = new WebSocket("ws://localhost:4000/ws");

  // WebSocket connection opened
  socket.onopen = function (event) {
    console.log("WebSocket connection opened");
  };

  // WebSocket message received
  socket.onmessage = function (event) {
    var message = event.data;
    console.log("WebSocket message received:", message);

    // Handle the received message and update the UI as needed
    // For example, you can display the notification in the Dashboard section
    var inboxMessages = document.getElementById('inbox-messages');
    var queryDiv = document.createElement('div');
    queryDiv.textContent = message;
    inboxMessages.appendChild(queryDiv);
  };

  // WebSocket connection closed
  socket.onclose = function (event) {
    console.log("WebSocket connection closed");
  };

  var profileItem = document.getElementById('profile-item');
  var dashboardItem = document.getElementById('dashboard-item');
  var inboxItem = document.getElementById('inbox-item');

  profileItem.addEventListener('click', showProfile);
  dashboardItem.addEventListener('click', showDashboard);
  inboxItem.addEventListener('click', showInbox);

 function showProfile() {
    var profileSection = document.getElementById('my-profile');
    var dashboardSection = document.getElementById('dashboard');
    var querySection = document.getElementById('inbox');

    profileSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    querySection.classList.add('hidden');

      // Fetch and display user's profile details from local storage
  var loggedInUserEmail = sessionStorage.getItem('loggedInUserEmail');
  var userDetails = JSON.parse(localStorage.getItem('registeredUsers'));

  // Find the user details for the logged-in user based on their email
  var loggedInUser = userDetails.find(function (user) {
    return user.email === loggedInUserEmail;
  });

  if (loggedInUser) {
    // Update the profile details with the fetched user details
    var profileDetailsElement = document.getElementById('profile-details');
    profileDetailsElement.innerHTML = `
      <div class="profile-details-container">
          <p class="profile-detail"><strong>Name:</strong> ${loggedInUser.fullName}</p>
          <p class="profile-detail"><strong>Place:</strong> ${loggedInUser.place}</p>
          <p class="profile-detail"><strong>Email:</strong> ${loggedInUser.email}</p>
          <p class="profile-detail"><strong>Phone:</strong> ${loggedInUser.phone}</p>
          <!-- Add more details as needed -->
      </div>
    `;
  } else {
    // If the user details are not found, display an error message or handle it accordingly
    var profileDetailsElement = document.getElementById('profile-details');
    profileDetailsElement.innerHTML = `<div class="profile-details-container"><p>Error: User details not found.</p></div>`;
  }
}

let id = 1;
const batchSize = 10;


function showDashboard() {
  var profileSection = document.getElementById('my-profile');
  var dashboardSection = document.getElementById('dashboard');
  var inboxSection = document.getElementById('inbox');

  profileSection.classList.add('hidden');
  dashboardSection.classList.remove('hidden');
  inboxSection.classList.add('hidden');

  // Remove the "home-page" class from the body tag
  document.body.classList.remove('home-page');

  var sensorContainer = document.getElementById('sensor-container');
  sensorContainer.innerHTML = '';
sensorContainer.style.display = 'none'; // Clear existing sensors

        // Array of sensors with their data
                var sensors = [
                    { name: 'DHT Sensor', status: 'Active', online: true, image: 'dht.jpg' },
                    { name: 'Tensiometer', status: 'Active', online: true, image: 'tensiometer.png' },
                    { name: 'Photoresistor', status: 'Active', online: true, image: 'ldr-sensor.png' },
                   { name: 'GPS Sensor', status: 'Active', online: true, image: 'gps.jpg' },
                   { name: 'Accelerometer Sensor', status: 'Active', online: true, image: 'accelerometer-sensor.png' },
                    { name: 'Airflow Sensor', status: 'Active', online: true, image: 'airflow.png' },
                     { name: 'Electronic Sensor', status: 'Active', online: true, image: 'sensor.png' },
                     { name: 'Leaf Moisture Sensor', status: 'Active', online: true, image: 'leaf.png' },
                      { name: 'Optical Sensor', status: 'Active', online: true, image: 'optical.jpg' },
                      { name: 'Nutrient Sensor', status: 'Active', online: true, image: 'nutrient.png' },
                      { name: 'Wind Speed Sensor', status: 'Active', online: true, image: 'wind.png' },
                       { name: 'CO2 Sensor', status: 'Active', online: true, image: 'CO2.jpg' }
                   // Add more sensors as needed
                ];


  // Generate sensor buttons
  sensors.forEach(function (sensor) {
    // Create sensor button element
     var sensorButton = document.createElement('button');
                sensorButton.classList.add('sensor-button');
                if (sensor.online) {
                    sensorButton.classList.add('online');
                } else {
                    sensorButton.classList.add('offline');
                }
               if (sensor.status === 'Active') {
                // Create notification indicator element
                var notificationIndicator = document.createElement('div');
                notificationIndicator.classList.add('notification-indicator');
                sensorButton.appendChild(notificationIndicator);

                // Create notification icon element
                var notificationIcon = document.createElement('i');
                notificationIcon.classList.add('fas', 'fa-info', 'notification-icon'); // Add classes for Font Awesome info icon
                notificationIndicator.appendChild(notificationIcon);
               }

    // Create sensor image element
    var sensorImage = document.createElement('img');
    sensorImage.src = sensor.image;
    sensorImage.alt = sensor.name;
    sensorImage.classList.add('sensor-image');
    sensorButton.appendChild(sensorImage);

    // Create sensor name element
    var sensorName = document.createElement('span');
    sensorName.textContent = sensor.name;
    sensorName.classList.add('sensor-name');
    sensorButton.appendChild(sensorName);

    // Create sensor status element
    var sensorStatus = document.createElement('span');
    sensorStatus.textContent = 'Status: ' + sensor.status;
    sensorStatus.classList.add('sensor-status');
    sensorButton.appendChild(sensorStatus);

 if (sensor.humidity > 70 || sensor.temperature > 100) {
      var notificationIndicator = document.createElement('div');
      notificationIndicator.classList.add('notification-indicator');
      sensorButton.appendChild(notificationIndicator);
    }

    // Add blinking animation for inactive sensors
    if (!sensor.online) {
      var blinkingLight = document.createElement('div');
      blinkingLight.classList.add('blinking-light');
      sensorButton.appendChild(blinkingLight);
    }

 

    sensorContainer.appendChild(sensorButton);

                   
                    sensorButton.addEventListener('click', function () {
                        if (sensor.name === 'DHT Sensor') {
                            fetchSensorData(sensor.name);
                        } else if (sensor.name === 'Tensiometer') {
                            fetchSensorData(sensor.name);
                        } else if (sensor.name === 'Photoresistor') {
                            fetchSensorData(sensor.name); 
                        } else if (sensor.name === 'GPS Sensor') {
                            fetchSensorData(sensor.name); 
                        } else if (sensor.name === 'Accelerometer Sensor') {
                            fetchSensorData(sensor.name); 
                        } else if (sensor.name === 'Airflow Sensor') {
                            fetchSensorData(sensor.name); 
                        } else if (sensor.name === 'Electronic Sensor') {
                            fetchSensorData(sensor.name); 
                        } else if (sensor.name === 'Leaf Moisture Sensor') {
                            fetchSensorData(sensor.name); 
                        } else if (sensor.name === 'Optical Sensor') {
                            fetchSensorData(sensor.name);
                        } else if (sensor.name === 'Nutrient Sensor') {
                            fetchSensorData(sensor.name);
                        } else if (sensor.name === 'Wind Speed Sensor') {
                            fetchSensorData(sensor.name);
                        } else if (sensor.name === 'CO2 Sensor') {
                            fetchSensorData(sensor.name);
                        }
                    });

                    sensorContainer.appendChild(sensorButton);
                });

  // Fetch and display expert's profile details from local storage
  var userDetails = JSON.parse(localStorage.getItem('userDetails'));

  // Update the user button text and classes
  var userButton = document.getElementById('user-button');
  userButton.textContent = userDetails.fullname;
  userButton.classList.add('sensor-button');
  userButton.classList.add('online');

  // Create user button image element
  var userImage = document.createElement('img');
  userImage.src = 'user.png'; // Replace with the actual user image URL
  userImage.alt = userDetails.fullname;
  userImage.classList.add('sensor-image');
  userButton.insertBefore(userImage, userButton.firstChild);

  // Create user button status element
  var userStatus = document.createElement('span');
  userStatus.textContent = 'Online'; // Replace with the actual user status
  userStatus.classList.add('sensor-status');
  userButton.appendChild(userStatus);

  // Add event listener to the user button
  userButton.addEventListener('click', function () {
    // Toggle display of the sensor buttons
    sensorContainer.style.display = sensorContainer.style.display === 'none' ? 'flex' : 'none';
  });

// const chartCanvas = document.getElementById('sensor-chart');
// const chartContext = chartCanvas.getContext('2d');
// let sensorChart = null; // Variable to store the chart instance
// let chartData = {
//   labels: [], // Use an empty array to start with no labels on the x-axis
//   datasets: [
//     {
//       label: 'Temperature',
//       data: [], // Use an empty array to start with no temperature data
//       backgroundColor: 'rgba(255, 99, 132, 0.2)',
//       borderColor: 'rgba(255, 99, 132, 1)',
//       borderWidth: 1
//     },
//     {
//       label: 'Humidity',
//       data: [], // Use an empty array to start with no humidity data
//       backgroundColor: 'rgba(54, 162, 235, 0.2)',
//       borderColor: 'rgba(54, 162, 235, 1)',
//       borderWidth: 1
//     }
//   ]
// };
// let chartData1 = {
//   labels: [], // Use an empty array to start with no labels on the x-axis
//   datasets: [
//     {
//       label: 'Tensiometer',
//       data: [], // Use an empty array to start with no temperature data
//       backgroundColor: 'rgba(255, 99, 132, 0.2)',
//       borderColor: 'rgba(255, 99, 132, 1)',
//       borderWidth: 1
//     }
//   ]
// };
 function updateChart(){ 
const chartCanvas = document.getElementById('sensor-chart');
const chartContext = chartCanvas.getContext('2d');
let sensorChart = null; // Variable to store the chart instance
let chartData = {
  labels: [], // Use an empty array to start with no labels on the x-axis
  datasets: [
    {
      label: 'Temperature',
      data: [], // Use an empty array to start with no temperature data
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    },
    {
      label: 'Humidity',
      data: [], // Use an empty array to start with no humidity data
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }
  ]
};

  // Update the chart data
  chartData.labels = chartData.labels.concat(sensorDataArray.map(sensorData => sensorData.id));
  chartData.datasets[0].data = chartData.datasets[0].data.concat(sensorDataArray.map(sensorData => sensorData.temperature));
  chartData.datasets[1].data = chartData.datasets[1].data.concat(sensorDataArray.map(sensorData => sensorData.humidity));

    // Destroy the existing chart instance if it exists
  if (sensorChart) {
    sensorChart.destroy();
  }
  // Create the chart using Chart.js
   sensorChart = new Chart(chartContext, {
    type: 'line', // You can change the chart type if needed (e.g., bar, pie, etc.)
    data: chartData,
    options: chartOptions
  });
}
const sensorDataContainer = document.getElementById('sensor-data');
var currentSensor = sensorName;
  function fetchSensorData(sensorName) {
                    const promises = [];
                      // Reset the id when switching to a new sensor
                   if (sensorName !== currentSensor) {
                       currentSensor = sensorName;
                       id = 1;
                   }
                    for (let i = 0; i < batchSize; i++) {
                        promises.push(
                            fetch(`http://localhost:4000/channels/mychannel/chaincodes/fabcar?fcn=getSensorData&args=["${id}"]`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjEzODcwMTYsInVzZXJuYW1lIjoic2hhcmFuIiwib3JnTmFtZSI6Ik9yZzEiLCJpYXQiOjE2ODk4NTEwMTZ9.DNk1LJY_vAQK0-Lx17RM1f7ZlA7Yh8LcKoWLYj_mHMo' // Replace {token} with the actual token value
                                }
                            }).then(response => response.json())
                        );
                        id++;
                    }

                    Promise.all(promises)
                        .then(function (responses) {
                            // Extract sensor data from JSON responses
                            const sensorDataArray = responses.map(response => response.result);
   // Call the createLineChart function with your sensor data array when needed
createLineChart(sensorDataArray,sensorName);
                            // Process the extracted sensor data and create the table
                    updateTableAndChart(sensorDataArray,sensorName);
                 
                        })
                        .catch(function (error) {
                            console.error(error);
                            // Update the sensor data with an error message in the web portal
                            const sensorDataHTML = `
        <div class="sensor-data-item">
          <span>Error occurred while fetching sensor data</span>
        </div>
      `;
                            sensorDataContainer.innerHTML = sensorDataHTML;
                        });
                }

                        sensors.forEach(function (sensor) {
                            // ...

                            sensorButton.addEventListener('click', function () {
                                fetchSensorData(sensor.id); // Pass the sensor ID to the fetchSensorData function
                            });

                            // ...
                        });

 

function updateTableAndChart(sensorDataArray,sensorName) {
  if(sensorName=='DHT Sensor')
  {
  const table = document.createElement('table');
                    table.className = 'sensor-table';

                    // Create table row for table headings
                    const thead = document.createElement('thead');
                    const headingRow = document.createElement('tr');
                    const headings = ['ID', 'Timestamp', 'Temperature', 'Humidity'];
                    for (const heading of headings) {
                        const th = document.createElement('th');
                        th.textContent = heading;
                        headingRow.appendChild(th);
                    }
                    thead.appendChild(headingRow);
                    table.appendChild(thead);

                    // Create table rows with values
                    const tbody = document.createElement('tbody');
                    for (const sensorData of sensorDataArray) {
                        const dataRow = document.createElement('tr');
                        const keys = ['id', 'timestamp', 'temperature', 'humidity'];
                        for (const key of keys) {
                            const td = document.createElement('td');
                            td.textContent = sensorData[key];
                            dataRow.appendChild(td);
                        }

                        // Check and apply highlight if temperature or humidity crosses threshold
                        const temperatureThreshold = 100; // Change this to your desired temperature threshold
                        const humidityThreshold = 70; // Change this to your desired humidity threshold

                        if (sensorData.temperature > temperatureThreshold || sensorData.humidity > humidityThreshold) {
                            dataRow.classList.add('highlighted-row');
                        }

                        tbody.appendChild(dataRow);
                    }
                    table.appendChild(tbody);
                              sensorDataContainer.innerHTML = '';
        sensorDataContainer.appendChild(table);


}else if(sensorName=='Tensiometer')
{
 const table = document.createElement('table');
                        table.className = 'sensor-table';

                        // Create table row for table headings
                        const thead = document.createElement('thead');
                        const headingRow = document.createElement('tr');
                        const headings = ['ID', 'Timestamp', 'Soil Moisture'];
                        for (const heading of headings) {
                            const th = document.createElement('th');
                            th.textContent = heading;
                            headingRow.appendChild(th);
                        }
                        thead.appendChild(headingRow);
                        table.appendChild(thead);

                        // Create table rows with values
                        const tbody = document.createElement('tbody');
                        for (const sensorData of sensorDataArray) {
                            const dataRow = document.createElement('tr');
                            const keys = ['id', 'timestamp', 'tensiometer'];
                            for (const key of keys) {
                                const td = document.createElement('td');
                                td.textContent = sensorData[key];
                                dataRow.appendChild(td);
                            }

                            // Check and apply highlight if temperature or humidity crosses threshold
                            const tensiometerThreshold = 50; // Change this to your desired temperature threshold

                            if (sensorData.tensiometer > tensiometerThreshold) {
                                dataRow.classList.add('highlighted-row');
                            }

                            tbody.appendChild(dataRow);
                        }
                        table.appendChild(tbody);
                                                        sensorDataContainer.innerHTML = '';
        sensorDataContainer.appendChild(table);
}else if (sensorName == 'Photoresistor') {
                        const table = document.createElement('table');
                        table.className = 'sensor-table';

                        // Create table row for table headings
                        const thead = document.createElement('thead');
                        const headingRow = document.createElement('tr');
                        const headings = ['ID', 'Timestamp', 'Light Intensity'];
                        for (const heading of headings) {
                            const th = document.createElement('th');
                            th.textContent = heading;
                            headingRow.appendChild(th);
                        }
                        thead.appendChild(headingRow);
                        table.appendChild(thead);

                        // Create table rows with values
                        const tbody = document.createElement('tbody');
                        for (const sensorData of sensorDataArray) {
                            const dataRow = document.createElement('tr');
                            const keys = ['id', 'timestamp', 'photoresistor'];
                            for (const key of keys) {
                                const td = document.createElement('td');
                                td.textContent = sensorData[key];
                                dataRow.appendChild(td);
                            }

                            // Check and apply highlight if temperature or humidity crosses threshold
                            const photoresistorThreshold = 20; // Change this to your desired temperature threshold

                            if (sensorData.photoresistor < photoresistorThreshold) {
                                dataRow.classList.add('highlighted-row');
                            }

                            tbody.appendChild(dataRow);
                        }
                        table.appendChild(tbody);

                    sensorDataContainer.innerHTML = '';
        sensorDataContainer.appendChild(table);
                    }else if (sensorName == 'GPS Sensor') {
                        const table = document.createElement('table');
                        table.className = 'sensor-table';

                        // Create table row for table headings
                        const thead = document.createElement('thead');
                        const headingRow = document.createElement('tr');
                        const headings = ['ID', 'Timestamp', 'Location'];
                        for (const heading of headings) {
                            const th = document.createElement('th');
                            th.textContent = heading;
                            headingRow.appendChild(th);
                        }
                        thead.appendChild(headingRow);
                        table.appendChild(thead);

                        // Create table rows with values
                        const tbody = document.createElement('tbody');
                        for (const sensorData of sensorDataArray) {
                            const dataRow = document.createElement('tr');
                            const keys = ['id', 'timestamp', 'gps'];
                            for (const key of keys) {
                                const td = document.createElement('td');
                                td.textContent = sensorData[key];
                                dataRow.appendChild(td);
                            }

                            // Check and apply highlight if temperature or humidity crosses threshold
                            const gpsThreshold = 50; // Change this to your desired temperature threshold

                            if (sensorData.gps < gpsThreshold) {
                                dataRow.classList.add('highlighted-row');
                            }

                            tbody.appendChild(dataRow);
                        }
                        table.appendChild(tbody);
sensorDataContainer.innerHTML = '';
        sensorDataContainer.appendChild(table);
                    } else if (sensorName == 'Accelerometer Sensor') {
                        const table = document.createElement('table');
                        table.className = 'sensor-table';

                        // Create table row for table headings
                        const thead = document.createElement('thead');
                        const headingRow = document.createElement('tr');
                        const headings = ['ID', 'Timestamp', 'Acceleration'];
                        for (const heading of headings) {
                            const th = document.createElement('th');
                            th.textContent = heading;
                            headingRow.appendChild(th);
                        }
                        thead.appendChild(headingRow);
                        table.appendChild(thead);

                        // Create table rows with values
                        const tbody = document.createElement('tbody');
                        for (const sensorData of sensorDataArray) {
                            const dataRow = document.createElement('tr');
                            const keys = ['id', 'timestamp', 'accelerometer'];
                            for (const key of keys) {
                                const td = document.createElement('td');
                                td.textContent = sensorData[key];
                                dataRow.appendChild(td);
                            }

                            // Check and apply highlight if temperature or humidity crosses threshold
                            const accelerometerThreshold = 16; // Change this to your desired temperature threshold

                            if (sensorData.accelerometer > accelerometerThreshold) {
                                dataRow.classList.add('highlighted-row');
                            }

                            tbody.appendChild(dataRow);
                        }
                        table.appendChild(tbody);
sensorDataContainer.innerHTML = '';
        sensorDataContainer.appendChild(table);
                    } else if (sensorName == 'Airflow Sensor') {
                        const table = document.createElement('table');
                        table.className = 'sensor-table';

                        // Create table row for table headings
                        const thead = document.createElement('thead');
                        const headingRow = document.createElement('tr');
                        const headings = ['ID', 'Timestamp', 'Airflow'];
                        for (const heading of headings) {
                            const th = document.createElement('th');
                            th.textContent = heading;
                            headingRow.appendChild(th);
                        }
                        thead.appendChild(headingRow);
                        table.appendChild(thead);

                        // Create table rows with values
                        const tbody = document.createElement('tbody');
                        for (const sensorData of sensorDataArray) {
                            const dataRow = document.createElement('tr');
                            const keys = ['id', 'timestamp', 'airflow'];
                            for (const key of keys) {
                                const td = document.createElement('td');
                                td.textContent = sensorData[key];
                                dataRow.appendChild(td);
                            }

                            // Check and apply highlight if temperature or humidity crosses threshold
                            const airflowThreshold = 10; // Change this to your desired temperature threshold

                            if (sensorData.airflow > airflowThreshold) {
                                dataRow.classList.add('highlighted-row');
                            }

                            tbody.appendChild(dataRow);
                        }
                        table.appendChild(tbody);
sensorDataContainer.innerHTML = '';
        sensorDataContainer.appendChild(table);
                    } else if (sensorName == 'Electronic Sensor') {
                        const table = document.createElement('table');
                        table.className = 'sensor-table';

                        // Create table row for table headings
                        const thead = document.createElement('thead');
                        const headingRow = document.createElement('tr');
                        const headings = ['ID', 'Timestamp', 'Electrical Conductivity'];
                        for (const heading of headings) {
                            const th = document.createElement('th');
                            th.textContent = heading;
                            headingRow.appendChild(th);
                        }
                        thead.appendChild(headingRow);
                        table.appendChild(thead);

                        // Create table rows with values
                        const tbody = document.createElement('tbody');
                        for (const sensorData of sensorDataArray) {
                            const dataRow = document.createElement('tr');
                            const keys = ['id', 'timestamp', 'electronic'];
                            for (const key of keys) {
                                const td = document.createElement('td');
                                td.textContent = sensorData[key];
                                dataRow.appendChild(td);
                            }

                            // Check and apply highlight if temperature or humidity crosses threshold
                            const electronicThreshold = 5; // Change this to your desired temperature threshold

                            if (sensorData.electronic > electronicThreshold) {
                                dataRow.classList.add('highlighted-row');
                            }

                            tbody.appendChild(dataRow);
                        }
                        table.appendChild(tbody);
sensorDataContainer.innerHTML = '';
        sensorDataContainer.appendChild(table);
                    } else if (sensorName == 'Leaf Moisture Sensor') {
                        const table = document.createElement('table');
                        table.className = 'sensor-table';

                        // Create table row for table headings
                        const thead = document.createElement('thead');
                        const headingRow = document.createElement('tr');
                        const headings = ['ID', 'Timestamp', 'Leaf Moisture'];
                        for (const heading of headings) {
                            const th = document.createElement('th');
                            th.textContent = heading;
                            headingRow.appendChild(th);
                        }
                        thead.appendChild(headingRow);
                        table.appendChild(thead);

                        // Create table rows with values
                        const tbody = document.createElement('tbody');
                        for (const sensorData of sensorDataArray) {
                            const dataRow = document.createElement('tr');
                            const keys = ['id', 'timestamp', 'leaf'];
                            for (const key of keys) {
                                const td = document.createElement('td');
                                td.textContent = sensorData[key];
                                dataRow.appendChild(td);
                            }

                            // Check and apply highlight if temperature or humidity crosses threshold
                            const leafThreshold = 0; // Change this to your desired temperature threshold

                            if (sensorData.leaf == leafThreshold) {
                                dataRow.classList.add('highlighted-row');
                            }

                            tbody.appendChild(dataRow);
                        }
                        table.appendChild(tbody);
sensorDataContainer.innerHTML = '';
        sensorDataContainer.appendChild(table);
                    } else if (sensorName == 'Optical Sensor') {
                        const table = document.createElement('table');
                        table.className = 'sensor-table';

                        // Create table row for table headings
                        const thead = document.createElement('thead');
                        const headingRow = document.createElement('tr');
                        const headings = ['ID', 'Timestamp', 'Leaf Color Intensity'];
                        for (const heading of headings) {
                            const th = document.createElement('th');
                            th.textContent = heading;
                            headingRow.appendChild(th);
                        }
                        thead.appendChild(headingRow);
                        table.appendChild(thead);

                        // Create table rows with values
                        const tbody = document.createElement('tbody');
                        for (const sensorData of sensorDataArray) {
                            const dataRow = document.createElement('tr');
                            const keys = ['id', 'timestamp', 'optical'];
                            for (const key of keys) {
                                const td = document.createElement('td');
                                td.textContent = sensorData[key];
                                dataRow.appendChild(td);
                            }

                            // Check and apply highlight if temperature or humidity crosses threshold
                            const opticalThreshold = 213; // Change this to your desired temperature threshold

                            if (sensorData.optical > opticalThreshold) {
                                dataRow.classList.add('highlighted-row');
                            }

                            tbody.appendChild(dataRow);
                        }
                        table.appendChild(tbody);
sensorDataContainer.innerHTML = '';
        sensorDataContainer.appendChild(table);
                    } else if (sensorName == 'Nutrient Sensor') {
                        const table = document.createElement('table');
                        table.className = 'sensor-table';

                        // Create table row for table headings
                        const thead = document.createElement('thead');
                        const headingRow = document.createElement('tr');
                        const headings = ['ID', 'Timestamp', 'Nutrients Level'];
                        for (const heading of headings) {
                            const th = document.createElement('th');
                            th.textContent = heading;
                            headingRow.appendChild(th);
                        }
                        thead.appendChild(headingRow);
                        table.appendChild(thead);

                        // Create table rows with values
                        const tbody = document.createElement('tbody');
                        for (const sensorData of sensorDataArray) {
                            const dataRow = document.createElement('tr');
                            const keys = ['id', 'timestamp', 'nutrient'];
                            for (const key of keys) {
                                const td = document.createElement('td');
                                td.textContent = sensorData[key];
                                dataRow.appendChild(td);
                            }

                            // Check and apply highlight if temperature or humidity crosses threshold
                            const nutrientThreshold = 300; // Change this to your desired temperature threshold

                            if (sensorData.nutrient > nutrientThreshold) {
                                dataRow.classList.add('highlighted-row');
                            }

                            tbody.appendChild(dataRow);
                        }
                        table.appendChild(tbody);
sensorDataContainer.innerHTML = '';
        sensorDataContainer.appendChild(table);
                    } else if (sensorName == 'Wind Speed Sensor') {
                        const table = document.createElement('table');
                        table.className = 'sensor-table';

                        // Create table row for table headings
                        const thead = document.createElement('thead');
                        const headingRow = document.createElement('tr');
                        const headings = ['ID', 'Timestamp', 'Wind Speed'];
                        for (const heading of headings) {
                            const th = document.createElement('th');
                            th.textContent = heading;
                            headingRow.appendChild(th);
                        }
                        thead.appendChild(headingRow);
                        table.appendChild(thead);

                        // Create table rows with values
                        const tbody = document.createElement('tbody');
                        for (const sensorData of sensorDataArray) {
                            const dataRow = document.createElement('tr');
                            const keys = ['id', 'timestamp', 'windspeed'];
                            for (const key of keys) {
                                const td = document.createElement('td');
                                td.textContent = sensorData[key];
                                dataRow.appendChild(td);
                            }

                            // Check and apply highlight if temperature or humidity crosses threshold
                            const windspeedThreshold = 40; // Change this to your desired temperature threshold

                            if (sensorData.windspeed > windspeedThreshold) {
                                dataRow.classList.add('highlighted-row');
                            }

                            tbody.appendChild(dataRow);
                        }
                        table.appendChild(tbody);

                        sensorDataContainer.innerHTML = '';
        sensorDataContainer.appendChild(table);

                    } else if (sensorName == 'CO2 Sensor') {
                        const table = document.createElement('table');
                        table.className = 'sensor-table';

                        // Create table row for table headings
                        const thead = document.createElement('thead');
                        const headingRow = document.createElement('tr');
                        const headings = ['ID', 'Timestamp', 'CO2 Levels'];
                        for (const heading of headings) {
                            const th = document.createElement('th');
                            th.textContent = heading;
                            headingRow.appendChild(th);
                        }
                        thead.appendChild(headingRow);
                        table.appendChild(thead);

                        // Create table rows with values
                        const tbody = document.createElement('tbody');
                        for (const sensorData of sensorDataArray) {
                            const dataRow = document.createElement('tr');
                            const keys = ['id', 'timestamp', 'co2'];
                            for (const key of keys) {
                                const td = document.createElement('td');
                                td.textContent = sensorData[key];
                                dataRow.appendChild(td);
                            }

                            // Check and apply highlight if temperature or humidity crosses threshold
                            const co2Threshold = 1500; // Change this to your desired temperature threshold

                            if (sensorData.co2 > co2Threshold) {
                                dataRow.classList.add('highlighted-row');
                            }

                            tbody.appendChild(dataRow);
                        }
                        table.appendChild(tbody);
sensorDataContainer.innerHTML = '';
        sensorDataContainer.appendChild(table);
        
                    }
}
 var myChart=null;

function createLineChart(sensorDataArray,sensorName) {
 
  if(sensorName=='DHT Sensor')
  {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    // Extract the timestamps and temperature values from your sensorDataArray
    const id = sensorDataArray.map(sensorData => sensorData.id);
    const temperature = sensorDataArray.map(sensorData => sensorData.temperature);
    const humidity = sensorDataArray.map(sensorData => sensorData.humidity);

      // If a chart instance already exists, destroy it
    if (myChart) {
        myChart.destroy();
    }

    myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: id,
            datasets: [{
                label: 'Temperature',
                data: temperature,
                fill: false,
                borderColor: 'blue', // Customize the line color
                borderWidth: 2, // Customize the line width
            },{
                label: 'Humidity',
                data: humidity,
                fill: false,
                borderColor: 'red', // Customize the line color
                borderWidth: 2, // Customize the line width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    }
                }
            }
        }
    });
  } else if(sensorName=='Tensiometer')
  {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    // Extract the timestamps and temperature values from your sensorDataArray
    const id = sensorDataArray.map(sensorData => sensorData.id);
    const moisture = sensorDataArray.map(sensorData => sensorData.tensiometer);


      // If a chart instance already exists, destroy it
    if (myChart) {
        myChart.destroy();
    }

    myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: id,
            datasets: [{
                label: 'Soil Moisture',
                data: moisture,
                fill: false,
                borderColor: 'blue', // Customize the line color
                borderWidth: 2, // Customize the line width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    }
                }
            }
        }
    });
  } else if(sensorName=='Photoresistor')
  {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    // Extract the timestamps and temperature values from your sensorDataArray
    const id = sensorDataArray.map(sensorData => sensorData.id);
    const photo = sensorDataArray.map(sensorData => sensorData.photoresistor);


      // If a chart instance already exists, destroy it
    if (myChart) {
        myChart.destroy();
    }

    myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: id,
            datasets: [{
                label: 'Light intensity',
                data: photo,
                fill: false,
                borderColor: 'blue', // Customize the line color
                borderWidth: 2, // Customize the line width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    }
                }
            }
        }
    });
  }else if(sensorName=='GPS Sensor')
  {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    // Extract the timestamps and temperature values from your sensorDataArray
    const id = sensorDataArray.map(sensorData => sensorData.id);
    const gps = sensorDataArray.map(sensorData => sensorData.gps);


      // If a chart instance already exists, destroy it
    if (myChart) {
        myChart.destroy();
    }

    myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: id,
            datasets: [{
                label: 'Location',
                data: gps,
                fill: false,
                borderColor: 'blue', // Customize the line color
                borderWidth: 2, // Customize the line width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    }
                }
            }
        }
    });
  }else if(sensorName=='Accelerometer Sensor')
  {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    // Extract the timestamps and temperature values from your sensorDataArray
    const id = sensorDataArray.map(sensorData => sensorData.id);
    const acc = sensorDataArray.map(sensorData => sensorData.accelerometer);


      // If a chart instance already exists, destroy it
    if (myChart) {
        myChart.destroy();
    }

    myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: id,
            datasets: [{
                label: 'Acceleration',
                data: acc,
                fill: false,
                borderColor: 'blue', // Customize the line color
                borderWidth: 2, // Customize the line width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    }
                }
            }
        }
    });
  }else if(sensorName=='Airflow Sensor')
  {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    // Extract the timestamps and temperature values from your sensorDataArray
    const id = sensorDataArray.map(sensorData => sensorData.id);
    const air = sensorDataArray.map(sensorData => sensorData.airflow);


      // If a chart instance already exists, destroy it
    if (myChart) {
        myChart.destroy();
    }

    myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: id,
            datasets: [{
                label: 'Airflow',
                data: air,
                fill: false,
                borderColor: 'blue', // Customize the line color
                borderWidth: 2, // Customize the line width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    }
                }
            }
        }
    });
  }else if(sensorName=='Electronic Sensor')
  {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    // Extract the timestamps and temperature values from your sensorDataArray
    const id = sensorDataArray.map(sensorData => sensorData.id);
    const elec = sensorDataArray.map(sensorData => sensorData.electronic);


      // If a chart instance already exists, destroy it
    if (myChart) {
        myChart.destroy();
    }

    myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: id,
            datasets: [{
                label: 'Electrical Conductivity',
                data: elec,
                fill: false,
                borderColor: 'blue', // Customize the line color
                borderWidth: 2, // Customize the line width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    }
                }
            }
        }
    });
  }else if(sensorName=='Leaf Moisture Sensor')
  {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    // Extract the timestamps and temperature values from your sensorDataArray
    const id = sensorDataArray.map(sensorData => sensorData.id);
    const leaf = sensorDataArray.map(sensorData => sensorData.leaf);


      // If a chart instance already exists, destroy it
    if (myChart) {
        myChart.destroy();
    }

    myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: id,
            datasets: [{
                label: 'Leaf Moisture',
                data: leaf,
                fill: false,
                borderColor: 'blue', // Customize the line color
                borderWidth: 2, // Customize the line width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    }
                }
            }
        }
    });
  }else if(sensorName=='Optical Sensor')
  {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    // Extract the timestamps and temperature values from your sensorDataArray
    const id = sensorDataArray.map(sensorData => sensorData.id);
    const opt = sensorDataArray.map(sensorData => sensorData.optical);


      // If a chart instance already exists, destroy it
    if (myChart) {
        myChart.destroy();
    }

    myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: id,
            datasets: [{
                label: 'Leaf Color Intensity',
                data: opt,
                fill: false,
                borderColor: 'blue', // Customize the line color
                borderWidth: 2, // Customize the line width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    }
                }
            }
        }
    });
  }else if(sensorName=='Nutrient Sensor')
  {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    // Extract the timestamps and temperature values from your sensorDataArray
    const id = sensorDataArray.map(sensorData => sensorData.id);
    const nut = sensorDataArray.map(sensorData => sensorData.nutrient);


      // If a chart instance already exists, destroy it
    if (myChart) {
        myChart.destroy();
    }

    myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: id,
            datasets: [{
                label: 'Nutrients Level',
                data: nut,
                fill: false,
                borderColor: 'blue', // Customize the line color
                borderWidth: 2, // Customize the line width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    }
                }
            }
        }
    });
  }else if(sensorName=='Wind Speed Sensor')
  {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    // Extract the timestamps and temperature values from your sensorDataArray
    const id = sensorDataArray.map(sensorData => sensorData.id);
    const wind = sensorDataArray.map(sensorData => sensorData.windspeed);


      // If a chart instance already exists, destroy it
    if (myChart) {
        myChart.destroy();
    }

    myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: id,
            datasets: [{
                label: 'Wind Speed',
                data: wind,
                fill: false,
                borderColor: 'blue', // Customize the line color
                borderWidth: 2, // Customize the line width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    }
                }
            }
        }
    });
  }else if(sensorName=='CO2 Sensor')
  {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    // Extract the timestamps and temperature values from your sensorDataArray
    const id = sensorDataArray.map(sensorData => sensorData.id);
    const carbon = sensorDataArray.map(sensorData => sensorData.co2);


      // If a chart instance already exists, destroy it
    if (myChart) {
        myChart.destroy();
    }

    myChart=new Chart(ctx, {
        type: 'line',
        data: {
            labels: id,
            datasets: [{
                label: 'CO2 Levels',
                data: carbon,
                fill: false,
                borderColor: 'blue', // Customize the line color
                borderWidth: 2, // Customize the line width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    }
                }
            }
        }
    });
  }
}




var chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5, // Adjust the step size of y-axis ticks
        font: {
          size: 14, // Adjust the font size of the y-axis labels
        },
      },
    },
    x: {
      ticks: {
        maxRotation: 0, // Rotate x-axis labels to fit better if needed
        font: {
          size: 14, // Adjust the font size of the x-axis labels
        },
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        font: {
          size: 16, // Adjust the font size of the legend (heading) labels
        },
      },
    },
  },
};

}

  function showInbox() {
    var profileSection = document.getElementById('my-profile');
    var dashboardSection = document.getElementById('dashboard');
    var inboxSection = document.getElementById('inbox');

    profileSection.classList.add('hidden');
    dashboardSection.classList.add('hidden');
    inboxSection.classList.remove('hidden');
    
  }

  document.getElementById('query-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var queryTextarea = document.getElementById('query-text');
    var query = queryTextarea.value;

    // Send the query to the expert's portal backend server
    socket.send(query);

    // Process the query in the inbox
    processQuery(query);

    // Clear the query textarea
    queryTextarea.value = '';
  });

  function processQuery(query) {
    var inboxMessages = document.getElementById('inbox-messages');
    var queryDiv = document.createElement('div');
    queryDiv.textContent = query;
    inboxMessages.appendChild(queryDiv);
  }

  // Farmer-1 button click event handler
  var farmer1Button = document.getElementById('farmer1-button');
  farmer1Button.addEventListener('click', function () {
    // Simulate fetching sensor data for Farmer-1
    var sensorData = [
      { name: 'Sensor 1', status: 'Active', online: true, image: 'sensor1.jpg' },
      { name: 'Sensor 2', status: 'Inactive', online: false, image: 'sensor2.jpg' },
      { name: 'Sensor 3', status: 'Active', online: true, image: 'sensor3.jpg' },
      // Add more sensors as needed
    ];

    var sensorContainer = document.getElementById('sensor-container');
    sensorContainer.innerHTML = ''; // Clear existing sensors

    // Generate sensor buttons for Farmer-1
    sensorData.forEach(function (sensor) {
      var sensorButton = document.createElement('button');
      sensorButton.classList.add('sensor-button');
      if (sensor.online) {
        sensorButton.classList.add('online');
      } else {
        sensorButton.classList.add('offline');
      }

      // Create sensor image element
      var sensorImage = document.createElement('img');
      sensorImage.src = sensor.image;
      sensorImage.alt = sensor.name;
      sensorImage.classList.add('sensor-image');
      sensorButton.appendChild(sensorImage);

      // Create sensor name element
      var sensorName = document.createElement('span');
      sensorName.textContent = sensor.name;
      sensorName.classList.add('sensor-name');
      sensorButton.appendChild(sensorName);

      // Create sensor status element
      var sensorStatus = document.createElement('span');
      sensorStatus.textContent = 'Status: ' + sensor.status;
      sensorStatus.classList.add('sensor-status');
      sensorButton.appendChild(sensorStatus);

      // Add blinking animation for inactive sensors
      if (!sensor.online) {
        var blinkingLight = document.createElement('div');
        blinkingLight.classList.add('blinking-light');
        sensorButton.appendChild(blinkingLight);
      }

      sensorContainer.appendChild(sensorButton);
    });
  });
});










