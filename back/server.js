const axios = require('axios');

// Example GET request
axios.get('https://your-blockchain-api.com/api/endpoint')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

// Example POST request
axios.post('https://your-blockchain-api.com/api/endpoint', { data: 'value' })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });




