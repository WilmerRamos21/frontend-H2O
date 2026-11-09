import axios from "axios";
import { toast } from "react-toastify";
import storeAuth from "../context/storeAuth";

export function useFetch() {
    const baseURL = import.meta.env.VITE_BACKEND_URL;

    const fetchDataBackend = async (endpoint, data = null, method = "GET", headers = {}) => {
        const token = storeAuth.getState().token;

        try {
            const urlFinal = `${baseURL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

            const options = {
                method,
                url: urlFinal,
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                    ...headers,
                },
                data
            };

            // AXIOS maneja automáticamente el Content-Type si es FormData.
            // Solo forzamos JSON si NO es FormData y hay datos.
            if (!(data instanceof FormData) && data) {
                options.headers["Content-Type"] = "application/json";
            }

            const response = await axios(options);
            return response?.data;

        } catch (error) {
            console.error(error);
            const mensaje = error.response?.data?.msg || "Error en la conexión";
            toast.error(mensaje);
            throw error;
        }
    };

    return fetchDataBackend;
}