import {Link, useParams, useNavigate} from 'react-router-dom'
import {useEffect, useState} from 'react'
import { ToastContainer, toast } from 'react-toastify'
import {useFetch} from '../hooks/useFetch'
import logoNegocio from '../assets/H2O.png'
import { useForm } from 'react-hook-form'


export const Reset = () => {
    const [showNuevo, setShowNuevo] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const navigate = useNavigate()
    const fetchData = useFetch()
    const {token} = useParams()
    const [tokenValido, setTokenValido] = useState(false)
    const {register, handleSubmit, watch, formState: {errors}} = useForm()

    const cambiarPassword = async (dataForm) =>{

        if (dataForm.password !== dataForm.confirmpassword) {
                return toast.error("Las contraseñas no coinciden"); // 🚩 Dispara el toast y detiene todo
            }

        const body = {
            password: dataForm.password,
            confirmPassword: dataForm.confirmpassword
        }

        const data = await fetchData(`nuevopassword/${token}`, body, 'POST')

        if(data){
            toast.success("Contraseña actualizada correctamente")
            setTimeout(()=>{
                navigate("/?login=true")
            }, 2000)
        }
    }

    useEffect(() => {
        const verificarToken = async()=>{
            const data = await fetchData(`recuperarpassword/${token}`, null, 'GET')
            if (data){
                setTokenValido(true)
            } else{
                setTimeout(()=>{
                    navigate("/")
                }, 3000)
            }
        } 
        verificarToken() 
    }, [token])

return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <img className="h-32 w-auto mb-8" src={logoNegocio} alt="Logo H2O" />

            {tokenValido ? (
                <div className="text-center animate-fade-in bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800">Nueva Contraseña</h2>
                    <p className="text-gray-500 mb-6">Ingresa tu nueva clave de acceso.</p>
                    
                    <form onSubmit={handleSubmit(cambiarPassword)} className="flex flex-col gap-4">
                        <div className='relative mb-4'>
                            <input 
                                type={showNuevo ? "text": "password"} 
                                placeholder="Nueva contraseña" 
                                className={`border p-2 rounded w-full ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                {...register("password", {required: "La contraseña es obligatoria"})}
                                
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 text-left">{errors.password.message}</p>}
                            <button
                                type="button"
                                className="absolute right-3 top-2.5 text-sm text-gray-600 hover:text-gray-800"
                                onClick={() => setShowNuevo(!showNuevo)}
                            >
                                {showPassword ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>

                        <div className='relative mb-4'>
                            <input 
                                type= {showConfirm ? "text": "password"} 
                                placeholder="Confirmar contraseña" 
                                className={`border p-2 rounded w-full ${errors.confirmpassword ? 'border-red-500' : 'border-gray-300'}`}
                                {...register("confirmpassword", {required: "La contraseña es obligatoria"})}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2.5 text-sm text-gray-600 hover:text-gray-800"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showPassword ? "Ocultar" : "Mostrar"}
                            </button>
                            {errors.confirmpassword && <p className="text-red-500 text-xs mt-1 text-left">{errors.confirmpassword.message}</p>}
                        </div>

                        <button type="submit" className="bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition-colors">
                            Actualizar Contraseña
                        </button>
                    </form>
                </div>
            ) : (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl text-gray-600">Validando el acceso...</h2>
                </div>
            )}
        </div>
    )
}