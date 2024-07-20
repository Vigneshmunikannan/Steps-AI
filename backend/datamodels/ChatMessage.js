const mongoose=require('mongoose')
const ChatMessageSchema = new mongoose.Schema({
    interaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatInteraction',
        required: true
    },
    sender: {
        type: String,
        enum: ['patient', 'doctor', 'chatbot'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true
});

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
module.exports = ChatMessage;
