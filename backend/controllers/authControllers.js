const asynchandler = require('express-async-handler');
const jwt = require('jsonwebtoken')
const { addToBlacklist } = require('../tokenBlacklist')
const bcrypt = require('bcrypt')
const User = require('../datamodels/UserModel');
const Doctor = require('../datamodels/Doctor');
const Patient = require('../datamodels/Patient');
const Admin = require('../datamodels/Admin');


const register = asynchandler(async (req, res) => {
    const { username, name, password, email, role, specialization, availability } = req.body;

    // Check if all required fields are provided
    if (!username || !password || !name || !email || !role) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400);
        throw new Error('Invalid email format');
    }

    // Username validation
    const isValidUsername = (username) => /^[a-zA-Z0-9]+$/.test(username);
    if (!isValidUsername(username)) {
        res.status(400);
        throw new Error('Invalid Username');
    }

    // Name validation
    const isValidName = (name) => /^[a-zA-Z]+$/.test(name);
    if (!isValidName(name)) {
        res.status(400);
        throw new Error('Invalid Name');
    }

    // Check if the username or email is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        res.status(409);
        throw new Error('Username already taken');
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        res.status(409);
        throw new Error('Email already registered');
    }

    // Role-specific validation
    if (role === 'doctor') {
        if (!specialization || !availability) {
            res.status(400);
            throw new Error('Specialization and availability are mandatory for doctors');
        }
    } else if (role !== 'patient' && role !== 'admin') {
        res.status(400);
        throw new Error('Invalid role');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record in the database
    const user = new User({ username, name, email, password: hashedPassword, role });
    await user.save();

    // Create role-specific records
    if (role === 'doctor') {
        const doctor = new Doctor({ user: user._id, specialization, availability });
        await doctor.save();
    } else if (role === 'patient') {
        const patient = new Patient({ user: user._id });
        await patient.save();
    } else if (role === 'admin') {
        const admin = new Admin({ user: user._id });
        await admin.save();
    }

    // Respond with success message
    res.status(200).json({
        id: user.id,
        msg: 'Registration success',
    });

})


const login = asynchandler(async (req, res) => {
    const { username, password } = req.body;
    // Check if username and password are provided
    if (!username || !password) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }
    // Find the user by username
    const user = await User.findOne( { username });
    // Check if user exists and password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
        // Generate JWT token
        const accessToken = jwt.sign(
            {
                user: {
                    id: user._id, 
                    role: user.role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        );

        // Respond with token and success message
        res.status(200).json({
            token: accessToken,
            role:user.role,
            msg: 'Login successful'
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
})


const logout = asynchandler(async (req, res) => {
    const token = req.header('Authorization').split(' ')[1];
    addToBlacklist(token)
    res.status(200).json({ message: 'Logged out successfully' });
})




module.exports = {
    register,
    login,
    logout
};
