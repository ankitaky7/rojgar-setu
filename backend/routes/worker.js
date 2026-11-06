const express = require("express");
const router = express.Router();
const { registerOrUpdateWorker, toggleWorkerAvailability, getNearbyWorkers } = require('../controllers/workerController');

// worker route
router.post('/onboard', registerOrUpdateWorker);
router.patch('/toggle-status', toggleWorkerAvailability);
router.get('/nearby', getNearbyWorkers);

module.exports = router;