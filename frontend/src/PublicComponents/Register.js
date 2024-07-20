import React, { useState } from 'react';
import axios from 'axios';
import { Link,useNavigate} from 'react-router-dom';
import './Form.css';
import MessageComponent from '../Response/Message';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'patient',
        name: '',
        email: '',
        specialization: '',
        availability: '',
        medicalHistory: ''
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, formData);
            setSuccessMessage(response.data.msg)
            setTimeout(() => {
                setSuccessMessage('')
                navigate('/login', { replace: false });
              }, 1500);
        } catch (error) {
            setErrorMessage(error.response.data.message);
            setTimeout(() => {
              setErrorMessage('')
            }, 3000);
        }
    };
    

    return (
       <div className='container'>
        {successMessage && <MessageComponent type="success" message={successMessage} />}
        {errorMessage && <MessageComponent type="error" message={errorMessage} />}
         <form onSubmit={handleSubmit} className="form-container">
            <h2>Register</h2>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <select name="role" onChange={handleChange} required>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
            </select>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            {formData.role === 'doctor' && (
                <>
                    <input type="text" name="specialization" placeholder="Specialization" onChange={handleChange} />
                    <input type="text" name="availability" placeholder="Availability" onChange={handleChange} />
                </>
            )}
            <button type="submit">Register</button>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </form>
       </div>
    );
};

export default Register;
