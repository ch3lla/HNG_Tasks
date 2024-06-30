require('dotenv').config();
const express = require('express');

const app = express();

const apiRoutes = require('./route/index');

// middleware configuration

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.set('trust proxy', true)

app.use('/api', apiRoutes);

app.use((req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.clientIp = clientIp;
    next();
  });
  
  app.get('/get-location', async (req, res) => {
    sendResponse(req, res);
    console.log(req.ip);
    const ip = req.clientIp;
    console.log(`Client IP: ${ip}`);
    
    // Replace with your IPinfo API key
    const apiKey = 'YOUR_IPINFO_API_KEY';
    const url = `https://ipinfo.io/${ip}?token=${apiKey}`;
  
    try {
      const response = await axios.get(url);
      const location = response.data;
      res.json({
        ip,
        location
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving location' });
    }
  });

app.listen(process.env.PORT, () => {
    console.log(`Server is running on localhost:${process.env.PORT}`);
  });