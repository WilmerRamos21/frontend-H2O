import { useState} from "react";
import { toast } from "react-toastify";

export const CardAddress = ({ addresses, onSaveAddress, onDeleteAddress }) => {
    // view puede ser "list" (lista de direcciones) o "add" (formulario de añadir)
    const [view, setView] = useState("list");
    const [newAddress, setNewAddress] = useState("");

    // Filtramos solo las direcciones que tengan status !== false
    const direccionesActivas = addresses?.filter(dir => dir.status !== false) || [];

    const handleSave = async () => {
        if (!newAddress.trim()) return toast.error("La dirección es obligatoria");
        
        // Enviamos el objeto con el formato que espera tu backend
        const success = await onSaveAddress({ detail: newAddress, city: "Quito", alias: "Hogar" });
        
        if (success) {
            setNewAddress("");
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
                                <p className="text-gray-700 font-medium truncate">{dir.detail}</p>
                                <span className="text-xs text-gray-400 uppercase tracking-wider">{dir.alias || "Dirección"}</span>
                            </div>
                            <button 
                                onClick={() => onDeleteAddress(dir._id)}
                                className="text-red-500 font-semibold text-sm p-2"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- VISTA: AÑADIR DIRECCIÓN (Igual a tu imagen) ---
    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
            <button 
                onClick={() => setView("list")}
                className="text-blue-600 font-bold mb-6 flex items-center"
            >
                <span className="ml-2">←</span> DIRECCIONES
            </button>
            
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">Añadir Dirección</h1>

            <div className="max-w-xl space-y-6">
                <div>
                    <label className="block text-gray-500 text-sm font-semibold mb-2">País</label>
                    <select className="w-full p-4 border rounded-xl bg-gray-50 outline-none ">
                        <option>Ecuador</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-500 text-sm font-semibold mb-2">Dirección</label>
                    <input 
                        type="text"
                        placeholder="Ej.: Av Rio Amazonas, N 37-61, Quito"
                        className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                    />
                </div>

                <button 
                    onClick={handleSave}
                    disabled={!newAddress.trim()}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                        newAddress.trim() 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 text-gray-300"
                    }`}
                >
                    AÑADIR DIRECCIÓN
                </button>
            </div>
        </div>
    );
};