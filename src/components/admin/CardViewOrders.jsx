import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { OrderTableUI } from "../../components/OrderTableUI";
import { toast } from "react-toastify";

export const CardViewOrders = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const fetchData = useFetch();

    // Debounce para la búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    // Los filtros limpios solo para la búsqueda
    const filtros = {
        ...(debouncedSearch && { search: debouncedSearch })
    };

    // Actualizar el estado del envío
    const handleUpdateShipment = async (id, status) => {
        try {
            await fetchData(
                `admin/orden/${id}/envio`,
                { status },
                "PATCH"
            );
            toast.success("Estado de envío actualizado correctamente");
            
            // Forzamos la recarga cambiando el estado
            setRefreshTrigger(prev => prev + 1);
            
        } catch (error) {
            console.error("Error al actualizar envío: ", error);
            toast.error("No se pudo actualizar el envío");
        }
    };

    return (
        <div className="animate-fade-in space-y-4">
            <input 
                type="text" 
                placeholder="Buscar por cliente, ciudad o número de pedido..." 
                className="w-full p-3 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <OrderTableUI 
                title="Registro Global de Ventas" 
                showCustomer={true}
                isAdmin={true}
                onUpdateShipment={handleUpdateShipment}
                filtros={filtros}
                endpoint="admin/ordenes"
                refreshKey={refreshTrigger} // Pasamos el disparador limpio si tu OrderTableUI lo soporta, o déjalo depender de filtros
            />
        </div>
    );
};