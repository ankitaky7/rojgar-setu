const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    skill: {
        type: String,
        required: true,
        enum: ['Mason', 'Plumber', 'Carpenter', 'Electrician', 'Helper', 'Construction']
    },
    expectedDailyWage: {
        type: Number,
        required: true
    },
    isOnline: {
        type: Boolean,
        default: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    }
},
    {
        timestamps: true
    }
);

workerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Worker', workerSchema);