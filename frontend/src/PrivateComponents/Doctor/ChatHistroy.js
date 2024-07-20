import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ChatHistory.css';

import { useAuth } from '../../routes/Context';

const ChatHistory = () => {
    const { accessToken, logout } = useAuth();
    const [interactions, setInteractions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/doctorschathistroy`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log(response.data);
                setInteractions(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    logout();
                } else {
                    setError(error.response ? error.response.data.message : 'Error fetching chat history');
                }
            }
        };

        fetchChatHistory();
    }, [accessToken, logout]);

    return (
        <div className="chat-history-container">
            {error && <p className="error">{error}</p>}
            {!error && (
                <div className="chat-history">
                    {interactions.map(interaction => (
                        <div key={interaction._id} className="chat-interaction">
                            <div className="chat-header">
                                <p><strong>Patient ID:</strong> {interaction.patient._id}</p>
                                <p><strong>Doctor ID:</strong> {interaction.doctor._id}</p>
                            </div>
                            <div className="chat-details">
                                <p><strong>Status:</strong> {interaction.status}</p>
                                <p><strong>Started At:</strong> {new Date(interaction.startTime).toLocaleString()}</p>
                                <p><strong>Ended At:</strong> {interaction.endTime ? new Date(interaction.endTime).toLocaleString() : 'Ongoing'}</p>
                                <p><strong>Doctor Specialization:</strong> {interaction.doctor.specialization}</p>
                                <p><strong>Doctor Availability:</strong> {interaction.doctor.availability}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatHistory;
