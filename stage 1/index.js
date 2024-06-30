require('dotenv').config();
const express = require('express');

const app = express();

const apiRoutes = require('./route/index');

// middleware configuration

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.set('trust proxy', true)

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.status(200).json("Hello, server is up and running");
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on localhost:${process.env.PORT}`);
  });