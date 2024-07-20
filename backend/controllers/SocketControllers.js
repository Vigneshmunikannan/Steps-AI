const Interaction = require("../datamodels/ChatInteraction");
const Message = require("../datamodels/ChatMessage");
const Patient = require("../datamodels/Patient");
const Doctor = require("../datamodels/Doctor");
const User = require("../datamodels/UserModel");
const doctorSocketMap = new Map();
const patientSocketMap = new Map();

const handleSocketConnections = (socket, io) => {
    // On connection, store socket IDs for doctors and patients
    (async () => {
        try {
            const userId = socket.user.id;
            console.log("Processing user ID:", userId);

            // Find the user
            const user = await User.findById(userId);
            if (!user) {
                console.log('User not found');
                return;
            }

            // Remove existing socket connections
            if (user.role === 'doctor') {
                doctorSocketMap.forEach((socketId, doctorId) => {
                    if (socketId === socket.id) {
                        doctorSocketMap.delete(doctorId);
                        console.log(`Removed old socket connection for doctor ${doctorId}`);
                    }
                });
            } else if (user.role === 'patient') {
                patientSocketMap.forEach((socketId, patientId) => {
                    if (socketId === socket.id) {
                        patientSocketMap.delete(patientId);
                        console.log(`Removed old socket connection for patient ${patientId}`);
                    }
                });
            }

            // Find Doctor or Patient based on role
            if (user.role === 'doctor') {
                const doctor = await Doctor.findOne({ user: userId });
                if (doctor) {
                    doctorSocketMap.set(doctor._id.toString(), socket.id);
                    console.log(`Doctor ${doctor._id} connected with socket ID ${socket.id}`);
                } else {
                    console.log('Doctor not found');
                }
            } else if (user.role === 'patient') {
                const patient = await Patient.findOne({ user: userId });
                if (patient) {
                    patientSocketMap.set(patient._id.toString(), socket.id);
                    console.log(`Patient ${patient._id} connected with socket ID ${socket.id}`);
                } else {
                    console.log('Patient not found');
                }
            } else {
                console.log('Invalid user role');
            }
        } catch (error) {
            console.error('Error in connection handler:', error);
        }
    })();

    // Handle disconnection
    socket.on('disconnect', () => {
        doctorSocketMap.forEach((socketId, doctorId) => {
            if (socketId === socket.id) {
                doctorSocketMap.delete(doctorId);
                console.log(`Doctor ${doctorId} disconnected`);
            }
        });
        patientSocketMap.forEach((socketId, patientId) => {
            if (socketId === socket.id) {
                patientSocketMap.delete(patientId);
                console.log(`Patient ${patientId} disconnected`);
            }
        });
    });

    // Handle starting a conversation
    socket.on('startConversation', async (callback) => {
        try {
            const patientId = socket.user.id;

            const patient = await Patient.findOne({ user: patientId }).populate('linkedDoctor');
            if (!patient || !patient.linkedDoctor) {
                callback({ success: false, message: 'Patient or linked doctor not found' });
                return;
            }

            // Check for an ongoing interaction
            let interaction = await Interaction.findOne({ patient: patient._id, status: 'ongoing' });

            if (!interaction) {
                // No ongoing interaction, create a new one
                interaction = new Interaction({
                    patient: patient._id,
                    status: 'pending',
                    startTime: new Date(),
                });
                await interaction.save();
            }

            // Fetch the doctor's socket ID
            const doctorSocketId = doctorSocketMap.get(patient.linkedDoctor._id.toString());

            if (doctorSocketId) {
                io.to(doctorSocketId).emit('newConversationRequest', interaction);
            }
            callback({ success: true, interaction });

        } catch (error) {
            console.error('Error starting conversation:', error);
            callback({ success: false, message: 'Internal server error' });
        }
    });

    socket.on('acceptConversation', async (interactionId) => {
        try {
            const doctorId = socket.user.id;
    
            // Ensure the doctor socket ID is correctly set
            const doctor = await Doctor.findOne({ user: doctorId });
            if (doctor) {
                doctorSocketMap.set(doctor._id.toString(), socket.id);
                console.log(`Doctor ${doctor._id} connected with socket ID ${socket.id}`);
            } else {
                console.log('Doctor not found');
                return;
            }
    
            // Update the interaction
            const interaction = await Interaction.findByIdAndUpdate(interactionId, {
                doctor: doctor._id,
                status: 'ongoing',
            }, { new: true });
    
            if (interaction) {
                // Fetch the patientSocketId from the map
                const patientSocketId = patientSocketMap.get(interaction.patient.toString());
                console.log("Patient Socket ID:", patientSocketId);
    
                // Emit to the patient if their socket ID exists
                if (patientSocketId) {
                    console.log(patientSocketMap,patientSocketId)
                    io.to(patientSocketId).emit('conversationStarted', interaction);
                } else {
                    console.warn("Patient socket ID not found for patient:", interaction.patient);
                }
    
                // Emit to the doctor as well
                io.to(socket.id).emit('conversationStarted', interaction);
            } else {
                console.warn("Interaction not found or already updated.");
            }
        } catch (error) {
            console.error('Error accepting conversation:', error);
        }
    });

    // Handle sending a message
    socket.on('sendMessage', async (messageData) => {
        try {
            const message = new Message(messageData);
            await message.save();

            const interaction = await Interaction.findById(messageData.interaction);

            if (interaction) {
                io.to(patientSocketMap.get(interaction.patient.toString())).emit('receiveMessage', message);
                io.to(doctorSocketMap.get(interaction.doctor.toString())).emit('receiveMessage', message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    // Handle ending a conversation
    socket.on('endConversation', async (interactionId) => {
        try {
            const interaction = await Interaction.findByIdAndUpdate(interactionId, {
                status: 'ended',
                endTime: new Date(),
            }, { new: true });

            if (interaction) {
                io.to(patientSocketMap.get(interaction.patient.toString())).emit('conversationEnded', interaction);
                io.to(doctorSocketMap.get(interaction.doctor.toString())).emit('conversationEnded', interaction);
            }
        } catch (error) {
            console.error('Error ending conversation:', error);
        }
    });
}

module.exports = { handleSocketConnections };
