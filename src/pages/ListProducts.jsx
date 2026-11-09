import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import CardProduct from "../components/products/CardProduct";

export const ListProducts = ({ filtros }) => {
    const [data, setData] = useState({ products: [], totalPages: 1 });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const fetchData = useFetch();

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            // Construimos la query string basada en tu backend
            const query = new URLSearchParams({
                page,
                limit: 16,
                ...filtros
            }).toString();

            const res = await fetchData(`productos?${query}`, null, "GET");
            if (res) setData(res);
            setLoading(false);
        };
        getProducts();
    }, [page, filtros]);

    if (loading) return <div className="p-10 text-center">Cargando catálogo...</div>;

    return (
        <div className="space-y-8">
            {/* Grid de Productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {data.products.map(prod => (
                    <CardProduct key={prod._id} producto={prod} />
                ))}
            </div>

            {/* Paginación Simple */}
            <div className="flex justify-center items-center gap-4 py-8 border-t border-gray-100">
                <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-50"
                >
                    Anterior
                </button>
                <span className="font-bold text-gray-600">Página {page} de {data.totalPages}</span>
                <button 
                    disabled={page === data.totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};