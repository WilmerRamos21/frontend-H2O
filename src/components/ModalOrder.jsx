import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";

export const ModalOrderDetail = ({ order, isOpen, onClose, isAdmin = false, onUpdateShipment }) => {
    if (!isOpen || !order) return null;

    const [updating, setUpdating] = useState(false)

    const shipmentStatus = order.shipment?.status;

    // determinar el siguiente estado permitido
    const nextStates = {
        "Preparando envío":"Envío en curso",
        "Envío en curso": "Envío completado"
    }

    const nextStatus = nextStates[shipmentStatus]

    // Actualizar estado del envío
    const handleUpdateShipment = async() =>{
        if(!nextStatus || !onUpdateShipment || updating) return;
        try{
            setUpdating(true);
            await onUpdateShipment(order._id, nextStatus)
        } finally{
            setUpdating(false)
        }
    }
    // Obtener nombre del responsable de actualizar el estado
    const getResponsibleName = (responsible) => {
        if(!responsible) return "Sistema";

        return `${responsible.name || ""} ${responsible.lastname || ""}`.trim() || "Empleado";
    }

    // Exportar factura

    const exportPDF = () => {
        const nombreCliente = order.user?.name || 
                            order.user?.nombre || 
                            order.user?.email || 
                            "Cliente Registrado";
        
        const apellidoCliente = order.user?.lastname || order.user?.apellido || "";
        const nombreCompleto = `${nombreCliente} ${apellidoCliente}`.trim();

        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.setTextColor(0, 85, 150); 
        doc.text("H2O - FACTURA DE VENTA", 105, 20, { align: "center" });
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`ID Orden: ${order._id}`, 14, 30);
        doc.text(`Fecha: ${new Date(order.createdAt).toLocaleString()}`, 14, 35);
        doc.text(`Cliente: ${nombreCompleto}`, 14, 40);
        doc.text(`Email: ${order.user?.email || 'No disponible'}`, 14, 45);

        const tableColumn = ["Producto", "Cantidad", "Precio Unit.", "Subtotal"];
        const tableRows = (order.products || []).map(item => [
            item.product?.name || item.product?.nombre || "Producto sin nombre",
            item.quantity,
            `$${item.price.toFixed(2)}`,
            `$${(item.quantity * item.price).toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 55,
            head: [tableColumn],
            body: tableRows,
            headStyles: { fillColor: [0, 85, 150] },
            theme: 'grid'
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`TOTAL PAGADO: $${order.total.toFixed(2)}`, 14, finalY);

        doc.save(`Factura_H2O_${order._id.slice(-6)}.pdf`);
    };

    // Colores según el estado

    const getStatusStyle = (status) => {
        switch (status) {
            case "Preparando envío":
                return "bg-yellow-100 text-yellow-700"
            case "Envío en curso":
                return "bg-blue-100 text-blue-700"
            case "Envío completado":
                return "bg-green-100 text-green-700"
            default:
                return "bg-gray-100 text-gray-600"
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-100 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in">
                
                {/* Cabecera Fija */}
                <div className="bg-[#005596] p-4 text-white flex justify-between items-center shrink-0">
                    <h3 className="font-bold">Detalle del Pedido #{order._id.slice(-6)}</h3>
                    <p className="text-xs text-blue-100">
                        {order.orderNumber || order._id}
                    </p>
                    <button onClick={onClose} className="hover:text-gray-300 transition-colors text-xl">X</button>
                </div>
                {/* CUERPO */}
            <div className="p-6 space-y-6 overflow-y-auto">
                {/* INFORMACIÓN GENERAL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-600">
                    <div>
                        <p className="font-bold text-gray-800">
                            Dirección de envío:
                        </p>
                        <p>{order.shippingAddress?.address}</p>
                        <p>{order.shippingAddress?.city}</p>
                        <p>
                            Teléfono: {order.shippingAddress?.phone}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                            Fecha: {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="md:text-right">
                        <p className="font-bold text-gray-800">
                            Cliente:
                        </p>
                        <p className="text-gray-700 font-medium">
                            {order.user?.name
                                ? `${order.user.name} ${order.user.lastname || ""}`
                                : order.user?.email || "Usuario Registrado"}
                        </p>
                        <p className="text-xs text-gray-500">
                            {order.user?.email}
                        </p>
                        <div className="mt-3">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                Estado del pago:
                            </p>
                            <span className="text-green-600 font-bold uppercase text-sm">
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>
                {/* PRODUCTOS */}
                <div>
                    <h4 className="font-bold text-gray-800 mb-3">
                        Productos adquiridos
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-3 text-left">Producto</th>
                                    <th className="p-3 text-center">Cant.</th>
                                    <th className="p-3 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.products?.map((item, i) => (
                                    <tr
                                        key={i}
                                        className="border-b last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="p-3">
                                            {item.product?.name ||
                                                item.product?.nombre ||
                                                "Sin nombre"}
                                        </td>
                                        <td className="p-3 text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="p-3 text-right font-medium">
                                            ${(item.quantity * item.price).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* GESTIÓN DEL ENVÍO */}
                <div className="border rounded-xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800">
                            Estado del envío
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(shipmentStatus)}`}>
                            {shipmentStatus || "Sin envío"}
                        </span>
                    </div>
                    {/* BOTÓN PARA EMPLEADOS */}
                    {isAdmin && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            {nextStatus ? (
                                <>
                                    <p className="text-xs text-gray-500 mb-3">
                                        Siguiente estado disponible:
                                    </p>
                                    <button
                                        onClick={handleUpdateShipment}
                                        disabled={updating}
                                        className="w-full bg-[#005596] hover:bg-blue-800 text-white py-2.5 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        {updating ? "Actualizando..." : `Actualizar a : ${nextStatus}`}
                                    </button>
                                </>
                            ) : (
                                <p className="text-sm text-green-700 font-semibold text-center">
                                    ✓ El pedido ha sido entregado correctamente.
                                </p>
                            )}
                        </div>
                    )}
                    {/* HISTORIAL */}
                    <div>
                        <h5 className="font-bold text-gray-700 text-sm mb-4">
                            Historial del envío
                        </h5>
                        <div className="space-y-4">
                            {order.shipment?.history?.length > 0 ? (
                                order.shipment.history.map((item, index) => (
                                    <div
                                        key={item._id || index}
                                        className="flex gap-3 items-start"
                                    >
                                        <div className="w-3 h-3 rounded-full bg-[#005596] mt-1 shrink-0"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800">
                                                {item.status}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(item.date).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Responsable: {getResponsibleName(item.responsible)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">
                                    No existe historial de envío.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* FOOTER */}
            <div className="p-5 border-t bg-gray-50 flex flex-wrap justify-between items-center gap-4 shrink-0">
                <button
                    onClick={exportPDF}
                    className="bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all active:scale-95 shadow-md"
                >
                    📥 Descargar Factura (PDF)
                </button>
                <div className="text-right">
                    <p className="text-gray-500 text-[10px] uppercase font-bold">
                        Total Final
                    </p>
                    <p className="text-2xl font-black text-[#005596] leading-none">
                        ${Number(order.total || 0).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    </div>
);
}