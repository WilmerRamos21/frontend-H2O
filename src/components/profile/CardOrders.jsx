import { useState, useEffect } from "react";
import { OrderTableUI } from "../../components/OrderTableUI";

export const CardOrders = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1); // <-- Subimos el estado de la página aquí o lo manejamos correctamente

    // Pequeño efecto para retrasar la búsqueda (debounce) y evitar peticiones excesivas
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    // Agrupamos los filtros que se enviarán a la tabla y al endpoint personal
    const filtros = {
        ...(debouncedSearch && { search: debouncedSearch })
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mis Pedidos</h1>
                
                {/* Buscador Versátil */}
                <div className="relative w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder="Buscar por fecha, ciudad o ID..." 
                        className="w-full p-2 pl-9 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
                </div>
            </div>

            <OrderTableUI 
                title="Historial Personal" 
                showCustomer={false} 
                isAdmin={false}
                filtros={filtros}
                endpoint="ordenes" // <--- Importante: le indicamos que apunte a la ruta de usuario en lugar de admin
                externalPage={page}            // <--- Opcional si prefieres controlar la paginación desde arriba
                setExternalPage={setPage}
            />
        </div>
    );
};