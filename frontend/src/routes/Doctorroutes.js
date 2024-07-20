import { useAuth } from './Context';
import { Routes, Route } from "react-router-dom";
import Error from "../PrivateComponents/Error";
import Header from '../PrivateComponents/Doctor/DoctorHeader';
import ChatHistory from '../PrivateComponents/Doctor/ChatHistroy';
import DoctorChatRequest from '../PrivateComponents/Doctor/DoctorChatRequest';
import PatientsList from '../PrivateComponents/Doctor/PatientsList';
export default function Doctorroutes() {
    const { isDoctor } = useAuth();

    if (isDoctor() === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header />
            <Routes>
                 <Route path="/patients" element={<PatientsList/>}/>
                 <Route path="/chatrequest" element={<DoctorChatRequest/>}/>
                 <Route path="/chathistory" element={<ChatHistory/>}/>
                {isDoctor() && <Route path="*" element={<Error />} />}
            </Routes>

        </div>
    )
}