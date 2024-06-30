require('dotenv').config();
const axios = require('axios');

const getGeolocation = async (ip) => {
    const apiKey = process.env.IP_API_KEY;
    const url = `https://ipinfo.io/${ip}?token=${apiKey}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching geolocation:', error);
    }
};

const getWeather = async (lat, lon) => {
    const apiKey = process.env.OPEN_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
};
  

const sendResponse = async (req, res) => {
    try {
        let { visitor_name } = req.query;
        if (visitor_name) {
            visitor_name = visitor_name.replace(/^['"](.*)['"]$/, '$1');
        }
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const location = await getGeolocation(ip);
        if (!location || !location.loc) {
            throw new Error('Unable to fetch location data');
          }

        const [lat, lon] = location.loc.split(',');

        const weather = await getWeather(lat, lon);
        if (!weather || !weather.main || !weather.main.temp) {
            throw new Error('Unable to fetch weather data');
        }
    
        const response = {
            "client_ip": ip,
            "location": location.city,
            "greeting": `Hello, ${visitor_name}!, the temperature is ${weather.main.temp} degrees Celcius in ${location.city}`
        }
    
        res.status(200).json(response);
    } catch (error){
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }

}

module.exports = { sendResponse } 