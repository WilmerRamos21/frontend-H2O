import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {useCart} from '../context/CartContext'
import storeAuth from "../context/storeAuth";




export const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const fetchData = useFetch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {clearCart, cart} = useCart()

    const user = storeAuth((state) => state.user)
    const setUser = storeAuth((state) => state.setUser)

    const [selectedAddress, setSelectedAddress] = useState(null)

    const [manualAddress, setManualAddress] = useState({
        detail: "",
        city: "Quito",
        phone: user?.phone || ""
    })

    useEffect(()=>{
        const getFullUserProfile = async () => {
            try{
                const data = await fetchData('perfil', null, "GET")
                if (data){
                    setUser(data)
                }

            } catch(err){
                console.error("Error al traer los datos del usuario", err)
            }
        }
        if(!user?.addresses){
            getFullUserProfile()
        }
    }, [])

    useEffect(() => {
        if (user?.addresses?.length > 0) {
            const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
            setSelectedAddress(defaultAddr);
            
            // Opcional: Actualizar el teléfono manual con el del usuario para que no esté vacío
            setManualAddress(prev => ({...prev, phone: user.phone || ""}));
        }
    }, [user]);


    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

        if(!selectedAddress && !manualAddress.detail){
            toast.error("Por favor, ingresa una dirección de envío")
            return
        }

    setLoading(true);

    // 1. Crear el Payment Method en Stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
    });

    // CORRECCIÓN AQUÍ: Si hay error, detenemos todo
    if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
    }

    // 2. Si llegamos aquí, NO hay error. Preparamos la dirección.
    const datosEnvio = {
        paymentMethodId: paymentMethod.id,
        shippingAddress: {
            detail: selectedAddress ? selectedAddress.detail : manualAddress.detail,
            city: selectedAddress ? selectedAddress.city : manualAddress.city,
            phone: String(selectedAddress?.phone || manualAddress.phone || user?.phone || "")
        }
    };

    // LOG DE SEGURIDAD (Para que veas qué estás enviando antes de que falle)
    console.log("Enviando al backend:", { datosEnvio});

    // 3. Enviar al backend
    try {
        const res = await fetchData("checkout", datosEnvio, "POST");
        
        if (res) {
            clearCart();
            toast.success("¡Pago exitoso! Factura enviada al correo.");
            navigate("/confirmacion-pago", { state: { order: res.order } });
        }
    } catch (err) {
        console.error("Error en el checkout:", err);
    } finally {
        setLoading(false);
    }
};

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Dirección de Envío</h3>
                
                {/* Mostramos las guardadas si el array tiene algo */}
                {user?.addresses?.length > 0 && (
                    <div className="space-y-2 mb-4">
                        {user.addresses.map((addr, i) => (
                            <div 
                                key={i}
                                onClick={() => setSelectedAddress(addr)}
                                className={`p-3 border rounded-lg cursor-pointer transition ${
                                    selectedAddress === addr ? "border-blue-600 bg-blue-50 shadow-sm" : "bg-white hover:border-gray-400"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <p className="text-xs font-bold text-blue-800 uppercase">{addr.alias || 'Dirección'}</p>
                                    {selectedAddress === addr && <span className="text-blue-600 text-xs">✓ Seleccionado</span>}
                                </div>
                                <p className="text-sm text-gray-600">{addr.detail}</p>
                            </div>
                        ))}
                        <button 
                            type="button"
                            onClick={() => setSelectedAddress(null)}
                            className="text-xs text-blue-600 font-medium hover:underline py-1"
                        >
                            + Usar una dirección nueva
                        </button>
                    </div>
                )}

                {/* Formulario manual: Solo se muestra si NO hay una dirección seleccionada del perfil */}
                {!selectedAddress && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 animate-fade-in">
                        <p className="text-[10px] uppercase font-bold text-gray-400">Nueva dirección de entrega</p>
                        <input 
                            type="text" 
                            placeholder="Calle principal, número y referencia"
                            className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                            value={manualAddress.detail}
                            onChange={(e) => setManualAddress({...manualAddress, detail: e.target.value})}
                            required
                        />
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Ciudad"
                                className="w-1/2 p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                value={manualAddress.city}
                                onChange={(e) => setManualAddress({...manualAddress, city: e.target.value})}
                                required
                            />
                            <input 
                                type="text" 
                                placeholder="Teléfono"
                                className="w-1/2 p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                value={manualAddress.phone}
                                onChange={(e) => setManualAddress({...manualAddress, phone: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                )}
            </div>

            <hr className="border-gray-100" />
            
            <label className="text-sm font-bold text-gray-700 block">Datos de la Tarjeta</label>
            <div className="p-4 border rounded-lg bg-white shadow-inner">
                <CardElement options={{
                    style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } }
                }} />
            </div>
            
            <button 
                disabled={!stripe || loading}
                className="w-full bg-[#005596] text-white py-4 rounded-lg font-black uppercase hover:bg-blue-800 transition disabled:opacity-50 shadow-md active:scale-[0.98]"
            >
                {loading ? "Procesando..." : `Pagar $${cart?.total?.toFixed(2)}`}
            </button>
        </form>
    );
};