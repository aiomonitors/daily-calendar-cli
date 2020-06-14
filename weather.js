const fetch = require('node-fetch');

const APPID = '2e72b3e3a25ff8c42b56b7d493e380b8';
(async() => {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=11427,us&units=imperial&appid=2e72b3e3a25ff8c42b56b7d493e380b8`);
    const data = await res.json();
    console.log(data);
})();