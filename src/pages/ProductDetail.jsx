import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import storeAuth from "../context/storeAuth";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export const ProductDetailPage = () => {
    const { id } = useParams();
    const fetchData = useFetch();
    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);

    const {addToCart} = useCart()
    const token = storeAuth((state) => state.token)

    const handleComprar = () =>{
        if (!token) {
        toast.warning("Debes iniciar sesión para comprar");
        // Opcional: podrías usar un evento global o context para abrir el login del Navbar
        return;
    }
    addToCart(id, cantidad)
}


    useEffect(() => {
        const getProducto = async () => {
            const res = await fetchData(`producto/${id}`);
            if (res) setProducto(res);
        };
        getProducto();
    }, [id]);

    if (!producto) return <p className="text-center mt-20 font-bold">Cargando herramienta...</p>;

    return (
        <div className="min-h-[calc(100vh-160px)] max-w-7xl mx-auto p-4 md:p-8 bg-white mt-6 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Lado Izquierdo: Imagen */}
                <div className="flex flex-col items-center">
                    <img 
                        src={producto.image?.url} 
                        alt={producto.name}
                        className="w-full max-w-md object-contain hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Lado Derecho: Información y Compra */}
                <div className="space-y-6">
                    <p className="text-blue-600 font-bold uppercase tracking-widest text-2xl">{producto.brand}</p>
                    <h1 className="text-3xl font-black text-gray-800 uppercase">{producto.name}</h1>
                    
                    <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-black text-[#005596]">${producto.precioFinal.toFixed(2)}</span>
                        {producto.discount > 0 && (
                            <span className="text-xl text-gray-400 line-through">${producto.price.toFixed(2)}</span>
                        )}
                    </div>

                    <div className="py-6 border-t border-b border-gray-100">
                        <p className="text-2xl mb-4 font-semibold italic">Stock disponible: {producto.stock} unidades</p>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-lg">
                                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="px-4 py-2 border-r hover:bg-gray-100">-</button>
                                <span className="px-6 font-bold">{cantidad}</span>
                                <button onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))} className="px-4 py-2 border-l hover:bg-gray-100">+</button>
                            </div>
                            <button 
                                onClick={handleComprar}
                                className={`${!token ? "bg-red-500 cursor-not-allowed border border-black text-white" : "bg-green-400 border border-bloack"} ...`}>
                                {!token ? "Inicia sesión para comprar" : "Agregar al Carrito"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de Especificaciones (Tabla estilo Kywi) */}
            <div className="mt-16">
                <h3 className="text-xl font-bold border-b-2 border-[#005596] inline-block mb-6 pb-1">Especificaciones</h3>
                <table className="w-full text-sm">
                    <tbody>
                        <tr className="bg-gray-50">
                            <td className="p-3 font-bold text-gray-700 w-1/3">Marca</td>
                            <td className="p-3 text-gray-600">{producto.brand}</td>
                        </tr>
                        <tr>
                            <td className="p-3 font-bold text-gray-700">Categoría</td>
                            <td className="p-3 text-gray-600">{producto.category}</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="p-3 font-bold text-gray-700">Descripción</td>
                            <td className="p-3 text-gray-600">{producto.description || "No hay descripción disponible."}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};