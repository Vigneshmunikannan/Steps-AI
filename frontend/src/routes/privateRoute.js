import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from './Context';
import Adminroutes from "./Adminroutes"
import Patientroutes from "./Patientroutes"
import Doctorroutes from "./Doctorroutes"
const PrivateRoute = () => {
  
  const { isValidTokenAvailable, isAdmin, isDoctor, isPatient} = useAuth()

  if (isValidTokenAvailable() === null) {
    return <div>Loading...</div>; 
  }
  return (
    <>
      <Routes>
         {isValidTokenAvailable() && isAdmin() && <Route path="/*" element={<Adminroutes />} />} 
         {isValidTokenAvailable() && isDoctor() && <Route path="/*" element={<Doctorroutes />} />} 
         {isValidTokenAvailable() && isPatient() && <Route path="/*" element={<Patientroutes />} />} 
      </Routes>
    </>
  );
};

export default PrivateRoute;
