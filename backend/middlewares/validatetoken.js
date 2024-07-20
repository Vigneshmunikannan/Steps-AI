const asynchandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const {isTokenBlacklisted } = require('../tokenBlacklist')
const Admin =require("../datamodels/Admin")
const validateToken = asynchandler(async (req, res, next) => {
    let token;
    //splitting token from request
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ msg: "User token is missing" });
        throw new Error("User token is missing")
    }

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]; 
        
        if (isTokenBlacklisted(token)) {
            console.log("inside invalid token")
            res.status(401)
            throw new Error("User is not authorized");
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized");
            }
            req.user = decoded.user;
            next()
        });
    }
})


const adminOnly = asynchandler(async (req, res, next) => {
    const admin = await Admin.findOne({ user: req.user.id });

    if (!admin) {
        res.status(403);
        throw new Error('Not authorized as admin');
    }

    next();
});


module.exports = {validateToken,adminOnly}