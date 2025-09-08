import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AppContext } from "../Pages/Context/AppContext";

const ProtectedRoutes = ({ to = 'user' }) => {
    const { user } = useContext(AppContext)

    if (to == 'user') {
        return user ? <Outlet /> : <Navigate to='/login' />
    }

    if (to == 'guest') {
        return !user ? <Outlet /> : <Navigate to='/' />
    }

    
}

export default ProtectedRoutes;