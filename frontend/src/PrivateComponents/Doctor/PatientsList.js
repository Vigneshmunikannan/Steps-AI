import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientsList.css';
import { useAuth } from '../../routes/Context';

const PatientsList = () => {
    const { accessToken, logout } = useAuth();
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/patientsforDoctor`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setPatients(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    logout();
                } else {
                    setError(error.response ? error.response.data.message : 'Error fetching patients');
                }
            }
        };

        fetchPatients();
    }, [accessToken, logout]);

    return (
        <div className="patients-list-container">
            {error && <p className="error">{error}</p>}
            {!error && (
                <div className="patients-list">
                    {patients.map(patient => (
                        <div key={patient._id} className="patient-item">
                            <div className="patient-header">
                                <p><strong>Patient ID:</strong> {patient._id}</p>
                                <p><strong>Name:</strong> {patient.user.name}</p>
                            </div>
                            <div className="patient-details">
                                <p><strong>Email:</strong> {patient.user.email}</p>
                                <p><strong>Linked Doctor:</strong> {patient.linkedDoctor}</p>
                                <p><strong>Created At:</strong> {new Date(patient.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientsList;
