import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";

export const ModalOrderDetail = ({ order, isOpen, onClose, isAdmin = false, onUpdateShipment }) => {
    if (!isOpen || !order) return null;

    const [updating, setUpdating] = useState(false);

    const shipmentStatus = order.shipment?.status;

    // Determinar el siguiente estado permitido
    const nextStates = {
        "Preparando envío": "Envío en curso",
        "Envío en curso": "Envío completado"
    };

    const nextStatus = nextStates[shipmentStatus];

    // Actualizar estado del envío
    const handleUpdateShipment = async () => {
        if (!nextStatus || !onUpdateShipment || updating) return;
        try {
            setUpdating(true);
            await onUpdateShipment(order._id, nextStatus);
        } finally {
            setUpdating(false);
        }
    };

    // Obtener nombre del responsable de actualizar el estado
    const getResponsibleName = (responsible) => {
        if (!responsible) return "Sistema";
        return `${responsible.name || ""} ${responsible.lastname || ""}`.trim() || "Empleado";
    };

    // Exportar factura mejorada con los nuevos campos de dirección
    const exportPDF = () => {
        const nombreCliente = order.user?.name || 
                            order.user?.nombre || 
                            order.user?.email || 
                            "Cliente Registrado";
        
        const apellidoCliente = order.user?.lastname || order.user?.apellido || "";
        const nombreCompleto = `${nombreCliente} ${apellidoCliente}`.trim();

        const doc = new jsPDF();
        
        // --- ENCABEZADO DE LA FACTURA ---
        doc.setFontSize(22);
        doc.setTextColor(0, 85, 150); 
        doc.text("FERRETERÍA H2O", 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Comprobante de Venta Electrónico", 14, 26);
        
        doc.text(`N° de Pedido:`, 140, 20);
        doc.setFont("helvetica", "bold");
        doc.text(`${order.orderNumber || order._id.slice(-6)}`, 168, 20);
        doc.setFont("helvetica", "normal");
        
        doc.text(`Fecha: ${new Date(order.createdAt).toLocaleString()}`, 140, 26);

        // Línea divisoria
        doc.setDrawColor(200, 200, 200);
        doc.line(14, 32, 196, 32);

        // --- DATOS DEL CLIENTE Y ENVÍO ---
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("DATOS DEL CLIENTE Y ENVÍO", 14, 40);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Cliente: ${nombreCompleto}`, 14, 47);
        doc.text(`Email: ${order.user?.email || 'No disponible'}`, 14, 53);
        doc.text(`Teléfono: ${order.shippingAddress?.phone || 'No registrado'}`, 14, 59);

        // Dirección estructurada en PDF
        const addr = order.shippingAddress;
        const dirTexto = addr ? `${addr.mainStreet} #${addr.houseNumber}${addr.crossStreet ? ` y ${addr.crossStreet}` : ''}` : 'No especificada';
        const secCiudad = addr ? `Sector: ${addr.sector} - ${addr.city}` : '';
        const referencia = addr?.reference ? `Ref: ${addr.reference}` : '';

        doc.text(`Dirección: ${dirTexto}`, 14, 65);
        if (secCiudad) doc.text(secCiudad, 14, 71);
        if (referencia) doc.text(referencia, 14, 77);

        // --- TABLA DE PRODUCTOS ---
        const tableColumn = ["Producto", "Cantidad", "Precio Unit.", "Subtotal"];
        const tableRows = (order.products || []).map(item => [
            item.product?.name || item.product?.nombre || "Producto sin nombre",
            item.quantity,
            `$${item.price.toFixed(2)}`,
            `$${(item.quantity * item.price).toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 85,
            head: [tableColumn],
            body: tableRows,
            headStyles: { fillColor: [0, 85, 150], textColor: [255, 255, 255], fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 5 },
            theme: 'grid'
        });

        // --- TOTALES ---
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 85, 150);
        doc.text(`TOTAL PAGADO: $${Number(order.total || 0).toFixed(2)}`, 140, finalY, { align: "right" });

        doc.save(`Factura_H2O_${order.orderNumber || order._id.slice(-6)}.pdf`);
    };

    // Colores según el estado del envío
    const getStatusStyle = (status) => {
        switch (status) {
            case "Preparando envío":
                return "bg-yellow-100 text-yellow-700";
            case "Envío en curso":
                return "bg-blue-100 text-blue-700";
            case "Envío completado":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in">
                
                {/* Cabecera Fija */}
                <div className="bg-[#005596] p-4 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="font-bold text-base">Detalle del Pedido</h3>
                        <p className="text-xs text-blue-100 font-mono">
                            {order.orderNumber || order._id}
                        </p>
                    </div>
                    <button onClick={onClose} className="hover:text-gray-300 transition-colors text-xl font-bold px-2">✕</button>
                </div>

                {/* CUERPO */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    
                    {/* INFORMACIÓN GENERAL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border">
                        <div>
                            <p className="font-bold text-gray-800 mb-1">
                                📍 Dirección de envío:
                            </p>
                            <p className="font-medium text-gray-800">
                                {order.shippingAddress?.mainStreet} #{order.shippingAddress?.houseNumber}
                                {order.shippingAddress?.crossStreet && ` y ${order.shippingAddress.crossStreet}`}
                            </p>
                            <p className="text-gray-600">Sector: {order.shippingAddress?.sector} ({order.shippingAddress?.city})</p>
                            {order.shippingAddress?.reference && (
                                <p className="text-xs text-gray-500 italic mt-0.5">Ref: {order.shippingAddress.reference}</p>
                            )}
                            <p className="text-xs text-gray-600 mt-2 font-semibold">
                                Teléfono: {order.shippingAddress?.phone}
                            </p>
                        </div>
                        
                        <div className="md:text-right flex flex-col justify-between">
                            <div>
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
                            </div>
                            <div className="mt-3">
                                <p className="text-[10px] text-gray-400 uppercase font-bold">
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
                        <div className="border rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b text-gray-700">
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
                                            className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="p-3 text-gray-800 font-medium">
                                                {item.product?.name ||
                                                    item.product?.nombre ||
                                                    "Sin nombre"}
                                            </td>
                                            <td className="p-3 text-center text-gray-600">
                                                {item.quantity}
                                            </td>
                                            <td className="p-3 text-right font-semibold text-gray-800">
                                                ${(item.quantity * item.price).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* GESTIÓN DEL ENVÍO */}
                    <div className="border rounded-xl p-4 space-y-4 shadow-sm">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-gray-800">
                                Estado del envío
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(shipmentStatus)}`}>
                                {shipmentStatus || "Sin envío"}
                            </span>
                        </div>

                        {/* BOTÓN PARA EMPLEADOS / ADMIN */}
                        {isAdmin && (
                            <div className="bg-gray-50 rounded-lg p-4 border">
                                {nextStatus ? (
                                    <>
                                        <p className="text-xs text-gray-500 mb-2">
                                            Siguiente estado disponible:
                                        </p>
                                        <button
                                            onClick={handleUpdateShipment}
                                            disabled={updating}
                                            className="w-full bg-[#005596] hover:bg-blue-800 text-white py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-[0.99]"
                                        >
                                            {updating ? "Actualizando..." : `Actualizar a: ${nextStatus}`}
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
                            <h5 className="font-bold text-gray-700 text-sm mb-3">
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
                                                <p className="text-xs text-gray-500 mt-0.5">
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
                        className="bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all active:scale-95 shadow-md flex items-center gap-2"
                    >
                        <span>📥</span> Descargar Factura (PDF)
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
};