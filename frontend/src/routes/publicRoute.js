import { Routes, Route } from "react-router-dom";
import Register from "../PublicComponents/Register";
import Login from "../PublicComponents/Login";
import Error from "../PrivateComponents/Error"
import { useAuth } from './Context';
const PublicRoute = () => {
    const { isValidTokenAvailable } = useAuth();
    return (
        <>
            <Routes> 
                 <Route path="/" element={<Register />} />
                 <Route path="/login" element={<Login />} />
                 {!isValidTokenAvailable() && <Route path="*" element={<Error/>}/>}
                 
            </Routes>
        </>

    );
};

export default PublicRoute;
