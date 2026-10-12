const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['carpenter', 'mason', 'plumber', 'helper', 'electrician', 'construction']
    },
    wagesPerDay: {
        type: Number,
        required: [true, 'Daily wage is required'],
        min: [300, 'Daily wage must be at least ₹300']
    },
    workersNeeded: {
        type: Number,
        default: 1
    },
    durationDays: {
        type: Number,
        default: 1
    },
    employerName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please Enter a Valid Number']
    },
    address: {
        type: String,
        required: true
    },
    // Geospatial Data (MongoDB GeoJSON format)
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    status: {
        type: String,
        enum: ['open', 'filled'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 172800 // 48 hrs
    }
})

// this indexing helps us to find nearby location upto 5-10 km of radius
jobSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Job', jobSchema);