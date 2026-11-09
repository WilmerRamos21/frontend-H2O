import { useState } from "react";

export const CardCreateUser = ({ onCreate }) => {
    // Estado inicial vacío para un nuevo empleado
    const initialState = {
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        telefono: ""
    };

    const [formData, setFormData] = useState(initialState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onCreate(formData);
        if (success) {
            setFormData(initialState); // Limpiar formulario tras éxito
        }
    };

    return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mb-6 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-6 text-gray-800 text-center md:text-left">
            Registrar Nuevo Empleado
        </h3>
        
        {/* Cambiamos a grid-cols-1 por defecto y md:grid-cols-2 para desktop */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500">Nombre</label>
                <input 
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.nombre} 
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500">Apellido</label>
                <input 
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.apellido} 
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    required
                />
            </div>

            {/* Email suele ser largo, podemos dejarlo en una sola columna o que ocupe las dos en desktop */}
            <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm text-gray-500">Correo electrónico</label>
                <input 
                    type="email"
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500">Contraseña Temporal</label>
                <input 
                    type="password"
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500">Teléfono</label>
                <input 
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.telefono} 
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    required
                />
            </div>

            {/* El botón ahora se adapta: ancho completo en móvil, auto en desktop */}
            <div className="md:col-span-2 flex justify-center md:justify-end mt-4">
                <button 
                    type="submit"
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 md:py-2 rounded-lg font-semibold transition-colors"
                >
                    Crear Empleado
                </button>
            </div>
        </form>
    </div>
    );
};