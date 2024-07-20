const mongoose = require('mongoose');
const ChatInteractionSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    startTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: { type: String, enum: ['pending', 'ongoing', 'ended'], required: true },
    endTime: Date,
}, {
    timestamps: true
});

const ChatInteraction = mongoose.model('ChatInteraction', ChatInteractionSchema);
module.exports = ChatInteraction;