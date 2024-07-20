import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './PatientChatBot.css';
import { useAuth } from '../../routes/Context';
import MessageComponent from '../../Response/Message';
import bot from "./bot.png"
const PatientChatBot = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { accessToken } = useAuth();
    const [socket, setSocket] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [interaction, setInteraction] = useState(null);
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        const newSocket = socketIOClient(process.env.REACT_APP_API_URL, {
            query: { accessToken }
        });
    
        setSocket(newSocket);
    
        newSocket.on('conversationStarted', (interaction) => {
            console.log("started ")
            setInteraction(interaction);
            setStatus('accepted');
            setSuccessMessage("Conversation started. You can now chat with your doctor.");
        });
    
        newSocket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
    
        newSocket.on('conversationEnded', () => {
            setStatus('ended');
        });
    
        return () => {
            newSocket.disconnect();
        };
    }, [accessToken]);
    

    const handleSendMessage = () => {
        if (newMessage.trim() && interaction) {
            const messageData = {
                interaction: interaction._id,
                sender: 'patient',
                content: newMessage.trim()
            };
            socket.emit('sendMessage', messageData);
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setNewMessage('');
        }
    };

    const handleStartConversation = () => {
        socket.emit('startConversation', (response) => {
            if (response.success) {
                setSuccessMessage("Your request has been sent. Waiting for a doctor to accept.");
                setStatus('pending');
            } else {
                setErrorMessage(response.message || 'Failed to start conversation');
                setStatus('timeout');
            }
        });

        setTimeout(() => {
            if (status === 'pending') {
                setStatus('timeout');
                setErrorMessage('Doctor did not respond in time. Please try again later.');
            }
        }, 300000); // 5 minutes timeout
    };

    const toggleChatWindow = () => {
        setIsChatOpen(!isChatOpen);
        if (!isChatOpen && status !== 'accepted') {
            handleStartConversation();
        }
    };

    return (
        <div className="chatbot-container">
            {successMessage && <MessageComponent type="success" message={successMessage} />}
            {errorMessage && <MessageComponent type="error" message={errorMessage} />}
            <div className="chatbot-icon" onClick={toggleChatWindow}>
                <img src={bot} alt="ChatBot" />
            </div>
            {isChatOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h2>Doctor Chat</h2>
                        <button onClick={() => setIsChatOpen(false)}>&times;</button>
                    </div>
                    <div className="chat-body">
                        {status === 'pending' && <p>Waiting for doctor to accept...</p>}
                        {status === 'timeout' && <p>Doctor is not available. Please try again later.</p>}
                        {status === 'accepted' && (
                            <>
                                {messages.map((msg, index) => (
                                    <div key={index} className={`chat-message ${msg.sender}`}>
                                        <p>{msg.content}</p>
                                    </div>
                                ))}
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
                            </>
                        )}
                        {status === 'ended' && <p>Conversation ended.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientChatBot;
