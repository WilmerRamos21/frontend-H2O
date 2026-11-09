import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch.js";
import { ModalOrderDetail } from "./ModalOrder";


// Este componente es puramente visual
export const OrderTableUI = ({ orders, title, showCustomer = false, isAdmin = false, onUpdateShipment, filtros, endpoint }) => {
    const [orderSelected, setOrderSelected] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetail = (order) => {
        setOrderSelected(order);    
        setIsModalOpen(true);
    };

    const [data, setData] = useState({orders: [], totalPages:1})
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const fetchData = useFetch()

    useEffect(()=>{
        const getOrders = async () => {
            setLoading(true)

            const query = new URLSearchParams({
                page,
                limit: 10,
                ...filtros
            }).toString()
            // Si no recibe un endpoint por prop, usa por defecto el de administrador o el personal según corresponda
            const urlEndpoint = endpoint || (isAdmin ? "admin/ordenes" : "ordenes");

            const res = await fetchData(`${urlEndpoint}?${query}`, null, "GET");

            if (res) setData(res);
            setLoading(false)
        }
        getOrders();
    }, [page, filtros])
    
    useEffect(() => {
        setPage(1); // <--- Resetea la página a 1 cada vez que los filtros cambian (ej. al escribir en el buscador)
    }, [filtros]);

    if (loading) return <div className="p-10 text-center">Cargando pedidos...</div>

    // Colores para los estado de envio
    const getShipmentStyle = (status) => {
        switch(status) {
            case "Preparando envío":
                return "bg-yellow-100 text-yellow-700";
            case "Envío en curso":
                return "bg-blue-100 text-blue-700";
            case "Envío completado":
                return "bg-green-100 text-green-700";
            default: 
            return "bg-gray-100 text-gray-500"
        }
    }

    // Funcion de contactar con soporte
    const contactarSoporte = (orderNumber) => {
        const telefono = import.meta.env.VITE_WHATSAPP_NUMBER;

        const mensaje = `Hola, quisiera consultar el estado de mi pedido.
        Número de pedido: ${orderNumber}.
        ¿Podrían ayudarme con información sobre mi compra?`;
        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

        window.open(url, '_blank');

    };

    
    
    return (
        <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <h2 className="font-bold text-gray-700 uppercase text-sm tracking-wider">{title}</h2>
                </div>
                
                {/* Versión Escritorio */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600 text-xs uppercase">Pedido</th>
                                <th className="p-4 font-semibold text-gray-600 text-xs uppercase">Fecha</th>
                                {showCustomer && <th className="p-4 font-semibold text-gray-600 text-xs uppercase">Cliente</th>}
                                <th className="p-4 font-semibold text-gray-600 text-xs uppercase">Ciudad</th>
                                <th className="p-4 font-semibold text-gray-600 text-xs uppercase">Total</th>
                                <th className="p-4 font-semibold text-gray-600 text-xs uppercase">Pago</th>
                                <th className="p-4 font-semibold text-gray-600 text-xs uppercase">Estado del envío</th>
                                <th className="p-4 font-semibold text-gray-600 text-xs uppercase text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data?.orders || []).map((order) => (
                                <tr key={order._id} className="border-b hover:bg-blue-50/30 transition">
                                    <td className = "p-4 text-sm font-bold text-[#005596]">
                                        {order.orderNumber || "Sin número"}
                                    </td>
                                    <td className="p-4 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    {showCustomer && (
                                        <td className="p-4 text-sm font-bold text-gray-800">
                                            {order.user?.name} {order.user?.lastname}
                                        </td>
                                    )}
                                    <td className="p-4 text-sm text-gray-600">{order.shippingAddress?.city}</td>
                                    <td className="p-4 font-black text-[#005596]">${order.total.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                                            order.status === 'Pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    {/* ESTADO DEL ENVÍO*/}
                                    <td className = "p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${getShipmentStyle(order.shipment?.status)}`}>
                                            {order.shipment?.status || "Sin envío"}
                                        </span>
                                    </td>
                                    {/* ACCIONES */}
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleViewDetail(order)}
                                            className="text-[#005596] hover:bg-[#005596] hover:text-white border border-[#005596] px-3 py-1 rounded-md text-xs font-bold transition-colors"
                                        >
                                            Ver Detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Versión Móvil */}
                <div className="md:hidden divide-y divide-gray-100">
                    {(data?.orders || []).map((order) => (
                        <div key={order._id} className="p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className = "text-xs text-[#005596] font-bold">
                                    {order.orderNumber || "Sin número"}
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</span>
                                <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                                    order.status === 'Pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            {showCustomer && <p className="font-bold text-gray-800 text-sm">{order.user?.name} {order.user?.lastname}</p>}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">{order.shippingAddress?.city}</span>
                                <span className="font-black text-[#005596]">${order.total.toFixed(2)}</span>
                            </div>
                            <div className = "flex flex-wrap gap-2">
                                <span className = "px-2 py-1 rounded-full text-[9px] font-black uppercase bg-green-100 text-green-700">
                                    Pago: {order.status}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${getShipmentStyle(order.shipment?.status)}`}>
                                    {order.shipment?.status || "Sin envío"}
                                </span>
                            </div>
                            {/* BOTÓN MÓVIL */}
                            <button 
                                onClick={() => handleViewDetail(order)}
                                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-bold active:bg-gray-200 transition-colors"
                            >
                                Ver Detalle del Pedido
                            </button>
                            <button
                                onClick={()=> contactarSoporte(order.orderNumber)}
                                className="w-full bg-blue-200 text-gray-700 py-2 rounded-lg text-xs font-bold active:bg-gray-200 transition-colors"
                            >
                                Contactar soporte
                            </button>
                        </div>
                    ))}
                </div>
                {/* Paginación simple*/ }
                <div className="flex justify-center items-center gap-4 py-8 border-t border-gray-100">
                    <button
                        disabled={page ===1}
                        onClick={()=> setPage(p => p -1)}
                        className="px-4 py-2 border rounded-md
                        disabled:opacity-30 hover:bg-gray-50"
                    >
                        Anterior
                    </button>
                    <span className="font-bold text-gray-600">Página {page} de {data.totalPages}</span>
                    <button 
                        disabled={page === data.totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            {/* MODAL (Se renderiza fuera de la tabla) */}
            <ModalOrderDetail 
                isOpen={isModalOpen} 
                order={orderSelected} 
                onClose={() => {
                    setIsModalOpen(false)
                }}
                isAdmin = {isAdmin}
                onUpdateShipment = {onUpdateShipment}
            />
        </>
    );
};