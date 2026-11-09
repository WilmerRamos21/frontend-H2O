import { CardProfile } from "../components/profile/CardProfile";
import { CardAddress } from "../components/profile/CardAddress";
import { CardPassword } from "../components/profile/CardPassword";
import { CardOrders } from "../components/profile/CardOrders";
import { CardEmail } from "../components/profile/CardEmail";

import useAuthStore from "../context/storeAuth";
import userAddressStore from "../context/storeAddress";
import storeProfile from "../context/storeProfile"; // Tu nuevo store

import { useFetch } from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';

export const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState("perfil");

    // 1. Extraemos estados y funciones de los stores
    const { addresses, setAddresses} = userAddressStore();
    const { token, rol, logout } = useAuthStore();
    const { profile, setProfile, clearProfile} = storeProfile();
    
    const fetchData = useFetch();
    const navigate = useNavigate();

    // 1.5 Cargar el perfil automáticamente al montar la página si el store está vacío
    useEffect(() => {
            const cargarPerfil = async () => {
                // Si falta el _id o los datos en el store local
                if (!token) return
                try{
                    const res = await fetchData("perfil", {}, "GET")
                    if (res){
                        setProfile(res.user || res)
                    }
                }catch(error){
                    console.error("Error al cargar el perfil: ", error)
                }
            };

            cargarPerfil();
    }, [token]);

    // 2. Lógica de Logout sincronizada
    const handleLogout = () => {
        logout();
        clearProfile();
        navigate("/");

    };


    // 3. Actualizar Datos Personales
    const handleUpdateProfile = async (newData) => {
        const datosParaBackend = {
            name: newData.nombre,
            lastname: newData.apellido,
            phone: newData.telefono
        };
        try {
            const res = await fetchData("actualizarperfil", datosParaBackend, "PUT");
            if (res && res.user) {
                toast.success("Perfil actualizado");
                
                // Sincronizamos el store de perfil inmediatamente
                setProfile(
                    res.user
                );
                return true;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    // 4. Gestión de Direcciones
    const handleAddAddress = async (dataAddress) => {
        try {
            const res = await fetchData(`direcciones`, dataAddress, "POST");
            if (res && res.addresses) {
                toast.success("Dirección agregada");
                setAddresses(res.addresses); // Actualización instantánea
                return true;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            const res = await fetchData(`direcciones/${id}`, {}, "PUT");
            if (res && res.addresses) {
                toast.info("Dirección eliminada");
                setAddresses(res.addresses); //Actualización instantánea
                return true;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    // 5. Gestión de Password (Autenticación)
    const handleUpdatePassword = async (dataPass) => {
        try {
            // Usamos el ID del perfil que está en el store
            const res = await fetchData("actualizarpassword", dataPass, "PUT");
            if (res) {
                toast.success(res.msg || "Contraseña actualizada");
                return true;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };
    // 6. Gestión de Email
    const handleUpdateEmail = async (dataEmail) =>{
        try{
            const res = await fetchData("actualizarcorreo", dataEmail, "PUT")
            if (res){
                toast.success(res.msg || "Correo electrónico actualizado")
                return true
            }
        } catch(error){
            console.error(error)
            return false
        }
    }

return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 p-4 md:p-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 p-2 md:p-6 md:border-r border-gray-200 border-b md:border-b-0">
            <div className="flex items-center gap-4 mb-6 md:mb-10">
                {/* Corregido: md:h-16 (faltaba el guion) */}
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center text-xl md:text-2xl text-blue-600 font-bold">
                    {profile.nombre?.charAt(0) || "U"}
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-700">Hola, {profile.nombre}!</h2>
            </div>
            
            <nav className="flex flex-row md:flex-col gap-2 md:gap-6 text-gray-500 font-medium overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                <button 
                    onClick={() => setActiveSection("perfil")}
                    className={`whitespace-nowrap px-4 py-2 md:pl-4 md:py-0 text-left transition-all ${
                        activeSection === "perfil" 
                        ? "text-blue-600 border-b-2 md:border-b-0 md:border-l-4 border-blue-600 bg-blue-50 md:bg-transparent" 
                        : "hover:text-blue-500"
                    }`}
                >
                    Perfil
                </button>
                <button 
                    onClick={() => setActiveSection("seguridad")}
                    className={`whitespace-nowrap px-4 py-2 md:pl-4 md:py-0 text-left transition-all ${
                        activeSection === "seguridad" 
                        ? "text-blue-600 border-b-2 md:border-b-0 md:border-l-4 border-blue-600 bg-blue-50 md:bg-transparent" 
                        : "hover:text-blue-500"
                    }`}
                >
                    Autenticación
                </button>
                <button 
                    onClick={() => setActiveSection("email")}
                    className={`whitespace-nowrap px-4 py-2 md:pl-4 md:py-0 text-left transition-all ${
                        activeSection === "email" 
                        ? "text-blue-600 border-b-2 md:border-b-0 md:border-l-4 border-blue-600 bg-blue-50 md:bg-transparent" 
                        : "hover:text-blue-500"
                    }`}
                >
                    Correo electrónico
                </button>
                <button 
                    onClick={() => setActiveSection("direcciones")}
                    className={`whitespace-nowrap px-4 py-2 md:pl-4 md:py-0 text-left transition-all ${
                        activeSection === "direcciones" 
                        ? "text-blue-600 border-b-2 md:border-b-0 md:border-l-4 border-blue-600 bg-blue-50 md:bg-transparent" 
                        : "hover:text-blue-500"
                    }`}
                >
                    Direcciones
                </button>

                {/* NUEVO BOTÓN: Pedidos */}
                    <button 
                        onClick={() => setActiveSection("pedidos")}
                        className={`whitespace-nowrap px-4 py-2 md:pl-4 md:py-0 text-left transition-all ${
                            activeSection === "pedidos" 
                            ? "text-blue-600 border-b-2 md:border-b-0 md:border-l-4 border-blue-600 bg-blue-50 md:bg-transparent" 
                            : "hover:text-blue-500"
                        }`}
                    >
                        Pedidos 
                    </button>
                
                {/* El botón Salir: En móvil lo mantenemos en la línea, en desktop le damos el margen superior */}
                <button 
                    onClick={handleLogout} 
                    className="whitespace-nowrap px-4 py-2 md:pl-4 md:mt-10 text-left text-red-500 hover:font-bold transition-all"
                >
                    Salir
                </button>
            </nav>
        </div>

        {/* Contenido Principal */}
        {/* Cambiado: pl-0 md:pl-12 y mt-6 para que no pegue al sidebar en móvil */}
        <div className="w-full md:w-3/4 px-0 md:pl-12 mt-6 md:mt-0">
            {activeSection === "perfil" && (
                <div className="animate-fade-in">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800">Mi Cuenta</h1>
                    <CardProfile userData={profile} onSave={handleUpdateProfile} />
                </div>
            )}

            {activeSection === "seguridad" && (
                <div className="animate-fade-in">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800">Seguridad</h1>
                    <CardPassword onUpdatePassword={handleUpdatePassword} />
                </div>
            )}

            {activeSection === "email" && (
                <div className="animate-fade-in">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800">Correo Electrónico</h1>
                    <CardEmail 
                    currentEmail = {profile.email}
                    onUpdateEmail={handleUpdateEmail} 
                    />
                </div>
            )}

            {activeSection === "direcciones" && (
                <div className="animate-fade-in">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800">Direcciones</h1>
                    <CardAddress 
                        addresses={addresses} 
                        onSaveAddress={handleAddAddress} 
                        onDeleteAddress={handleDeleteAddress} 
                    />
                </div>
            )}
            {/* NUEVA SECCIÓN: Renderizamos la Card de Pedidos */}
                {activeSection === "pedidos" && (
                    <div className="animate-fade-in">
                        <CardOrders />
                    </div>
                )}
        </div>
    </div>
);
};