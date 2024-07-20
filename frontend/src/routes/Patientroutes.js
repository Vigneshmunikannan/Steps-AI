import { useAuth } from './Context';
import { Routes, Route } from "react-router-dom";
import Error from "../PrivateComponents/Error";
import Header from '../PrivateComponents/Patient/PatientHeader';
import PatientChatHistory from "../PrivateComponents/Patient/PatientChatHistory"
import LinkedDoctorInfo from '../PrivateComponents/Patient/LinkedDoctorInfo';
export default function Patientroutes() {
    const { isPatient } = useAuth();

    if (isPatient() === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header />
            <Routes>
            
            <Route path="/linkeddoctor" element={<LinkedDoctorInfo/>} />
                <Route path="/interactionhistory" element={<PatientChatHistory/>} />
                {isPatient() && <Route path="*" element={<Error />} />}
            </Routes>

        </div>
    )
}