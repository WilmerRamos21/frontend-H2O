import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Asegúrate de que la ruta sea correcta

const DesktopMenu = ({ token, rol, logout, setView, location }) => {
    const { cart, setIsOpen } = useCart();
    
    // Calculamos el total de items
    const totalItems = cart?.productos?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    if (!token) {
        return (
            <div className="hidden md:flex items-center gap-6">
                <button 
                    onClick={() => setView("login")} 
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                    Iniciar Sesión
                </button>
                <button 
                    onClick={() => setView("register")} 
                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all shadow-sm active:scale-95"
                >
                    Registro
                </button>
            </div>
        );
    }

    return (
        <div className="hidden md:flex items-center gap-4">
            {/* BOTÓN DEL CARRITO (Versión Desktop) */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 bg-blue-200 rounded-full hover:bg-sky-500 transition-all shadow-md active:scale-90"
            >
                <span className="text-xl">🛒</span>
                {totalItems > 0 && (
                    <span className='absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 rounded-full border-2 border-white animate-bounce-short'>
                        {totalItems}
                    </span>
                )}
            </button>

            {rol?.toUpperCase() === "ADMIN" && location.pathname !== '/administrador' && (
                <Link 
                    to="/administrador" 
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 border border-blue-200 transition-all font-bold shadow-sm"
                >
                    🛠️ Admin
                </Link>
            )}

            {rol?.toUpperCase() === "EMPLEADO" && location.pathname !== '/empleado' && (
                <Link 
                    to="/empleado" 
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 border border-blue-200 transition-all font-bold shadow-sm"
                >
                    🛠️ Empleado
                </Link>
            )}

            {location.pathname !== '/perfil' && (
                <Link 
                    to="/perfil" 
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                    👤 Mi cuenta
                </Link>
            )}

            <button 
                onClick={logout} 
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all shadow-sm active:scale-95 font-semibold"
            >
                Salir
            </button>
        </div>
    );
};

export default DesktopMenu;