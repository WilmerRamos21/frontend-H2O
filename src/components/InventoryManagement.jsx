import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import CardTableProducts from "./products/CardTableProducts";
import FormProduct from "./FormProduct";
import Swal from 'sweetalert2';
import storeAuth from "../context/storeAuth";

const InventoryManagement = () => {
    const [productos, setProductos] = useState([]);
    const [productoEdit, setProductoEdit] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Estados de búsqueda y paginación

    const [busqueda, setBusqueda] = useState("");

    const [paginaActual, setPaginaActual] = useState(1);

    const [totalPaginas, setTotalPaginas] = useState(1);

    const [totalProductos, setTotalProductos] = useState(0);

    const fetchData = useFetch();

    const user = storeAuth((state) => state.user)
    const rol = storeAuth((state) => state.rol)

    const obtenerProductos = async () => {

        const res = await fetchData(
            `productos?page=${paginaActual}&limit=10&name=${encodeURIComponent(busqueda)}`,
            null,
            "GET"
        );

        if (res) {
            setProductos(res.products);
            setTotalPaginas(res.totalPages);
            setTotalProductos(res.total);
        }

    };

    useEffect(() => {

        obtenerProductos();

    }, [paginaActual, busqueda]);

    const handleBusqueda = (e) => {

        setBusqueda(e.target.value);

        setPaginaActual(1);

    };

    const handleEliminar = async (id, nombre) => {
        const confirmar = await Swal.fire({
            title: `¿Desactivar ${nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, dar de baja'
        });

        if (confirmar.isConfirmed) {
            const res = await fetchData(`producto/${id}/status`, null, "DELETE");
            if (res) obtenerProductos(); // Refrescamos la lista
        }
    };

    return (

        <div className="space-y-6">

            {/* ENCABEZADO */}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">

                <h2 className="text-xl font-black text-gray-800">

                    Inventario de Productos

                </h2>

                {rol === "ADMIN" && (

                    <button

                        onClick={() => {

                            setProductoEdit(null);

                            setShowModal(true);

                        }}

                        className="bg-[#005596] text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-800 transition shadow-md"

                    >

                        + Nuevo Producto

                    </button>

                )}

            </div>

            {/* BUSCADOR */}

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">

                <div className="flex flex-col sm:flex-row gap-3 justify-between">

                    <input

                        type="text"

                        placeholder="Buscar producto por nombre..."

                        value={busqueda}

                        onChange={handleBusqueda}

                        className="w-full sm:max-w-md border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"

                    />

                    <p className="text-sm text-gray-500 self-center">

                        {totalProductos} productos encontrados

                    </p>

                </div>

            </div>

            {/* TABLA DE PRODUCTOS */}

            <CardTableProducts

                productos={productos}

                onEdit={(p) => {

                    setProductoEdit(p);

                    setShowModal(true);

                }}

                onDelete={handleEliminar}

                userRol={rol}

            />

            {/* PAGINACIÓN */}

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">

                <button

                    onClick={() => setPaginaActual(p => p - 1)}

                    disabled={paginaActual === 1}

                    className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-50"

                >

                    Anterior

                </button>

                <span className="text-sm font-semibold text-gray-700">

                    Página {paginaActual} de {totalPaginas}

                </span>

                <button

                    onClick={() => setPaginaActual(p => p + 1)}

                    disabled={paginaActual >= totalPaginas}

                    //className="px-4 py-2 bg-gray-200 rounded-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                    className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-50"

                >

                    Siguiente

                </button>

            </div>

            {/* MODAL DE PRODUCTO */}

            {showModal && (

                <FormProduct

                    producto={productoEdit}

                    onClose={() => setShowModal(false)}

                    onSuccess={obtenerProductos}

                />

            )}

        </div>

    );
};

export default InventoryManagement;