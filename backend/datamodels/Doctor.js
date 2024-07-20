const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: String,
    availability: String, // e.g., "9am - 5pm"
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }],
    chatInteractions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatInteraction'
    }]
}, {
    timestamps: true
});

const Doctor = mongoose.model('Doctor', DoctorSchema);
module.exports = Doctor;