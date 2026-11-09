import { useEffect, useState, useMemo } from "react";
import { useFetch } from "../hooks/useFetch";
import CardListarUsuarios from "./admin/CardListUsers"; 
import { toast } from "react-toastify";

import Swal from 'sweetalert2'

const ListarUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [terminoBusqueda, setTerminoBusqueda] = useState("");
    const fetchData = useFetch();

    

    useEffect(() => {
    const timeout = setTimeout(() => {
        setTerminoBusqueda(searchTerm);
    }, 400);
    return () => clearTimeout(timeout);
    }, [searchTerm]);


    useEffect(() => {
    const obtenerUsuarios = async () => {
        setLoading(true);
        try {
        const data = await fetchData(
            `listarusuarios?page=${paginaActual}&limit=10&search=${encodeURIComponent(terminoBusqueda)}`,
            null,
            "GET"
        );
        if (data) {
            setUsuarios(data.usuarios || []);
            setTotalPaginas(data.paginacion?.totalPaginas || 1);
        }
        } catch (error) {
        console.error("Error al cargar usuarios:", error);
        } finally {
        setLoading(false);
        }
    };
    obtenerUsuarios();
    }, [paginaActual, terminoBusqueda]);

    const handleDeleteUser = async(userId, estadoActual, nombre) =>{
        const accion = estadoActual ? 'desactivar': 'activar'

        const confirmar = await Swal.fire({
            title: `¿Quieres ${accion} a este usuario?`,
            text: `El usuario ${nombre} ${estadoActual ? "perderá" : "recuperará"} el acceso al sistema.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: estadoActual ? '#ef4444' : '#22c55e',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Sí, ${accion}`,
            cancelButtonText: 'Cancelar'
        })

        if(confirmar.isConfirmed){
            try{
                const data = await fetchData(`${userId}/estado`, {}, "PUT")
                if (data){
                    toast.success(data.msg)

                    setUsuarios(prev => prev.map(u =>
                        u._id === userId ? { ...u, status: !estadoActual} : u
                    ))
                }
            }catch(error){
                toast.error("Error al cambiar el estado del usuario")
            }
        }
    }

    const handleChangeRole = async(userId, nuevoRol, rolActual) => {

        if (nuevoRol === rolActual)return

        const confirmar = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a cambiar el rol de este usuario a ${nuevoRol}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cambiar rol',
            cancelButtonText: 'Cancelar'
        })

        if (confirmar.isConfirmed){
            try{
                const data = await fetchData(`${userId}/role`, {role: nuevoRol},"PUT")
                
                if(data){
                    toast.success("Rol actualizado")
                    // Actualizamos el estado local para reflejar el cambio sin recargar la página
                    setUsuarios(prev => prev.map(u => u._id === userId ? {...u, role: nuevoRol}: u))
                }

            }catch(error){
                toast.error("Error al actualizar el rol")
            }
        }

    }

    useEffect(() => {
        setPaginaActual(1);
    }, [terminoBusqueda]);

    if (loading) return <div className="text-center p-10">Cargando lista de usuarios...</div>;



    return (
        <div className="space-y-4">
            {/* Barra de búsqueda integrada */}
            <div className="relative max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    🔍
                </span>
                <input
                    type="text"
                    placeholder="Buscar por correo electrónico..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Pasamos la lista filtrada al diseño */}
            <CardListarUsuarios
                usuarios={usuarios}
                onChangeRole={handleChangeRole}
                onDeleteUser={handleDeleteUser}
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onPageChange={setPaginaActual}
                />
        </div>
    );
};

export default ListarUsuarios;