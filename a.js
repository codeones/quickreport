const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://scrapebee.p.rapidapi.com/screenshot_html',
  params: {url: 'https://rapidapi.com/apishub/api/scrapebee'},
  headers: {
    'X-RapidAPI-Host': 'scrapebee.p.rapidapi.com',
    'X-RapidAPI-Key': '5d972ae61bmsh897ea084ef736c0p1b3ad7jsnebe022b2de12'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});