const asynchandler = require('express-async-handler');

const User = require('../datamodels/UserModel');
const Doctor = require('../datamodels/Doctor');
const Patient = require('../datamodels/Patient');
const Admin = require('../datamodels/Admin');
const mongoose=require('mongoose')
const Interaction=require('../datamodels/ChatInteraction')


const getAllChatHistroy=asynchandler(async(req,res)=>{
    const userId = req.user.id;


    if (req.user.role !== 'doctor') {
        res.status(403);
        throw new Error('Access forbidden: not a doctor')
    }

    const doctor = await Doctor.findOne({ user: userId });
        if (!doctor) {
            res.status(404);
            throw new Error('Doctor not found')
        }
        const doctorId = doctor._id;
        const interactions = await Interaction.find({ doctor: doctorId }).populate('patient doctor');

        if (!interactions.length) {
            res.status(404);
            throw new Error('No interactions found')
        }
        res.status(200).json(interactions);
})


const getAllPatientsForDoctor = asynchandler(async (req, res) => {
    const userId = req.user.id;

    if (req.user.role !== 'doctor') {
        res.status(403);
        throw new Error('Access forbidden: not a doctor');
    }

    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
        res.status(404);
        throw new Error('Doctor not found');
    }

    const patients = await Patient.find({ linkedDoctor: doctor._id }).populate('user');

    if (!patients.length) {
        res.status(404);
        throw new Error('No patients found');
    }

    res.status(200).json(patients);
});

module.exports = {
    getAllChatHistroy,
    getAllPatientsForDoctor
};