import React, { useState } from 'react';
import axios from 'axios';
import { Link,useNavigate} from 'react-router-dom';
import './Form.css';
import MessageComponent from '../Response/Message';
import { useAuth } from '../routes/Context';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, formData);
            setSuccessMessage(response.data.msg)
            login(response.data.token,response.data.role);
            if(response.data.role==='admin'){
                navigate('/assigndoctor', { replace: false });
            }
            else if(response.data.role==='doctor'){
                navigate('/patients', { replace: false });
            }
            else if(response.data.role==='patient')
            {
                navigate('/interactionhistory', { replace: false });
            }
            
            setTimeout(() => {
                setSuccessMessage('')
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
            <h2>Login</h2>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
            <p>Don't have an account? <Link to="/">Register here</Link></p>
        </form>
       </div>
    );
};

export default Login;
