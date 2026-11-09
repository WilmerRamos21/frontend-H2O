const CardTableProducts = ({ productos, onEdit, onDelete, userRol }) => {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            {/* VISTA DESKTOP */}
            <div className="hidden md:block">
                
                <table className="w-full text-left border-collapse">
                    
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4 text-sm font-bold text-gray-600">Producto</th>
                            <th className="p-4 text-sm font-bold text-gray-600">Stock</th>
                            <th className="p-4 text-sm font-bold text-gray-600">Precio</th>
                            <th className="p-4 text-center text-sm font-bold text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {productos.map(p => (
                            <tr key={p._id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={p.image?.url} className="w-10 h-10 object-contain rounded border" />
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{p.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase">{p.brand}</p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    {p.stock === 0 ? (
                                        <span className='px-2 py-1 rounded text-[10px] bg-red-500 text-white font-bold'>0 UNI</span>
                                    ) : p.stock < 10 ? (
                                        <span className='px-2 py-1 rounded text-[10px] bg-yellow-500 text-white font-bold'>{p.stock} UNI</span>
                                    ) : (
                                        <span className='px-2 py-1 rounded text-[10px] bg-green-500 text-white font-bold'>{p.stock} UNI</span>
                                    )}
                                </td>
                                <td className="p-4 font-bold text-blue-800">${p.price}</td>
                                <td className="p-4 text-center space-x-2">
                                    <button onClick={() => onEdit(p)} className="text-blue-600 hover:text-blue-800">📝</button>
                                    { userRol === "ADMIN" && (
                                    <button onClick={() => onDelete(p._id, p.name)} className="text-red-500 hover:text-red-700">🗑️</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* VISTA MÓVIL (Cards) */}
            <div className="md:hidden divide-y divide-gray-100">
                {productos.map(p => (
                    <div key={p._id} className="p-4 flex items-center justify-between gap-4">
                        <img src={p.image?.url} className="w-14 h-14 object-contain rounded bg-gray-50" />
                        <div className="grow">
                            <p className="font-bold text-gray-800 text-sm leading-tight">{p.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold text-blue-700">${p.price}</span>
                                <span className={`text-[10px] font-bold ${p.stock < 5 ? 'text-red-500' : 'text-gray-400'}`}>
                                    Stock: {p.stock}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => onEdit(p)} className="p-2 bg-blue-50 text-blue-600 rounded-lg text-xs">Editar</button>
                        { userRol === "ADMIN" && (
                            <button onClick={() => onDelete(p._id, p.name)} className="p-2 bg-red-50 text-red-500 rounded-lg text-xs">Baja</button>
                        )

                        }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardTableProducts;