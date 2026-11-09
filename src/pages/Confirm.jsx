import {Link, useParams, useNavigate} from 'react-router-dom'
import {useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import {useFetch} from '../hooks/useFetch'
import logoNegocio from '../assets/H2O.png'



export const Confirm = () =>{
    const navigate = useNavigate()
    const fetchData = useFetch()
    const {token} = useParams()


    useEffect(() => {
        const verificarToken = async () => {

            const data = await fetchData(`confirmar/${token}`)

            if(data){
                navigate("/", {
                    state:{
                        authSuccess: true,
                        msg: "¡Cuenta verificada! Ya puedes iniciar sesión"
                    }
                });
            } else{
                navigate("/",{
                    state:{
                        authError: true,
                        msg: "El enlace a expirado o token inválido"
                    }
                })
            }
        }
        verificarToken()
    }, [token])

return null;
}