import { useState } from "react"
import { useFetch } from "../hooks/useFetch"
import { toast } from "react-toastify"

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = useState(false)
    const fetchData = useFetch()

    // 1. Estado inicial solo con email y password
    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    if (!isOpen) return null

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = await fetchData("/registro", form, "POST", {}, false)

        if (data) {
            toast.info("Verifica tu correo electrónico", {
                position: "top-center",
                autoClose: 5000,
            })
            // Resetear el formulario y cerrar modal
            setForm({ email: "", password: "" })
            onClose()
        }
    }

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4">Crear cuenta</h2>

            <form onSubmit={handleSubmit}>
                {/* Campo Correo */}
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    placeholder="Correo electrónico"
                    className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    onChange={handleChange}
                    required
                />

                {/* Campo Contraseña con opción de visualizar */}
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        placeholder="Contraseña"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={handleChange}
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