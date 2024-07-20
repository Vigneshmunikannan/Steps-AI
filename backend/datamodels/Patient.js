const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    linkedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    chatInteractions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatInteraction'
    }]
}, {
    timestamps: true
});

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;
