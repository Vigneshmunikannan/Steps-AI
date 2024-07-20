const asynchandler = require('express-async-handler');

const User = require('../datamodels/UserModel');
const Doctor = require('../datamodels/Doctor');
const Patient = require('../datamodels/Patient');
const Admin = require('../datamodels/Admin');
const mongoose=require('mongoose')


const getAllPatients = asynchandler(async (req, res) => {
    const patients = await Patient.find().populate('user', 'name');
    if (patients) {
        res.status(200).json(patients);
    }
    else {
        res.status(500);
        throw new Error('Server error');
    }
})


const getAllDoctors = asynchandler(async (req, res) => {
    const doctors = await Doctor.find().populate('user', 'name');
    if (doctors) {
        res.status(200).json(doctors);
    }
    else {
        res.status(500);
        throw new Error('Server error');
    }
})


const assign = asynchandler(async (req, res) => {
    const { patientId, doctorId } = req.params;

    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    if (!doctor) {
        res.status(404);
        throw new Error('Doctor not found');
    }
    if (doctor.patients.includes(patientId)) {
        res.status(400);
        throw new Error('Patient is already assigned to this doctor');
    }
      // Check if the patient is already linked to another doctor
      if (patient.linkedDoctor) {
        res.status(400);
        throw new Error('Patient is already linked to another doctor');
    }

    patient.linkedDoctor = doctorId;
    doctor.patients.push(patientId);

    // Save patient and doctor independently
    const updatedPatient = await patient.save();
    const updatedDoctor = await doctor.save();

    if (!updatedPatient || !updatedDoctor) {
        res.status(500);
        throw new Error('Failed to update patient or doctor');
    }

    res.json({ message: 'Doctor linked successfully' });
});

const unassign = asynchandler(async (req, res) => {
    const { patientId } = req.params;

    // Find the patient
    const patient = await Patient.findById(patientId);

    // Check if the patient exists
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    // Get the doctorId from the patient's record
    const doctorId = patient.linkedDoctor;

    // Check if the patient is linked to any doctor
    if (!doctorId) {
        res.status(400);
        throw new Error('Patient is not linked to any doctor');
    }

    // Find the doctor
    const doctor = await Doctor.findById(doctorId);

    // Check if the doctor exists
    if (!doctor) {
        res.status(404);
        throw new Error('Doctor not found');
    }

    // Remove the patient from the doctor's list
    doctor.patients = doctor.patients.filter(id => id.toString() !== patientId);

    // Clear the patient's linked doctor
    patient.linkedDoctor = null;

    // Save updates
    const updatedPatient = await patient.save();
    const updatedDoctor = await doctor.save();

    // Check if updates were successful
    if (!updatedPatient || !updatedDoctor) {
        res.status(500);
        throw new Error('Failed to update patient or doctor');
    }

    res.json({ message: 'Doctor unlinked successfully' });
});



module.exports = {
    getAllPatients,
    getAllDoctors,
    assign,
    unassign
};