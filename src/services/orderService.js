import axios from 'axios'

const API = import.meta.env.VITE_BACKEND_URL

// Actualizar estado del envío

export const actualizarEstadoEnvio = async (id, status, token) =>{

    const response = await axios.patch(
        `${API}/admin/orden/${id}/envio`,
        {status}, 
        {
            headers:{
                Authorization: `Bearer ${token}`
        }
    })
    return response.data
}