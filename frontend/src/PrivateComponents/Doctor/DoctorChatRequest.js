import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useAuth } from '../../routes/Context';
import './DoctorChat.css'; // Make sure you have this CSS file for styling

const DoctorChat = () => {
    const { accessToken } = useAuth();
    const [socket, setSocket] = useState(null);
    const [interactionRequests, setInteractionRequests] = useState([]);
    const [activeInteraction, setActiveInteraction] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const newSocket = socketIOClient(process.env.REACT_APP_API_URL, {
            query: { accessToken },
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log("connected");
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('newConversationRequest', (interaction) => {
            setInteractionRequests((prevRequests) => [...prevRequests, interaction]);
        });

        newSocket.on('conversationStarted', (interaction) => {
            setActiveInteraction(interaction);
            setInteractionRequests((prevRequests) => prevRequests.filter(req => req._id !== interaction._id));
            setShowPopup(true); // Show popup when conversation starts
        });

        newSocket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        newSocket.on('conversationEnded', () => {
            setActiveInteraction(null);
            setMessages([]);
            setShowPopup(false); // Hide popup when conversation ends
        });

        return () => {
            newSocket.disconnect();
            setSocket(null);
        };

    }, [accessToken]);

    const handleAcceptInteraction = (interactionId) => {
        if (socket) {
            socket.emit('acceptConversation', interactionId);
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && activeInteraction) {
            const messageData = {
                interaction: activeInteraction._id,
                sender: 'doctor',
                content: newMessage.trim()
            };
            if (socket) {
                socket.emit('sendMessage', messageData);
            }
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setNewMessage('');
        }
    };

    const handleEndChat = () => {
        if (activeInteraction && socket) {
            socket.emit('endConversation', activeInteraction._id);
        }
    };

    return (
        <div className="doctor-chat-container">
            {showPopup && activeInteraction && (
                <div className="chat-popup">
                    <p>New chat request from Patient ID: {activeInteraction.patient}</p>
                    <button onClick={() => setShowPopup(false)}>Close</button>
                </div>
            )}
            <div className="interaction-requests">
                <h2>Interaction Requests</h2>
                {interactionRequests.map((interaction) => (
                    <div key={interaction._id} className="interaction-request">
                        <p>Patient ID: {interaction.patient}</p>
                        <button onClick={() => handleAcceptInteraction(interaction._id)}>Accept</button>
                    </div>
                ))}
            </div>
            {activeInteraction && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h2>Chat with Patient</h2>
                        <button onClick={handleEndChat}>&times; End Chat</button>
                    </div>
                    <div className="chat-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender}`}>
                                <p>{msg.content}</p>
                            </div>
                        ))}
                    </div>
                    <div className="chat-footer">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
            {!isConnected && <p>Disconnected from server. Reconnecting...</p>}
        </div>
    );
};

export default DoctorChat;
