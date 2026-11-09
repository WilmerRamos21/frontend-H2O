import { useLocation, Link } from "react-router-dom";

export const OrderSuccess = () => {
    const { state } = useLocation();
    const order = state?.order;

    if (!order) return <p>No se encontró información de la orden.</p>;

    return (
        <div className="max-w-2xl min-h-[calc(100vh-160px)] mx-auto p-10 text-center mt-20 bg-white rounded-2xl shadow-xl">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-black text-gray-800 mb-2 uppercase">¡Gracias por tu compra!</h1>
            <p className="text-gray-600 mb-8">
                Tu pedido <span className="font-bold">#{order._id.slice(-6)}</span> ha sido procesado con éxito.
                Hemos enviado la factura a tu correo electrónico.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-xl mb-8 text-left">
                <h3 className="font-bold text-[#005596] mb-2 uppercase">Resumen:</h3>
                <p className="text-sm">Total pagado: <strong>${order.total.toFixed(2)}</strong></p>
                <p className="text-sm">Estado: <span className="text-green-600 font-bold">{order.status}</span></p>
            </div>

            <Link to="/" className="inline-block bg-[#005596] text-white px-8 py-3 rounded-lg font-bold uppercase hover:bg-blue-800 transition">
                Volver a la tienda
            </Link>
        </div>
    );
};