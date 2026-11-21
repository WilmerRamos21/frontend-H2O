import { useState, useEffect } from "react";

const LETTERS_CLEAN_REGEX = /[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]/g;
const DIGITS_CLEAN_REGEX = /\D/g;

export const CardProfile = ({ userData, onSave }) => {
    const [editMode, setEditMode] = useState(false);
    // const [formData, setFormData] = useState({
    //     nombre: "",
    //     apellido: "",
    //     telefono: ""
    // });

    const initialState = {
        name: "",
        lastname: "",
        phone: ""
    }
    const [formData, setFormData] = useState(initialState);


    useEffect(()=>{
        if(userData){
            setFormData({
                name: userData.name ?? userData.nombre ?? "",
                lastname: userData.lastname ?? userData.apellido ?? "",
                phone: userData.phone ?? userData.telefono ?? "",
            })
        }
    }, [userData])

    if(!userData){
        return <p>Cargando datos del perfil...</p>
    }

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
            phone: cleanPhone
        }))
    };
    const handleCancel = () => {
        // Restaura los valores originales sin guardar cambios
        setFormData({
            name: userData.name ?? userData.nombre ?? "",
            lastname: userData.lastname ?? userData.apellido ?? "",
            phone: userData.phone ?? userData.telefono ?? "",
        });
        setEditMode(false);
    };

    const handleSave = async (e) =>{
        e.preventDefault()
        const success = await onSave(formData)
        if (success){
            setEditMode(false)
        }
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border mb-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Datos Personales</h3>
                {!editMode && (
                    <button 
                        onClick={() => setEditMode(true)}
                        className="text-blue-600 font-bold hover:text-blue-800 transition-colors"
                    >
                        EDITAR
                    </button>
                )}
            </div>

            {!editMode ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <p><span className="text-gray-400 block text-xs uppercase tracking-wider">Nombre</span> {userData.name || userData.nombre}</p>
                    <p><span className="text-gray-400 block text-xs uppercase tracking-wider">Apellido</span> {userData.lastname || userData.apellido}</p>
                    <p><span className="text-gray-400 block text-xs uppercase tracking-wider">Teléfono</span> {userData.phone || userData.telefono}</p>
                </div>
            ) : (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="border p-3 rounded-lg" placeholder="Nombre" value={formData.name || formData.nombre || ""} onChange={handleLettersChange("name")} />
                    <input className="border p-3 rounded-lg" placeholder="Apellido" value={formData.lastname || formData.apellido ||  ""} onChange={handleLettersChange("lastname")} />
                    <div className="md:col-span-2">
                        <input className="w-full border p-3 rounded-lg" placeholder="Teléfono" value={formData.phone || formData.telefono || ""} onChange={handlePhoneChange} />
                    </div>
                    <div className="md:col-span-2 flex flex-col md:flex-row justify-end gap-3 mt-4">
                        <button type="button" className="text-gray-500 font-semibold p-2" onClick={handleCancel}>Cancelar</button>
                        <button type="button" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold" onClick={handleSave}>Guardar</button>
                    </div>
                </form>
            )}
        </div>
    );
};