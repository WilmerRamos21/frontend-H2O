import { useState } from "react";
import { toast } from "react-toastify";

export const CardEmail = ({ currentEmail, onUpdateEmail }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    // Estados específicos para el correo y la contraseña actual
    const [formEmail, setFormEmail] = useState({
        passwordactual: "",
        nuevoEmail: "",
        confirmEmail: "" // Validación extra en frontend para evitar errores de tipeo
    });

    // Estado para mostrar u ocultar la contraseña actual
    const [showActual, setShowActual] = useState(false);

    const handleChange = (e) => {
        setFormEmail({ ...formEmail, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que los nuevos correos coincidan
        if (formEmail.nuevoEmail !== formEmail.confirmEmail) {
            return toast.error("Los nuevos correos electrónicos no coinciden");
        }

        // Llamamos a la función que pasamos por props con los datos correctos que espera el backend
        const success = await onUpdateEmail({
            passwordactual: formEmail.passwordactual,
            nuevoEmail: formEmail.nuevoEmail
        });
        
        if (success) {
            setFormEmail({ passwordactual: "", nuevoEmail: "", confirmEmail: "" });
            setIsEditing(false);
        }
    };

    // Vista previa (Cerrada)
    if (!isEditing) {
        return (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                    <div className="bg-blue-50 p-4 rounded-full text-blue-600 text-2xl">✉️</div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">Correo Electrónico</h3>
                        <p className="text-gray-500 text-sm">Gestiona la dirección de correo asociada a tu cuenta</p>
                        <p className="text-gray-700 font-medium mt-2">{currentEmail || "cargando..."}</p>
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

            <h1 className="text-2xl font-bold text-gray-800 mb-2">Actualizar Correo Electrónico</h1>
            
            {/* Mensaje explicativo de seguridad */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-xl">
                <div className="flex items-center">
                    <span className="text-amber-500 text-lg mr-2">🛡️</span>
                    <p className="text-sm text-amber-800 font-medium">
                        Por motivos de seguridad, necesitamos confirmar tu identidad ingresando tu contraseña actual para cambiar tu dirección de correo.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md space-y-5">
                
                {/* 1. Contraseña Actual (Con su respectivo botón de mostrar/ocultar) */}
                <div>
                    <label className="block text-gray-500 text-sm font-semibold mb-2">Contraseña Actual</label>
                    <div className="relative">
                        <input 
                            type={showActual ? "text" : "password"}
                            name="passwordactual"
                            placeholder="Ingresa tu clave actual"
                            className="w-full p-3 pr-20 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                            value={formEmail.passwordactual}
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

                {/* 2. Nuevo Correo */}
                <div>
                    <label className="block text-gray-500 text-sm font-semibold mb-2">Nuevo Correo Electrónico</label>
                    <div className="relative">
                        <input 
                            type="email"
                            name="nuevoEmail"
                            placeholder="ejemplo@correo.com"
                            className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                            value={formEmail.nuevoEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* 3. Confirmar Nuevo Correo */}
                <div>
                    <label className="block text-gray-500 text-sm font-semibold mb-2">Confirmar Nuevo Correo Electrónico</label>
                    <div className="relative">
                        <input 
                            type="email"
                            name="confirmEmail"
                            placeholder="Repite tu nuevo correo"
                            className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                            value={formEmail.confirmEmail}
                            onChange={handleChange}
                            required
                        />
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