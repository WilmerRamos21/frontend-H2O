import { useState } from "react";

const LETTERS_CLEAN_REGEX = /[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]/g;
const DIGITS_CLEAN_REGEX = /\D/g;

export const CardCreateUser = ({ onCreate }) => {
    // Estado inicial vacío para un nuevo empleado
    const initialState = {
        nombre: "",
        apellido: "",
        email: "",
        telefono: ""
    };

    const [formData, setFormData] = useState(initialState);
    const [submitting, setSubmitting] = useState(false)

    const handleLettersChange = (field) => (e) => {
        const cleanValue = e.target.value
            .replace(LETTERS_CLEAN_REGEX, "")
            .slice(0, 50);
        
            setFormData((prev) => ({
                ...prev,
                [field]: cleanValue,
            }))
    };

    const handlePhoneChange = (e) => {
        const cleanPhone = e.target.value
        .replace(DIGITS_CLEAN_REGEX, "")
        .slice(0, 10);

        setFormData((prev) => ({
            ...prev,
            telefono: cleanPhone
        }))
    };

    const handleEmailChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            email: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (submitting) return

        setSubmitting(true)

        try{

            const success = await onCreate(formData);
            if (success) {
                setFormData(initialState); // Limpiar formulario tras éxito
        }
    } finally {
        setSubmitting(false)
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
                    type="text"
                    maxLength={50}
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.nombre} 
                    onChange={handleLettersChange("nombre")}
                    required 
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500">Apellido</label>
                <input 
                    type="text"
                    maxLength={50}
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.apellido} 
                    onChange={handleLettersChange("apellido")}
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
                    onChange={handleEmailChange}
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500">Teléfono</label>
                <input 
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.telefono} 
                    onChange={handlePhoneChange}
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