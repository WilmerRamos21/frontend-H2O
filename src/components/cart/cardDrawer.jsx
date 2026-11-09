import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export const CartDrawer = () => {
    const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate()


    if (!isOpen) return null;

    const handleCheckout = () => {
        setIsOpen(false)
        navigate("/checkout")
    }

    return (
        <div className="fixed inset-0 z-100 flex justify-end">
            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            {/* Panel Blanco */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-black text-[#005596]">Tu Carrito</h2>
                    <button onClick={() => setIsOpen(false)} className="text-2xl">✕</button>
                </div>

                <div className="grow overflow-y-auto p-4 space-y-4">
                    {cart.productos?.length === 0 ? (
                        <p className="text-center text-gray-500 mt-10 italic">Tu carrito está vacío.</p>
                    ) : (
                        cart.productos?.map((item) => (
                            <div key={item.product._id} className="flex gap-4 border-b pb-4">
                                <img src={item.product.image?.url} className="w-20 h-20 object-contain rounded bg-gray-50" />
                                <div className="grow">
                                    <h4 className="font-bold text-sm text-gray-800 line-clamp-2 uppercase">{item.product.name}</h4>
                                    <p className="text-xs text-gray-400 mb-2">SKU: {item.product._id.slice(-6)}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center border rounded">
                                            <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="px-2 py-1">-</button>
                                            <span className="px-3 font-bold text-sm">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="px-2 py-1">+</button>
                                        </div>
                                        <span className="font-black text-[#005596]">${item.precioFinal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.product._id)} className="text-gray-300 hover:text-red-500">🗑️</button>
                            </div>
                        ))
                    )}
                </div>

                {/* Resumen de Compra */}
                <div className="p-6 bg-gray-50 border-t space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>${cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-gray-800">
                        <span>Total</span>
                        <span>${cart.total.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        disabled={cart.productos?.length === 0}
                        className="w-full bg-[#005596] text-white py-4 rounded-lg font-black uppercase hover:bg-blue-800 transition">
                        Finalizar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};
