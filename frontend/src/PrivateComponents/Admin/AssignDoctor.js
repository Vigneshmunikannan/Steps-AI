import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssignDoctor.css';
import MessageComponent from '../../Response/Message';
import { useAuth } from '../../routes/Context';
const AssignDoctor = () => {
    const { logout, isAdmin, accessToken } = useAuth();

    if (!isAdmin()) {
        logout();
    }
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Fetch patients and doctors
        axios.get(`${process.env.REACT_APP_API_URL}/patients`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => setPatients(response.data))
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    setErrorMessage('Invaild session')
                    setTimeout(() => {
                        setErrorMessage('')
                        logout();
                    }, 3000);
                }
                else {
                    setErrorMessage(error.response.data.message)
                    setTimeout(() => setErrorMessage(''), 3000);
                }
            });

        axios.get(`${process.env.REACT_APP_API_URL}/doctors`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => setDoctors(response.data))
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    setErrorMessage('Invaild session')
                    setTimeout(() => {
                        setErrorMessage('')
                        logout();
                    }, 3000);
                }
                else {
                    setErrorMessage(error.response.data.message)
                    setTimeout(() => setErrorMessage(''), 3000);
                }
            });
    }, [accessToken]);

    const handleAssign = () => {

        if (selectedDoctor === '') {
            setErrorMessage("Select Doctor");
            setTimeout(() => {
                setSuccessMessage('')
            }, 1500);
            return;
        }

        if (selectedPatient === '') {
            setErrorMessage("Select Patient");
            setTimeout(() => {
                setSuccessMessage('')
            }, 1500);
            return;
        }

        axios.post(`${process.env.REACT_APP_API_URL}/${selectedPatient}/linkDoctor/${selectedDoctor}`, {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setSuccessMessage(response.data.message);
                setTimeout(() => {
                    setSuccessMessage('')
                    window.location.reload();
                }, 1500);

                // Optionally, you can add further handling like showing a success message
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    setErrorMessage('Invaild session')
                    setTimeout(() => {
                        setErrorMessage('')
                        logout();
                    }, 3000);
                }
                else {
                    setErrorMessage(error.response.data.message)
                    setTimeout(() => setErrorMessage(''), 3000);
                }
            });
    };

    const handleUnassign = (patientId) => {
        axios.delete(`${process.env.REACT_APP_API_URL}/${patientId}/unlinkDoctor`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setSuccessMessage(response.data.message);
                setTimeout(() => {
                    setSuccessMessage('')
                    window.location.reload();
                }, 1500);
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    setErrorMessage('Invaild session')
                    setTimeout(() => {
                        setErrorMessage('')
                        logout();
                    }, 3000);
                }
                else {
                    setErrorMessage(error.response.data.message)
                    setTimeout(() => setErrorMessage(''), 3000);
                }
            });
    };

    const filteredPatients = patients.filter(patient =>
        patient.user.name && patient.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDoctors = doctors.filter(doctor =>
        doctor.user.name && doctor.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="assign-doctor-container">
            {successMessage && <MessageComponent type="success" message={successMessage} />}
            {errorMessage && <MessageComponent type="error" message={errorMessage} />}
            <h1>Assign Doctor to Patient</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search patients or doctors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="doctor">Doctor:</label>
                <select id="doctor" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                    <option value="">Select Doctor</option>
                    {filteredDoctors.map(doctor => (
                        <option key={doctor._id} value={doctor._id}>{doctor.user.name}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="patient">Patient:</label>
                <select id="patient" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
                    <option value="">Select Patient</option>
                    {filteredPatients.map(patient => (
                        <option key={patient._id} value={patient._id}>{patient.user.name}</option>
                    ))}
                </select>
            </div>

            <button onClick={handleAssign} className="assign-button">Assign Doctor</button>

            <h2>Assigned Patients</h2>
            <ul>
                {doctors.map(doctor => (
                    <li key={doctor._id}>
                        <h3>{doctor.user.name}</h3>
                        <ul>
                            {doctor.patients.map(patientId => {
                                const patient = patients.find(p => p._id === patientId);
                                return (
                                    patient && (
                                        <li key={patientId}>
                                            {patient.user.name}
                                            <button onClick={() => handleUnassign(patientId,)} className="unassign-button">Remove</button>
                                        </li>
                                    )
                                );
                            })}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AssignDoctor;
