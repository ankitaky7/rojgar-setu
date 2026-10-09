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
        enum: ['carpenter', 'mason', 'plumber', 'helper', 'electrician']
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
        required: [true, 'Phone number is required']
    },
    address: {
    type: String,
    required: true
  },
  // Geospatial Data (MongoDB GeoJSON format)
  location: {
    type: {
        type: 'String',
        enum: ['Point'],
        default: 'Point'
    },
  }
})

const job = mongoose.model('job', jobSchema);

module.exports = job;