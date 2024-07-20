const asynchandler = require('express-async-handler');

const User = require('../datamodels/UserModel');
const Doctor = require('../datamodels/Doctor');
const Patient = require('../datamodels/Patient');
const Admin = require('../datamodels/Admin');
const mongoose=require('mongoose')
const Interaction=require('../datamodels/ChatInteraction')







const getAllPatientChatHistory = asynchandler(async (req, res) => {
    const userId = req.user.id;

    if (req.user.role !== 'patient') {
        res.status(403);
        throw new Error('Access forbidden: not a patient');
    }

    const patient = await Patient.findOne({ user: userId });
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    const patientId = patient._id;
    const interactions = await Interaction.find({ patient: patientId }).populate('patient doctor');

    if (!interactions.length) {
        res.status(404);
        throw new Error('No interactions found');
    }

    res.status(200).json(interactions);
});



const getLinkedDoctorInformation = asynchandler(async (req, res) => {
    const userId = req.user.id;

    if (req.user.role !== 'patient') {
        res.status(403);
        throw new Error('Access forbidden: not a patient');
    }

    const patient = await Patient.findOne({ user: userId }).populate('linkedDoctor');
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    const linkedDoctorId = patient.linkedDoctor;
    if (!linkedDoctorId) {
        res.status(404);
        throw new Error('No linked doctor found for this patient');
    }

    const doctor = await Doctor.findById(linkedDoctorId).populate('user');
    if (!doctor) {
        res.status(404);
        throw new Error('Doctor not found');
    }

    res.status(200).json({
        doctorId: doctor._id,
        name: doctor.user.name, // Assuming you have a 'name' field in the User model
        email: doctor.user.email, // Assuming you have an 'email' field in the User model
        specialization: doctor.specialization, // Adjust based on your Doctor model schema
        phone: doctor.phone, // Adjust based on your Doctor model schema
    });
});

module.exports = {
    getAllPatientChatHistory,
    getLinkedDoctorInformation

};