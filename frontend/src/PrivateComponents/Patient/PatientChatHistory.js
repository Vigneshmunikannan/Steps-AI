import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientChatHistory.css';
import { useAuth } from '../../routes/Context';

const PatientChatHistory = () => {
    const { accessToken, logout } = useAuth();
    const [interactions, setInteractions] = useState([]);
    const [error, setError] = useState('');
    console.log(interactions)
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/patientschathistory`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setInteractions(response.data);
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Error fetching chat history');
            }
        };

        fetchChatHistory();
    }, []);

    return (
        <div className="chat-history-container">
            {error && <p className="error">{error}</p>}
            { !error && (
                <div className="chat-history">
                    {interactions.map(interaction => (
                        <div key={interaction._id} className="chat-interaction">
                            <div className="chat-header">
                                <p><strong>Patient ID:</strong> {interaction.patient._id}</p>
                                <p><strong>Status:</strong> {interaction.status}</p>
                                <p><strong>Start Time:</strong> {new Date(interaction.startTime).toLocaleString()}</p>
                                {interaction.endTime && <p><strong>End Time:</strong> {new Date(interaction.endTime).toLocaleString()}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientChatHistory;
