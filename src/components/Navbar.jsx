import { useState, useRef, useEffect } from "react"
import storeAuth from "../context/storeAuth"
import { useOutsideClick } from "../hooks/useOutsideClick"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useCart } from "../context/CartContext"


import DesktopMenu from "./menus/DesktopMenu"
import MobileMenu from "./menus/MobileMenu"

import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal"

const Navbar = () => {
    const [view, setView] = useState(null)
    const token = storeAuth((state) => state.token)
    const rol = storeAuth((state) => state.rol)
    const logout = storeAuth((state) => state.logout)
    const panelRef = useRef()
    const navigate = useNavigate()
    const location = useLocation()
    const user = storeAuth((state) => state.user)
    const { cart } = useCart();

    const totalItems = cart?.productos?.reduce((acc, item) => acc + item.quantity, 0) || 0

    useEffect(()=>{
        if (location.state?.msg) {
            if (location.state.authSuccess) {
                toast.success(location.state.msg);
            } else if (location.state.authError) {
                toast.error(location.state.msg);
            }

            // limpieza para que si el usuario recarga la página, el toast NO vuelva a salir.
            window.history.replaceState({}, document.title);
        }
    }, [location])

    useOutsideClick(panelRef, () => {
        if (view) setView(null);
    });

    const toggleView = (newView) => {
        setView(view === newView ? null : newView)
    }

    return (
        <header className="relative w-full bg-slate-800 shadow-md">
            <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2">
                
                {/* Logo */}
                <div className="flex items-center">
                    <Link 
                        to='/' 
                        onClick={() => setView(null)} 
                        className="transform transition active:scale-95"
                    >
                        <img 
                            src="/H2O.png" 
                            alt="logo" 
                            className="h-12 w-auto md:h-16 lg:h-20 object-contain transition-transform hover:scale-105" 
                        />
                    </Link>
                </div>


                {/* MENÚ ESCRITORIO (Extraído a componente) */}
                <DesktopMenu 
                    token={token} 
                    rol={rol} 
                    logout={logout} 
                    setView={setView} 
                    location={location} 
                />

                {/* BOTÓN HAMBURGUESA (Móvil) */}
                <div className="md:hidden flex items-center">
                    <button 
                        type="button"
                        onClick={() => {
                            if (view === "menu"){
                                setView(null)
                            } else{
                                setView("menu")
                            }
                        }} 
                        className="p-2 z-70 relative touch-manipulation"
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {view === "menu" ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>
                </div>
            </nav>

            {/* PANEL DESPLEGABLE DINÁMICO */}
            {view && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-300 shadow-xl z-50 animate-slide-down">
                    <div ref={panelRef} className="max-w-md mx-auto p-6 relative">
                        <button 
                            onClick={() => {
                                setView(null);
                            }} 
                            className="hidden md:block absolute top-2 right-4 text-gray-400 text-3xl hover:text-gray-600 transition-colors"
                        >
                            &times;
                        </button>
                        
                        {/* 1. Vista Menú Móvil */}
                        <div className={`${view === "menu" ? "mt-4" : "mt-0"}`}>
                        {view === "menu" && (
                            <MobileMenu 
                                token={token} 
                                rol={rol} 
                                logout={logout} 
                                setView={setView} 
                            />
                        )}

                        {/* 2. Vista Login */}
                        {view === "login" && (
                            <div className="animate-fade-in">
                                <LoginModal 
                                    isOpen={true} 
                                    onClose={() => setView(null)}
                                    onSwitchToRegister={() => setView("register")}  
                                    onSwitchToRecoveryPassword={() => {
                                        setView(null);
                                        navigate("/recuperarpassword");
                                    }}
                                />
                            </div>
                        )}

                        {/* 3. Vista Registro */}
                        {view === "register" && (
                            <div className="animate-fade-in">
                                <RegisterModal 
                                    isOpen={true} 
                                    onClose={() => setView(null)} 
                                    onSwitchToLogin={() => setView("login")} 
                                />
                            </div>
                        )}
                        
                        </div>
                    </div>
                </div>
            )}
        </header>
    );

}

export default Navbar