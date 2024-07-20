import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../routes/Context';

export default function Error() {
  const navigate = useNavigate();
  const { isValidTokenAvailable,isAdmin,isDoctor,isPatient } = useAuth();

  const handleGoToHome1 = () => {
    // Handle for both user and admin
    if (isAdmin()) {
      console.log("I'm admin");
      navigate('/assigndoctor', { replace: false });
    } 
    else if(isDoctor()){
      console.log("I'm doctor");
      navigate('/patients', { replace: false });
    }
    else if(isPatient()){
      console.log("I'm patient");
      navigate('/interactionhistory', { replace: false });
    }
    
  };

  const handleGoToHome2 = () => {
    console.log("I'm home");
    navigate('/', { replace: true });
  };

  const loggedIn = isValidTokenAvailable();

  // Check if the user is authenticated
  if (loggedIn) {
    return (
      <div className='error-container'>
        <div className='error-content'>
          <p className="error-text">404 page requested</p>
          <button onClick={handleGoToHome1} className="error-button">
            Go to Home
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className='error-container'>
        <div className='error-content'>
          <p className="error-text">404 page not found</p>
          <button onClick={handleGoToHome2} className="error-button">
            Go to Home
          </button>
        </div>
      </div>
    );
  }
}
