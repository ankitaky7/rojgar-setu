const express = require("express");
const router = express.Router();
const { registerOrUpdateWorker, toggleWorkerAvailability } = require('../controllers/workerController');

// worker route
router.post('/onboard', registerOrUpdateWorker);
router.post('/toggle-status', toggleWorkerAvailability);

module.exports = router;