import { Link } from "react-router-dom"; 
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useFetch } from "../hooks/useFetch";


export const Forgot = () => {

    const { register, handleSubmit, formState: {errors}} = useForm()
    const fetchData = useFetch()

    const sendMail = async(dataForm)=>{
        const data = await fetchData("recuperarpassword", dataForm, 'POST')
        if (data){
            toast.info("Verifica tu correo electrónico" ,{
            position: "top-center",
            autoClose: 5000,
            })
        } else {
            toast.info()
        }
    };
    
    return (
        <div className="flex flex-col sm:flex-row h-screen">
            <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center">
                <div className="md:w-4/5 sm:w-full p-4">
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">
                        ¿Olvidaste tu contraseña?
                    </h1>
                    
                    <form onSubmit={handleSubmit(sendMail)}>
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                            <input 
                                type="email" 
                                placeholder="Ingresa tu correo" 
                                className="block w-full rounded-md border border-gray-300 py-2 px-3"
                                {...register("email", { required: "El correo es obligatorio" })}
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <button className="bg-blue-600 text-white py-2 w-full rounded-xl hover:bg-blue-700 transition">
                            Enviar correo de recuperación
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/" className="text-sm text-blue-600 hover:underline">
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
            {/* Imagen lateral */}
            <div className="hidden sm:block w-1/2 bg-[url('/public/images/forgot.png')] bg-cover bg-center"></div>
        </div>
    );
}
