import { Navigate, Outlet } from "react-router-dom";
import storeAuth from "../context/storeAuth";

const PublicRoute = () =>{
    const token = storeAuth((state) = state.token)

    if (token){
        return <Navigate to='/perfil' replace/>
    }

    return <Outlet/>
}

export default PublicRoute