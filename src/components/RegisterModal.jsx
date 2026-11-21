import { useState } from "react"
import { useFetch } from "../hooks/useFetch"
import { toast } from "react-toastify"

const LETTERS_CLEAN_REGEX = /[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]/g;
const DIGITS_CLEAN_REGEX = /\D/g;

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = useState(false)
    const fetchData = useFetch()

    // 1. Estado inicial solo con email y password
    const initialState = {
        name: "",
        lastname: "",
        email: "",
        password: "",
        phone: ""
    }

    if (!isOpen) return null
    const [formData, setFormData] = useState(initialState);
    const [submitting, setSubmitting] = useState(false)

        const handleLettersChange = (field) => (e) => {
        const cleanValue = e.target.value
            .replace(LETTERS_CLEAN_REGEX, "")
            .slice(0, 50);
        
            setFormData((prev) => ({
                ...prev,
                [field]: cleanValue,
            }))
    };

    const handleEmailChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            email: e.target.value,
        }));
    };

    const handlePasswordChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            password: e.target.value,
        }))
    }
    const handlePhoneChange = (e) => {
        const cleanPhone = e.target.value
        .replace(DIGITS_CLEAN_REGEX, "")
        .slice(0, 10);

        setFormData((prev) => ({
            ...prev,
            phone: cleanPhone
        }))
    };


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (submitting) return

        setSubmitting(true)

        try{

        const data = await fetchData("/registro", formData, "POST", {}, false)

        if (data) {
            toast.info("Verifica tu correo electrónico", {
                position: "top-center",
                autoClose: 5000,
            })
            // Resetear el formulario y cerrar modal
            setFormData(initialState)
            onClose()
        }} finally{
            setSubmitting(false)
        }
    }

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4">Crear cuenta</h2>

            <form onSubmit={handleSubmit}>
                {/* Campo de nombre completo*/}
                <input
                    type="text"
                    name="name"
                    maxLength={50}
                    value={formData.name}
                    placeholder="Nombres completos"
                    className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    onChange={handleLettersChange("name")}
                    required
                />
                {/* Campo de apellido completo*/}
                <input
                    type="text"
                    name="lastname"
                    maxLength={50}
                    value={formData.lastname}
                    placeholder="Apellidos completos"
                    className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    onChange={handleLettersChange("lastname")}
                    required
                />
                {/* Campo de numero de contacto*/}
                <input
                    type="text"
                    name="phone"
                    maxLength={10}
                    inputMode="numeric"
                    value={formData.phone}
                    placeholder="Número de contacto"
                    className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    onChange={handlePhoneChange}
                    required
                />

                {/* Campo Correo */}
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Correo electrónico"
                    className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    onChange={handleEmailChange}
                    required
                />

                {/* Campo Contraseña con opción de visualizar */}
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        placeholder="Contraseña"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={handlePasswordChange}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-2.5 text-sm text-gray-600 hover:text-gray-800"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 transition-colors"
                >
                    Registrarse
                </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <button
                    type="button"
                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                    onClick={() => {
                        onClose()
                        onSwitchToLogin()
                    }}
                >
                    Inicia sesión
                </button>
            </p>
        </div>
    )
}

export default RegisterModal