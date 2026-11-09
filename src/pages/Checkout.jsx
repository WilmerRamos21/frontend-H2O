import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import  {PaymentForm}  from "../components/PaymentForm";


const stripePromise = loadStripe(import.meta.env.VITE_STRAPI_KEY)

export const Checkout = () => {
    const { cart } = useCart();

    return (
        <div className="min-h-[calc(100vh-160px)] max-w-4xl mx-auto p-6 mt-10">
            <h1 className="text-3xl font-black text-gray-800 mb-8 uppercase">Finalizar Compra</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Lado Izquierdo: Resumen */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
                    <div className="space-y-4">
                        {cart.productos.map((item) => (
                            <div key={item.product._id} className="flex justify-between text-sm">
                                <span>{item.product.name} x{item.quantity}</span>
                                <span className="font-bold">${item.subTotal.toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="border-t pt-4 flex justify-between text-xl font-black text-[#005596]">
                            <span>Total a pagar:</span>
                            <span>${cart.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Lado Derecho: Formulario de Pago */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <Elements stripe={stripePromise}>
                        <PaymentForm />
                    </Elements>
                </div>
            </div>
        </div>
    );
};