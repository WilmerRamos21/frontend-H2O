import { useState } from "react";
import {ListProducts } from "./ListProducts";

export const HomePage = () => {
    const [filtros, setFiltros] = useState({});

    const categorias = [
        "Herramientas Manuales", "Herrajes", "Herramientas Eléctricas", 
        "Plomería", "Jardinería", "Pintura", "Ferretería General"
    ];

    return (
        <div className="max-w-1440px mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                
                {/* Sidebar de Filtros (Estilo Kywi) */}
                <aside className="w-full md:w-64 shrink-0">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Filtros</h2>
                    
                    <div className="space-y-6">
                        {/* Filtro Categoría */}
                        <div>
                            <h3 className="font-bold text-sm mb-3 uppercase text-gray-600">Categoría</h3>
                            <div className="flex flex-col gap-2">
                                {categorias.map(cat => (
                                    <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600">
                                        <input 
                                            type="radio" 
                                            name="category" 
                                            onChange={() => setFiltros({...filtros, category: cat})}
                                            className="accent-[#005596]"
                                        />
                                        {cat}
                                    </label>
                                ))}
                                <button 
                                    onClick={() => setFiltros({})}
                                    className="text-xs text-red-500 mt-2 text-left font-bold"
                                >
                                    LIMPIAR FILTROS
                                </button>
                            </div>
                        </div>

                    </div>
                </aside>

                {/* Contenido Principal */}
                <main className="grow">
                    <div className="flex justify-between items-end mb-6">
                        {/* Buscador Rápido */}
                        <div className="relative w-full max-w-xs">
                            <input 
                                type="text"
                                placeholder="Buscar en esta categoría..."
                                onChange={(e) => setFiltros({...filtros, name: e.target.value})}
                                className="w-full border-b-2 border-gray-200 py-1 px-2 focus:border-[#005596] outline-none text-sm"
                            />
                        </div>
                    </div>

                    <ListProducts filtros={filtros} />
                </main>
            </div>
        </div>
    );
};