const axios = require('axios');

async function fetchSensorData(channelName, chaincodeName, id, fcn) {
  const args = [id.toString()];
  const url = `http://localhost:4000/channels/${channelName}/chaincodes/${chaincodeName}?fcn=${fcn}&args=${encodeURIComponent(JSON.stringify(args))}`;

  const response = await axios.get(url);
  const sensorData = response.data;

  return sensorData;
}

module.exports = fetchSensorData;






