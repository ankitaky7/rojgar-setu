const express = require("express");
const router = express.Router();
const {registerOrUpdateWorker} = require('../controllers/workerController');

// worker route
router.post('/onboard', registerOrUpdateWorker);

module.exports = router;