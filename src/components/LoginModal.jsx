import { useState, useEffect} from "react"
import { useFetch } from "../hooks/useFetch"

import { toast } from "react-toastify"
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import useAuthStore from '../context/storeAuth'
import storeProfile from "../context/storeProfile"
import useAddressesStore from '../context/storeAddress'



const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onSwitchToRecoveryPassword }) => {

    const [showPassword, setShowPassword] = useState(false)

    const fetchData = useFetch()

    const navigate = useNavigate()

    const setAuth = useAuthStore((state) => state.setAuth)

    const setAddresses = useAddressesStore((state) => state.setAddresses)

    const setProfile = storeProfile((state) => state.setProfile)

    const [form, setForm] = useState({
        email: "",
        password: ""
    })



    if (!isOpen) return null

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            const data = await fetchData("login", form, "POST");
            
            if(data?.token){
                const user = data.user || data

                const userRole = data.role || user.role;
                const userId = user._id;

                setAuth(data.token, userRole, { _id: userId })

                // Usamos la función setProfile pasando el objeto de usuario (soporta data.user o data directo)
                setProfile(user);

                setAddresses(data.addresses || user.addresses || [])

                // Obtenemos el nombre del usuario

                const nombreUsuario = user.name || user.nombre || "Usuario";

                onClose()
                navigate("/")
                
                toast.success(`Bienvenido de nuevo ${nombreUsuario}!`)

            }
        }catch (error){
            console.error("Error en el login:", error);
        }
    }

    return (

            <div className="w-full">

                <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Correo"
                        className="w-full mb-3 p-2 border rounded"
                        onChange={handleChange}
                        required
                    />

                    {/* Campo Contraseña con opción de visualizar */}
                    <div className="relative mb-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            placeholder="Contraseña"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-2.5 text-sm text-gray-600 hover:text-gray-800"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Entrar
                    </button>

                </form>

                    <p className="mt-3 text-sm text-black"
                    >
                        ¿Olvidaste tu contraseña?{" "}
                        <span className="text-blue-600 cursor-pointer underline"
                        onClick={()=>{
                            onClose()
                            onSwitchToRecoveryPassword()
                        }}>
                            Recupérala aquí
                        </span>
                    </p>


                <p className="mt-3 text-sm text-center">
                    ¿No tienes cuenta?{" "}
                    <span className="text-blue-600 cursor-pointer"
                        onClick={() =>{
                            onClose()
                            onSwitchToRegister()
                        }}
                    >
                    Registrate
                    </span>
                </p>
            </div>
    )
}

export default LoginModal