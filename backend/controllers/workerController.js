const Worker = require("../models/Worker");

// Register a new worker or update availability status
const registerOrUpdateWorker = async (req, res) => {
    try {
        const { name, phone, skill, expectedDailyWage, location } = req.body;

        if (!phone || !location || !location.coordinates) {
            return res.status(400).json({ message: "Phone number and coordinates are required" });
        }

        let worker = await Worker.findOne({ phone });

        if (worker) {
            // Existing worker: update active status and current location
            worker.isOnline = true;
            worker.location.coordinates = [
                parseFloat(location.coordinates[0]),
                parseFloat(location.coordinates[1])
            ];
            if (skill) worker.skill = skill;
            if (expectedDailyWage) worker.expectedDailyWage = Number(expectedDailyWage);
            await worker.save();
        } else {
            // New worker registration: validate required profile fields
            if (!name || !skill || !expectedDailyWage) {
                return res.status(400).json({
                    success: false,
                    message: "All mandatory profile fields (name, skill, expectedDailyWage) must be provided."
                });
            }
        }

        worker = await Worker.create({
            name,
            phone,
            skill,
            expectedDailyWage: Number(expectedDailyWage),
            isOnline: true,
            location
        })

        return res.status(200).json({
            success: true,
            message: "Worker profile successfully updated and status set to active",
            data: worker
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error during worker onboarding.",
            error: error.message
        });
    }
}

const toggleWorkerAvailability = async (req, res) => {
    try {
        const { workerId, isOnline } = req.body;
        
        if (!workerId || typeof isOnline !== 'boolean') {
            return res.status(400).json({ message: "Worker ID and status are required" })
        }

        const worker = await Worker.findByIdAndUpdate(
            workerId,
            {isOnline},
            {returnDocument: "after"}
        );

        if(!worker) {
            return res.status(404).json({message: "Worker not found."});
        }

        res.status(200).json({
            success: true,
            message: `Duty status updated to ${isOnline ? 'Online' : 'Offline'}.`,
            worker
        })

    } catch (error) {
        res.status(500).json({ message: "Failed to update availability", error: error.message });
    }
}

module.exports = {
    registerOrUpdateWorker,
    toggleWorkerAvailability
};