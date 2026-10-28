const express = require("express");
const router = express.Router();
const {createJob, updateJobStatus, getNearbyJobs} = require('../controllers/jobController');

// job route
router.post('/create', createJob);
router.get('/nearby', getNearbyJobs);
router.patch('/updateJob/:id/status', updateJobStatus);

module.exports = router;