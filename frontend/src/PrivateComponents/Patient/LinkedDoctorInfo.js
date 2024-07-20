import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DoctorInfo.css';
import { useAuth } from '../../routes/Context';
const LinkedDoctorInfo = () => {
    const { accessToken, logout } = useAuth();
    const [doctor, setDoctor] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/linkeddoctor`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setDoctor(response.data);
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Error fetching doctor information');
            }
        };

        fetchDoctorInfo();
    }, []);

    return (
        <div className="doctor-info-container">
            {error && <p className="error">{error}</p>}
            {doctor && (
                <div className="doctor-info">
                    <h2>Linked Doctor Information</h2>
                    <p><strong>Name:</strong> {doctor.name}</p>
                    <p><strong>Email:</strong> {doctor.email}</p>
                    <p><strong>Specialization:</strong> {doctor.specialization}</p>
                    <p><strong>Phone:</strong> {doctor.phone}</p>
                </div>
            )}
        </div>
    );
};

export default LinkedDoctorInfo;
