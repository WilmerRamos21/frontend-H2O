import { createContext, useContext, useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { toast } from "react-toastify";
import storeAuth from "../context/storeAuth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ productos: [], total: 0 });
    const [isOpen, setIsOpen] = useState(false); // Para abrir/cerrar el lateral
    const fetchData = useFetch();

    const token = storeAuth((state) => (state.token))



    // Sincronizar con el backend
    const getCart = async () => {
        if (!token){
            setCart({productos: [], total: 0})
            return 
        }
        try {
            const res = await fetchData("contenidocarrito", null , "GET", {}, false);
            if (res) setCart(res);
        } catch (error) {
            console.error("Error al obtener carrito", error);
        }
    };

    useEffect(() => {
        getCart(); // Cargar al iniciar la app
    }, [token]);

    const addToCart = async (productId, quantity = 1) => {
        const res = await fetchData("carrito", { productId, quantity }, "POST");
        if (res) {
            toast.success("Producto añadido");
            getCart(); // Refrescar estado
            setIsOpen(true); // Abrir el carrito automáticamente
        }
    };

    const updateQuantity = async (productId, quantity) => {
        const res = await fetchData(`cantidadcarrito/${productId}`, { quantity }, "PUT");
        if (res) getCart();
    };

    const removeFromCart = async (productId) => {
        const res = await fetchData(`carrito/${productId}`, null, "DELETE");
        if (res) {
            toast.info("Producto eliminado");
            getCart();
        }
    };

    const clearCart = () =>{
        setCart({ productos: [], total: 0})
    }

    return (
        <CartContext.Provider value={{ 
            cart, addToCart, updateQuantity, removeFromCart, 
            isOpen, setIsOpen,
            clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

