import { useAuth } from './Context';
import { Routes, Route } from "react-router-dom";
import Error from "../PrivateComponents/Error";
import Header from '../PrivateComponents/Admin/AdminHeader';
import AssignDoctor from '../PrivateComponents/Admin/AssignDoctor';
export default function Adminroutes() {
    const { isAdmin } = useAuth();

    if (isAdmin() === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header />
            <Routes>
                <Route path="/assigndoctor" element={<AssignDoctor/>} />
                <Route path="*" element={<Error />} />
            </Routes>

        </div>
    )
}