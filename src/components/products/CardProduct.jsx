import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import useStoreAuth from "../../context/storeAuth";
import {toast} from "react-toastify";


const CardProduct = ({ producto }) => {
    const { name, brand, price, discount, precioFinal, image, stock, category } = producto;
    const {addToCart} = useCart()
    const token = useStoreAuth((state) => state.token);

    const handleAddClick = (e) => {
        e.preventDefault()

        if (!token) {
            // Si no hay sesión, puedes usar un toast o simplemente 
            // no hacer nada si prefieres que el Navbar maneje el aviso.
            // Pero lo ideal es esto:
            toast.info("Por favor, inicia sesión para añadir productos");
            return;
        }
        if (stock == 0){
            toast.info("Este producto esta agotado por el momento.")
            return
        }
        addToCart(producto._id, 1);
    }


    return (
        <div className="bg-white border border-gray-200 rounded-sm p-4 flex flex-col h-full hover:shadow-lg transition-shadow relative group">
            {/* Badges (Descuento y Nuevo) */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                {discount > 0 && (
                    <span className="bg-red-600 text-white text-[14px] font-bold px-2 py-0.5 rounded-sm">
                        -{discount}%
                    </span>
                )}
            </div>

            {/* Imagen */}
            <div className="w-full aspect-square mb-4 overflow-hidden">
                <Link to={`/producto/${producto._id}`}>
                <img 
                    src={image?.url || "/img/placeholder.jpg"} 
                    alt={name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                </Link>
            </div>

            {/* Info del Producto */}
            <div className="grow">
                <p className="text-[14px] text-gray-400 uppercase font-bold mb-1">{brand || "Ferretería H2O"}</p>
                <h3 className="text-sm text-gray-700 leading-snug h-10 line-clamp-2 mb-2">
                    {name}
                </h3>
                               {/* Badge de ejemplo para productos nuevos o stock bajo */}
                {stock <= 10 && stock > 0 &&(
                    <span className="bg-yellow-500 text-white text-[12px] font-bold px-2 py-1 rounded-sm uppercase">
                        {stock} UNIDADES
                    </span>
                )}
                {stock == 0 && (
                    <span className="bg-red-500 text-white text-[12px] font-bold px-2 py-1 rounded-sm uppercase">
                        {stock} UNIDADES
                    </span>
                )}
                {stock < 20 && stock > 10 &&(
                    <span className="bg-green-500 text-white text-[12px] font-bold px-2 py-1 rounded-sm uppercase">
                        {stock} UNIDADES
                    </span>
                )}
                <p className="text-[14px] text-gray-400 py-2 mb-2">Categoría: {category}</p>

                {/* Precios */}
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xl font-bold text-[#005596]">${precioFinal.toFixed(2)}</span>
                    {discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">${price.toFixed(2)}</span>
                    )}
                </div>
                <p className="text-[10px] text-gray-500 mb-4 font-semibold">Incluye IVA</p>
            </div>

            {/* Botón Agregar */}
            <button 
                onClick={handleAddClick}
                className="w-full border-2 border-[#005596] text-[#005596] font-bold py-2 rounded-sm hover:bg-[#005596] hover:text-white transition-colors uppercase text-xs tracking-wider"
                >
                
                {stock == 0 ? "Agotado": "Agregar al carrito"}
            </button>
        </div>
    );
};

export default CardProduct;