import { useState } from "react";
import { toast } from "react-toastify";

export const CardPassword = ({ onUpdatePassword }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showActual, setShowActual] = useState(false)
    const [showNuevo, setShowNuevo] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [passwords, setPasswords] = useState({
        passwordactual: "",
        passwordnuevo: "",
        confirmPassword: "" // Validación exclusiva del frontend
    });

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwords.passwordnuevo !== passwords.confirmPassword) {
            return toast.error("Las nuevas contraseñas no coinciden");
        }

        // Llamamos a la función que pasamos por props
        const success = await onUpdatePassword({
            passwordactual: passwords.passwordactual,
            passwordnuevo: passwords.passwordnuevo
        });
        
        if (success) {
            setPasswords({ passwordactual: "", passwordnuevo: "", confirmPassword: "" });
            setIsEditing(false);
        }
    };

    // Vista previa (Cerrada)
    if (!isEditing) {
        return (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                    <div className="bg-blue-50 p-4 rounded-full text-blue-600 text-2xl">🔒</div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">Contraseña</h3>
                        <p className="text-gray-500 text-sm">Gestiona la seguridad de tu cuenta</p>
                        <p className="text-lg tracking-[0.3em] text-gray-400 mt-2">******</p>
                    </div>
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                        CAMBIAR
                    </button>
                </div>
            </div>
        );
    }

    // Vista de Edición (Abierta con mensaje de seguridad)
    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border">
            <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center text-blue-600 font-bold mb-6 hover:underline transition"
            >
                <span className="mr-2">←</span> VOLVER
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">Actualizar Contraseña</h1>
            
            {/* Mensaje explicativo para blindar la seguridad visualmente */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-xl">
                <div className="flex items-center">
                    <span className="text-amber-500 text-lg mr-2">🛡️</span>
                    <p className="text-sm text-amber-800 font-medium">
                        Por motivos de seguridad y para proteger tu cuenta, necesitamos verificar tu identidad solicitando tu contraseña actual antes de aplicar cualquier cambio.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md space-y-5">
                
                {/* 1. Contraseña Actual */}
                <div>
                    <label className="block text-gray-500 text-sm font-semibold mb-2">Contraseña Actual</label>
                    <div className="relative">
                        <input 
                            type={showActual ? "text" : "password"}
                            name="passwordactual"
                            placeholder="Ingresa tu clave actual"
                            className="w-full p-3 pr-20 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                            value={passwords.passwordactual}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800"
                            onClick={() => setShowActual(!showActual)}
                        >
                            {showActual ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>
                </div>

                <hr className="border-gray-100 my-2" />

                {/* 2. Nueva Contraseña */}
                <div>
                    <label className="block text-gray-500 text-sm font-semibold mb-2">Nueva Contraseña</label>
                    <div className="relative">
                        <input 
                            type={showNuevo ? "text" : "password"}
                            name="passwordnuevo"
                            placeholder="Mínimo 8 caracteres, mayúscula y número"
                            className="w-full p-3 pr-20 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                            value={passwords.passwordnuevo}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800"
                            onClick={() => setShowNuevo(!showNuevo)}
                        >
                            {showNuevo ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>
                </div>

                {/* 3. Confirmar Nueva Contraseña */}
                <div>
                    <label className="block text-gray-500 text-sm font-semibold mb-2">Confirmar Nueva Contraseña</label>
                    <div className="relative">
                        <input 
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Repite tu nueva clave"
                            className="w-full p-3 pr-20 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
                >
                    GUARDAR CAMBIOS
                </button>
            </form>
        </div>
    );
};