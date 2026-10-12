const express = require("express");
const {createJob, updateJobStatus, getNearbyJobs} = require('../controllers/jobController');
const router = express.Router();

router.post('/create', createJob);
router.get('/nearby', getNearbyJobs);
router.patch('/updateJob/:id/status', updateJobStatus);

module.exports = router;