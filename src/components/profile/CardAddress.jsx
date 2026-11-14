import { useState } from "react";
import { toast } from "react-toastify";

export const CardAddress = ({ addresses, onSaveAddress, onDeleteAddress }) => {
    // view puede ser "list" (lista de direcciones) o "add" (formulario de añadir)
    const [view, setView] = useState("list");
    
    // Estado inicial del formulario con los nuevos campos estructurados
    const [formAddress, setFormAddress] = useState({
        mainStreet: "",
        houseNumber: "",
        crossStreet: "",
        sector: "",
        reference: "",
        isDefault: false
    });

    // Filtramos solo las direcciones que tengan status !== false
    const direccionesActivas = addresses?.filter(dir => dir.status !== false) || [];

    // Manejador genérico para actualizar los campos del formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormAddress({
            ...formAddress,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = async () => {
        // Validamos los campos obligatorios
        if (!formAddress.mainStreet.trim() || !formAddress.houseNumber.trim() || !formAddress.sector.trim()) {
            return toast.error("Por favor completa la calle principal, número y sector");
        }
        
        // Enviamos el objeto con la estructura exacta que espera tu backend
        const success = await onSaveAddress({
            mainStreet: formAddress.mainStreet,
            houseNumber: formAddress.houseNumber,
            crossStreet: formAddress.crossStreet,
            sector: formAddress.sector,
            reference: formAddress.reference,
            city: "Quito", // Fijo por defecto
            isDefault: formAddress.isDefault
        });
        
        if (success) {
            // Limpiamos el formulario y regresamos a la lista
            setFormAddress({
                mainStreet: "",
                houseNumber: "",
                crossStreet: "",
                sector: "",
                reference: "",
                isDefault: false
            });
            setView("list");
        }
    };

    // --- VISTA: LISTA DE DIRECCIONES ---
    if (view === "list") {
        return (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
                <div className="flex flex-col md:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Direcciones</h1>
                    <button 
                        onClick={() => setView("add")}
                        className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm"
                    >
                        + AÑADIR DIRECCIÓN
                    </button>
                </div>

                <div className="space-y-4">
                    {direccionesActivas.map((dir) => (
                        <div key={dir._id} className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600 text-lg">📍</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-gray-800 font-semibold">
                                    {dir.mainStreet} #{dir.houseNumber} 
                                    {dir.crossStreet && <span className="text-gray-500 font-normal"> y {dir.crossStreet}</span>}
                                </p>
                                <p className="text-sm text-gray-600">Sector: {dir.sector} ({dir.city})</p>
                                {dir.reference && <p className="text-xs text-gray-400 italic">Ref: {dir.reference}</p>}
                                {dir.isDefault && (
                                    <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                        Principal
                                    </span>
                                )}
                            </div>
                            <button 
                                onClick={() => onDeleteAddress(dir._id)}
                                className="text-red-500 font-semibold text-sm p-2 hover:underline"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                    {direccionesActivas.length === 0 && (
                        <p className="text-gray-500 text-center py-6">No tienes direcciones registradas todavía.</p>
                    )}
                </div>
            </div>
        );
    }

    // --- VISTA: AÑADIR DIRECCIÓN (Formulario estructurado) ---
    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
            <button 
                onClick={() => setView("list")}
                className="text-blue-600 font-bold mb-6 flex items-center"
            >
                <span className="ml-2">←</span> DIRECCIONES
            </button>
            
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">Añadir Dirección</h1>

            <div className="max-w-xl space-y-5">
                <div>
                    <label className="block text-gray-500 text-sm font-semibold mb-2">Ciudad</label>
                    <input 
                        type="text" 
                        disabled 
                        value="Quito (Única ciudad de entrega)" 
                        className="w-full p-4 border rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-gray-500 text-sm font-semibold mb-2">Calle Principal *</label>
                        <input 
                            type="text"
                            name="mainStreet"
                            placeholder="Ej.: Av. 10 de Agosto"
                            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formAddress.mainStreet}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-500 text-sm font-semibold mb-2">Número *</label>
                        <input 
                            type="text"
                            name="houseNumber"
                            placeholder="Ej.: N45-12"
                            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formAddress.houseNumber}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-500 text-sm font-semibold mb-2">Calle Transversal (Opcional)</label>
                    <input 
                        type="text"
                        name="crossStreet"
                        placeholder="Ej.: Calle Los Pinos"
                        className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formAddress.crossStreet}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-gray-500 text-sm font-semibold mb-2">Sector / Barrio *</label>
                    <input 
                        type="text"
                        name="sector"
                        placeholder="Ej.: La Carolina"
                        className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formAddress.sector}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-gray-500 text-sm font-semibold mb-2">Referencia (Opcional)</label>
                    <input 
                        type="text"
                        name="reference"
                        placeholder="Ej.: Edificio color café frente al parque"
                        className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formAddress.reference}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <input 
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={formAddress.isDefault}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Establecer como dirección predeterminada
                    </label>
                </div>

                <button 
                    onClick={handleSave}
                    disabled={!formAddress.mainStreet.trim() || !formAddress.houseNumber.trim() || !formAddress.sector.trim()}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                        (formAddress.mainStreet.trim() && formAddress.houseNumber.trim() && formAddress.sector.trim())
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" 
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                >
                    GUARDAR DIRECCIÓN
                </button>
            </div>
        </div>
    );
};