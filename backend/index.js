const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDb = require('./dbconfig/dbconnection');
const router = require('./routes/router');
const errorHandler = require('./middlewares/errorHandler');
const authenticateSocket = require('./middlewares/socketAuthMiddleware');
const { handleSocketConnections } = require('./controllers/SocketControllers');

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000", // Allow requests from this origin
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization", "Content-Type"],
    }
});

connectDb();
app.use(cors());
app.use(express.json());
app.use('/', router);  // Apply validateToken middleware for HTTP routes
app.use(errorHandler);

// Apply the authenticateSocket middleware to Socket.io connections
io.use(authenticateSocket);

io.on('connection', (socket) => {

    console.log('A user connected:', socket.user);

    handleSocketConnections(socket, io); 
});

const port = process.env.PORT || 5001;
server.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
