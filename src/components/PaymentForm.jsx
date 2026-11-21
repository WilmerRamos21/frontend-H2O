import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from '../context/CartContext';
import storeAuth from "../context/storeAuth";

const DIGITS_CLEAN_REGEX = /\D/g;

export const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const fetchData = useFetch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { clearCart, cart } = useCart();

    const user = storeAuth((state) => state.user);
    const setUser = storeAuth((state) => state.setUser);

    const [selectedAddress, setSelectedAddress] = useState(null);

    // Estado para nueva dirección manual estructurada
    const [manualAddress, setManualAddress] = useState({
        mainStreet: "",
        houseNumber: "",
        crossStreet: "",
        sector: "",
        reference: "",
        city: "Quito",
        phone: user?.phone || ""
    });


    const handlePhoneChange = (e) => {
        const cleanPhone = e.target.value
        .replace(DIGITS_CLEAN_REGEX, "")
        .slice(0, 10);

        setManualAddress((prev) => ({
            ...prev,
            phone: cleanPhone
        }))
    };

    useEffect(() => {
        const getFullUserProfile = async () => {
            try {
                const data = await fetchData('perfil', null, "GET");
                if (data) {
                    setUser(data);
                }
            } catch (err) {
                console.error("Error al traer los datos del usuario", err);
            }
        };
        if (!user?.addresses) {
            getFullUserProfile();
        }
    }, []);

    useEffect(() => {
        if (user?.addresses?.length > 0) {
            const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
            setSelectedAddress(defaultAddr);
            
            setManualAddress(prev => ({ ...prev, phone: user.phone || "" }));
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        // Validación de que exista una dirección seleccionada o el formulario manual completo
        if (!selectedAddress) {
            if (!manualAddress.mainStreet || !manualAddress.houseNumber || !manualAddress.sector || !manualAddress.phone) {
                toast.error("Por favor, completa los campos obligatorios de la dirección (Calle, Número, Sector y Teléfono)");
                return;
            }
        }

        setLoading(true);

        // 1. Crear el Payment Method en Stripe
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
            return;
        }

        // 2. Preparamos la estructura de envío correcta para el backend
        const direccionAEnviar = selectedAddress ? {
            mainStreet: selectedAddress.mainStreet,
            houseNumber: selectedAddress.houseNumber,
            crossStreet: selectedAddress.crossStreet || "",
            sector: selectedAddress.sector,
            reference: selectedAddress.reference || "",
            city: selectedAddress.city || "Quito",
            phone: String(user?.phone || manualAddress.phone || "")
        } : {
            mainStreet: manualAddress.mainStreet,
            houseNumber: manualAddress.houseNumber,
            crossStreet: manualAddress.crossStreet,
            sector: manualAddress.sector,
            reference: manualAddress.reference,
            city: "Quito",
            phone: String(manualAddress.phone)
        };

        const datosEnvio = {
            paymentMethodId: paymentMethod.id,
            shippingAddress: direccionAEnviar
        };

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
                
                {/* Mostramos las direcciones guardadas del perfil */}
                {user?.addresses?.length > 0 && (
                    <div className="space-y-2 mb-4 max-h-70 overflow-y-auto pr-2">
                        <button 
                            type="button"
                            onClick={() => setSelectedAddress(null)}
                            className="text-lm text-blue-600 font-medium hover:underline py-1"
                        >
                            + Usar una dirección nueva para este envío
                        </button>
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
                                    {selectedAddress === addr && <span className="text-blue-600 text-xs font-semibold">✓ Seleccionado</span>}
                                </div>
                                <p className="text-sm font-semibold text-gray-800">
                                    {addr.mainStreet} #{addr.houseNumber} {addr.crossStreet && `y ${addr.crossStreet}`}
                                </p>
                                <p className="text-lm text-gray-700 font-medium">Número de contacto: {user.phone}</p>
                                <p className="text-lm text-gray-500">Sector: {addr.sector} - {addr.city}</p>
                                {addr.reference && <p className="text-lm text-gray-400 italic">Ref: {addr.reference}</p>}
                            </div>
                        ))}

                    </div>
                )}

                {/* Formulario manual estructurado: Se muestra si NO hay dirección seleccionada */}
                {!selectedAddress && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 animate-fade-in">
                        <p className="text-[10px] uppercase font-bold text-gray-400">Nueva dirección de entrega</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input 
                                type="text" 
                                placeholder="Calle principal *"
                                className="md:col-span-2 p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                value={manualAddress.mainStreet}
                                onChange={(e) => setManualAddress({...manualAddress, mainStreet: e.target.value})}
                                required
                            />
                            <input 
                                type="text" 
                                placeholder="Número *"
                                className="p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                value={manualAddress.houseNumber}
                                onChange={(e) => setManualAddress({...manualAddress, houseNumber: e.target.value})}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input 
                                type="text" 
                                placeholder="Calle transversal (Opcional)"
                                className="p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                value={manualAddress.crossStreet}
                                onChange={(e) => setManualAddress({...manualAddress, crossStreet: e.target.value})}
                            />
                            <input 
                                type="text" 
                                placeholder="Sector / Barrio *"
                                className="p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                value={manualAddress.sector}
                                onChange={(e) => setManualAddress({...manualAddress, sector: e.target.value})}
                                required
                            />
                        </div>

                        <input 
                            type="text" 
                            placeholder="Referencia cercana (Opcional)"
                            className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                            value={manualAddress.reference}
                            onChange={(e) => setManualAddress({...manualAddress, reference: e.target.value})}
                        />

                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                disabled
                                value="Quito (Ciudad única)"
                                className="w-1/2 p-2 text-sm border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                            <input 
                                type="text"
                                inputMode="numeric"
                                disabled
                                placeholder="Número de contacto *"
                                className="w-1/2 p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                value={manualAddress.phone}
                                onChange={handlePhoneChange}
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