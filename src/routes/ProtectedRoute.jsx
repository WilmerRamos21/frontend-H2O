import { Navigate, Outlet, useLocation } from "react-router-dom";
import storeAuth from "../context/storeAuth";

const ProtectedRoute = ({ allowedRoles}) =>{
    const token = storeAuth((state)=> state.token)
    const rol = storeAuth((state) => state.rol)
    const location = useLocation()

    if (!token){
        return <Navigate to='/?login=true' state={{from: location}} replace/>
    }

    if (allowedRoles && !allowedRoles.includes(rol?.toUpperCase())){
        return <Navigate to ='/' replace/>
    }

    return <Outlet/>
}

export default ProtectedRoute