

const CardListUsers = ({
        usuarios,
        onChangeRole,
        onDeleteUser,
        paginaActual,
        totalPaginas,
        onPageChange
    }) => {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            {/* Versión Escritorio: Visible desde md (768px) en adelante */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-700">Usuario</th>
                            <th className="p-4 font-semibold text-gray-700">Email</th>
                            <th className="p-4 font-semibold text-gray-700">Rol</th>
                            <th className="p-4 font-semibold text-gray-700">Estado</th>
                            <th className="p-4 font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.length > 0 ? (
                            usuarios.map((user) => (
                                <tr key={user._id} className={`border-b transition ${!user.status ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                                    <td className="p-4">
                                        <p className={`font-bold ${!user.status ? 'text-gray-400' : 'text-gray-800'}`}>
                                            {user.name} {user.lastname}
                                        </p>
                                    </td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => onChangeRole(user._id, e.target.value, user.role)}
                                            className={`p-1.5 rounded-lg border text-xs font-bold outline-none cursor-pointer transition-colors ${
                                                user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200':
                                                user.role === 'EMPLEADO' ? 'bg-blue-50 text-blue-700 border-blue-200': 
                                                'bg-green-50 text-green-700 border-green-200'
                                                }`}
                                        >
                                            <option value='CLIENTE'>CLIENTE</option>
                                            <option value='EMPLEADO'>EMPLEADO</option>
                                            <option value='ADMIN'>ADMIN</option>
                                        </select>
                                    </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${user.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.status ? "ACTIVO" : "INACTIVO"}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => onDeleteUser(user._id, user.status, user.name)}
                                        title={user.status ? "Desactivar Usuario" : "Activar Usuario"}
                                        className={`p-2 rounded-full transition-colors ${
                                            user.status 
                                            ? 'text-red-500 hover:bg-red-100' 
                                            : 'text-green-500 hover:bg-green-100'
                                        }`}
                                    >
                                        {user.status ? (
                                            /* Icono de Basura / Desactivar */
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        ) : (
                                            /* Icono de Check / Activar */
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-10 text-center text-gray-500">No hay usuarios registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Versión Móvil: Visible solo en pantallas pequeñas (menores a md) */}
            <div className="md:hidden divide-y divide-gray-200">
                {usuarios.length > 0 ? (
                    usuarios.map((user) => (
                        <div key={user._id} className="p-4 space-y-3 bg-white hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-900 text-lg">{user.name} {user.lastname}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Rol</p>
                                    <select
                                        value={user.role}
                                        onChange={(e) => onChangeRole(user._id, e.target.value, user.role)}
                                        className={`p-1 rounded text-xs font-bold border-gray-200 ${
                                            user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700':                                                user.role === 'EMPLEADO' ? 'bg-blue-50 text-purple-700': 'bg-green-50 text-green-700'
                                            }`}
                                    >
                                        <option value='CLIENTE'>CLIENTE</option>
                                        <option value='EMPLEADO'>EMPLEADO</option>
                                        <option value='ADMIN'>ADMIN</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                <span className="text-xs text-gray-400 font-semibold uppercase">Estado:</span>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${user.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.status ? "ACTIVO" : "INACTIVO"}
                                    </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                <span className="text-xs text-gray-400 font-semibold uppercase">Acciones:</span>
                                <button
                                        onClick={() => onDeleteUser(user._id, user.status, user.name)}
                                        title={user.status ? "Desactivar Usuario" : "Activar Usuario"}
                                        className={`p-2 rounded-full transition-colors ${
                                            user.status 
                                            ? 'text-red-500 hover:bg-red-100' 
                                            : 'text-green-500 hover:bg-green-100'
                                        }`}
                                    >
                                        {user.status ? (
                                            /* Icono de Basura / Desactivar */
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        ) : (
                                            /* Icono de Check / Activar */
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-10 text-center text-gray-500">No hay usuarios registrados.</div>
                )}
            </div>
                {/* Paginación */}
                <div className="flex justify-center items-center gap-4 py-8 border-t border-gray-100">

                    <button
                        disabled={paginaActual === 1}
                        onClick={() => onPageChange(paginaActual - 1)}
                        className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-50"
                    >
                        Anterior
                    </button>

                    <span className="font-bold text-gray-600">
                        Página {paginaActual} de {totalPaginas}
                    </span>

                    <button
                        disabled={paginaActual >= totalPaginas}
                        onClick={() => onPageChange(paginaActual + 1)}
                        className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-50"
                    >
                        Siguiente
                    </button>

                </div>
        </div>
    );
};

export default CardListUsers