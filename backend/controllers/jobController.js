const Job = require("../models/Job");

const createJob = async (req, res) => {
    try {
        const {
            title,
            category,
            wagesPerDay,
            workersNeeded,
            phone,
            employerName,
            address,
            longitude,
            latitude
        } = req.body;

        if (!title || !category || !wagesPerDay || !workersNeeded || !phone || !employerName || !address || !longitude || !latitude) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newJob = await Job.create({
            title,
            category,
            wagesPerDay,
            workersNeeded,
            phone,
            employerName,
            address,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            }
        });

        res.status(201).json({ message: "Job Created successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error in Job Creating", error: error.message });
    }
}

const getNearbyJobs = async (req, res) => {
    try {
        const {
            latitude,
            longitude,
            radius
        } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Both latitude and longitude are required" })
        }

        const maxDistanceInMeters = parseInt(radius) || 10000; // 10 km is set by default if user has'nt pass it

        // geospatial query
        const jobs = await Job.find({
            status: 'open',
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: maxDistanceInMeters
                }
            }
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });

    } catch (error) {
        res.status(500).json({ message: "Error in Getting Job", error: error.message });
    }
}

const updateJobStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const updateJob = await Job.findByIdAndUpdate(
            id,
            {status: 'filled'},
            { returnDocument: 'after', runValidators: true }
        );

        if (!updateJob) {
            return res.status(404).json({ message: "Job Not Found" });
        }

        res.status(200).json({
            message: "Job Updated Successfully",
            data: updateJob
        })

    } catch (error) {
        res.status(500).json({ message: "Error in Job Updating", error: error.message });
    }
}

module.exports = {
    createJob,
    getNearbyJobs,
    updateJobStatus
}