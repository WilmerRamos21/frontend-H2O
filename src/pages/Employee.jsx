import { useState } from "react"
import { toast } from "react-toastify"
import { useFetch } from "../hooks/useFetch"
import { CardViewOrders } from "../components/admin/CardViewOrders";

import InventoryManagement from "../components/InventoryManagement" 

export const EmployeePage = () => {
    const [activeSection, setActiveSection] = useState('empleado');
    const fetchData = useFetch();


return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 p-4 md:p-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4 p-4 md:p-6 md:border-r border-gray-200 border-b md:border-b-0">
            <div className="flex items-center gap-4 mb-6 md:mb-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center text-xl md:text-2xl text-blue-600 font-bold">
                    {"A"}
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-700">Panel Empleado</h2>
            </div>
            {/* Navegación con la nueva opción de Inventario */}
            <nav className="flex flex-row md:flex-col gap-4 md:gap-6 text-gray-500 font-medium overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                {/* Nueva opción para Ferretería H2O */}
                <button 
                    onClick={() => setActiveSection("empleado")}
                    className={`whitespace-nowrap pl-2 md:pl-4 text-left transition-all ${activeSection === "empleado" ? "text-blue-600 border-b-2 md:border-b-0 md:border-l-4 border-blue-600 font-bold" : "hover:text-blue-500"}`}
                >
                    Gestionar Inventario
                </button>
                {/* NUEVA OPCIÓN: Ver Pedidos Globales */}
                <button 
                    onClick={() => setActiveSection("viewOrders")}
                    className={`whitespace-nowrap pl-2 md:pl-4 text-left transition-all ${activeSection === "viewOrders" ? "text-blue-600 border-b-2 md:border-b-0 md:border-l-4 border-blue-600 font-bold" : "hover:text-blue-500"}`}
                >
                    Historial de Ventas
                </button>
            </nav>
        </div>

        {/* Contenido Principal */}
        <div className="w-full md:w-3/4 pt-8 md:pl-12">

            {/* NUEVA SECCIÓN: Inventario */}
            {activeSection === "empleado" && (
                <div className="animate-fade-in">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 text-center md:text-left">
                        Control de Stock
                    </h1>
                    <InventoryManagement />
                </div>
            )}
            {/* NUEVA SECCIÓN: Listado de Órdenes */}
            {activeSection === "viewOrders" && (
                <div className="animate-fade-in">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 text-center md:text-left">
                            Ventas Realizadas
                    </h1>
                    <CardViewOrders />
                </div>
            )}
        </div>
        
    </div>
);
}