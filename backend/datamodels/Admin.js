const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;