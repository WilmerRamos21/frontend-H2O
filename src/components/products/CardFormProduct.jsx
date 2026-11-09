const CardFormProduct = ({ 
    producto, 
    formData, 
    loading, 
    onChange, 
    onFileChange, 
    onSubmit, 
    onClose 
}) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh] border border-gray-100">
                
                {/* Cabecera del Modal */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-2xl font-extrabold text-gray-800">
                        {producto ? 'Editar Herramienta' : 'Registrar Nueva Herramienta'}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Formulario Visual */}
                <form onSubmit={onSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Nombre del Producto *</label>
                        <input name="name" value={formData.name} onChange={onChange} required className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition" placeholder="Ej: Taladro Percutor 20V" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Marca</label>
                        <input name="brand" value={formData.brand} onChange={onChange} className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition" placeholder="Ej: DeWalt" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Categoría *</label>
                        <select name="category" value={formData.category} onChange={onChange} required className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition bg-white cursor-pointer">
                            <option value="Herramientas Manuales">Herramientas Manuales</option>
                            <option value="Herramientas Eléctricas">Herramientas Eléctricas</option>
                            <option value="Plomería">Plomería</option>
                            <option value="Jardinería">Jardinería</option>
                            <option value="Pintura">Pintura</option>
                            {/* ... otras opciones ... */}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Precio Lista ($) *</label>
                        <input type="number" name="price" value={formData.price} onChange={onChange} required className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition" placeholder="0.00" step="0.01" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Descuento (%)</label>
                        <input 
                            type="number" 
                            name="discount" 
                            value={formData.discount} 
                            onChange={onChange} 
                            className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition" 
                            placeholder="Ej: 10" 
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Stock Disponible</label>
                        <input type="number" name="stock" value={formData.stock} onChange={onChange} className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition" placeholder="0" />
                    </div>

                    <div className="md:col-span-2 space-y-1 mt-2 border border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Imagen del Producto</label>
                        <input type="file" accept="image/*" onChange={onFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                        {producto?.image?.url && !formData.imageChanged && (
                            <p className="text-xs text-amber-600 mt-2">Carga una nueva imagen para actualizar la imagen del producto</p>
                        )}
                    </div>

                    <div className="md:col-span-2 space-y-1 mt-4 flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2">
                            {loading ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    {producto ? 'Actualizando...' : 'Creando...'}
                                </>
                            ) : (
                                producto ? 'Guardar Cambios' : 'Crear Producto'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardFormProduct;