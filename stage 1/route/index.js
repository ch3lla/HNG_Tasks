const express = require('express');
const { sendResponse } = require("../controller");

const router = express.Router();

router.get('/hello', sendResponse);

module.exports = router;