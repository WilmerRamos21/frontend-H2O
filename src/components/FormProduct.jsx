import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { toast } from "react-toastify";
import CardFormProduct from "./products/CardFormProduct"; // Importamos la Card

const FormProduct = ({ producto, onClose, onSuccess }) => {
    const fetchData = useFetch();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "", brand: "", description: "", price: "", discount: 0, stock: 0, category: "Herramientas Manuales",
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (producto) {
            setFormData({
                name: producto.name,
                brand: producto.brand || "",
                description: producto.description || "",
                price: producto.price,
                discount: producto.discount || 0,
                stock: producto.stock || 0,
                category: producto.category,
            });
        }
    }, [producto]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
        // Pequeño truco para que la Card sepa que cambiamos la imagen
        setFormData({...formData, imageChanged: true}); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'imageChanged') dataToSend.append(key, formData[key]);
        });
        if (image) dataToSend.append("image", image);

        try {
            const url = producto ? `producto/${producto._id}` : "producto";
            const method = producto ? "PUT" : "POST";
            const res = await fetchData(url, dataToSend, method);
            
            if (res) {
                toast.success(producto ? "✅ Actualizado" : "✅ Creado");
                onSuccess();
                onClose();
            }
        } catch (error) {
            toast.error("❌ Error en la operación");
        } finally {
            setLoading(false);
        }
    };

    // Renderizamos la Card visual pasando toda la lógica por props
    return (
        <CardFormProduct 
            producto={producto}
            formData={formData}
            loading={loading}
            onChange={handleChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            onClose={onClose}
        />
    );
};

export default FormProduct;