import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const MobileMenu = ({ token, rol, logout, setView }) => {
    const { cart, setIsOpen } = useCart();
    const totalItems = cart?.productos?.reduce((acc, item) => acc + item.quantity, 0) || 0

    return (
        <div className="flex flex-col gap-4 md:hidden p-4">
            {token ? (
                <>
                    {/* BOTÓN DEL CARRITO (Versión Mobile) */}
                    <button 
                        onClick={() => {
                            setIsOpen(true);
                            setView(null); // Cierra el menú móvil al abrir el carrito
                        }}
                        className="flex items-center justify-between w-full bg-blue-50 p-4 rounded-xl text-[#005596] font-bold"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🛒</span> Ver mi carrito
                        </div>
                        {totalItems > 0 && (
                            <span className="bg-red-600 text-white text-xs px-2.5 py-1 rounded-full">
                                {totalItems} items
                            </span>
                        )}
                    </button>

                    {rol?.toUpperCase() === "ADMIN" && (
                        <Link 
                            to="/administrador" 
                            onClick={() => setView(null)}
                            className="text-blue-600 font-bold py-3 border-b border-gray-100 flex items-center gap-2"
                        >
                            🛠️ Administración
                        </Link>
                    )}
                    {rol?.toUpperCase() === "EMPLEADO" && (
                        <Link 
                            to="/empleado" 
                            onClick={() => setView(null)}
                            className="text-blue-600 font-bold py-3 border-b border-gray-100 flex items-center gap-2"
                        >
                            🛠️ Empleado
                        </Link>
                    )}
                    <Link 
                        to="/perfil" 
                        onClick={() => setView(null)}
                        className="text-gray-700 py-3 border-b border-gray-100 flex items-center gap-2"
                    >
                        👤 Mi cuenta
                    </Link>
                    <button onClick={logout} className="text-red-500 font-bold py-3 text-left">
                        Cerrar sesión
                    </button>
                </>
            ) : (
                <>
                    <button onClick={() => setView("login")} className="bg-green-600 text-white rounded-md font-medium py-3 border-b border-gray-500">
                        Iniciar Sesión
                    </button>
                    <button onClick={() => setView("register")} className="bg-blue-600 text-white px-5 py-3 rounded-lg mt-2">
                        Registro
                    </button>
                </>
            )}
        </div>
    );
};

export default MobileMenu;