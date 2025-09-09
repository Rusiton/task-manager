import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AppContext } from "../Pages/Context/AppContext";

const ProtectedRoutes = ({ to = 'user' }) => {
    const { user } = useContext(AppContext)

    if (to === 'user' && !user) {
        return <Navigate to={'/login'} />
    }

    if (to === 'guest' && user) {
        return <Navigate to={'/'} />
    }

    return <Outlet />
}

export default ProtectedRoutes;