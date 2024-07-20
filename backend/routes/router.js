const express = require('express')
const router = express.Router()
const {validateToken,adminOnly} = require('../middlewares/validatetoken')
const {
   register,
   login,
   logout,
} = require("../controllers/authControllers")

const {
   getAllPatients,
   getAllDoctors,
   assign,
   unassign,
}=require("../controllers/AdminControllers")


const{
   getAllChatHistroy,
   getAllPatientsForDoctor
}=require("../controllers/DoctorControllers")


const{
   getAllPatientChatHistory,
   getLinkedDoctorInformation
}=require("../controllers/PatientControllers")


// auth routes 
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(validateToken, logout);

// Admin routes 
router.route('/patients').get(validateToken,adminOnly, getAllPatients);
router.route('/doctors').get(validateToken,adminOnly, getAllDoctors);
router.route('/:patientId/linkDoctor/:doctorId').post(validateToken,adminOnly,assign) 
router.route('/:patientId/unlinkDoctor').delete(validateToken,adminOnly,unassign) 

// doctor routes 
router.route('/doctorschathistroy').get(validateToken,getAllChatHistroy );
router.route('/patientsforDoctor').get(validateToken,getAllPatientsForDoctor );

// patient routes 
router.route('/patientschathistory').get(validateToken, getAllPatientChatHistory);
router.route('/linkeddoctor').get(validateToken, getLinkedDoctorInformation);

module.exports = router