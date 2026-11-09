import facebook from '../../public/facebook.png'
import x from '../../public/x.png'
import whatsapp from '../../public/whatsapp2.png'
import insta from '../../public/insta.png'
import tiktok from '../../public/tik-tok.png'
import { Link } from 'react-router-dom'

export const Footer = () => {
    return (
        <div className='relative w-full  bg-slate-800 shadow-md'>
            {/* 
            Cambios responsivos clave:
            - flex-col (móviles): apila el texto y los iconos verticalmente.
            - md:flex-row (pantallas md en adelante): los pone en una sola línea horizontal.
            - text-center y gap-4 en móvil para dar una separación limpia.
            */}
            <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 py-4 md:py-3 gap-4 md:gap-0'>
                
                <p className='text-sm md:text-base lg:text-lg text-white text-center md:text-left order-2 md:order-1'>
                    ® Derechos Reservados - Ferretería H2O
                </p>
                
                {/* 
                Contenedor de iconos:
                - flex-wrap: por si el usuario tiene un celular muy pequeño, evita que se desborden.
                - gap-4: da una separación más cómoda entre las 5 redes sociales.
                */}
                <div className='flex items-center justify-center flex-wrap gap-4 order-1 md:order-2'>
                    
                    {/* Facebook */}
                    <a
                        href='https://www.facebook.com/share/1EQyKkb4fF/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-block'
                    >
                        <img src={facebook} alt='Facebook' className='h-8 w-auto md:h-9 lg:h-10 object-contain transition-transform hover:scale-110 cursor-pointer' />
                    </a>

                    {/* WhatsApp */}
                    <a 
                        href='https://www.whatsapp.com/' 
                        target='_blank' 
                        rel='noopener noreferrer'
                        className='inline-block'
                    >
                        <img src={whatsapp} alt='WhatsApp' className='h-8 w-auto md:h-9 lg:h-10 object-contain transition-transform hover:scale-110 cursor-pointer' />
                    </a>

                    {/* Instagram */}
                    <a 
                        href='https://www.instagram.com/ferreh2o?stkn=dm9xNHI4bGR0dXNs' 
                        target='_blank' 
                        rel='noopener noreferrer'
                        className='inline-block'
                    >
                        <img src={insta} alt='Instagram' className='h-8 w-auto md:h-9 lg:h-10 object-contain transition-transform hover:scale-110 cursor-pointer' />
                    </a>

                    {/* TikTok */}
                    <a 
                        href='https://www.tiktok.com/@ferre_h2o?_r=1&_t=ZS-99lgE4eB8Nw' 
                        target='_blank' 
                        rel='noopener noreferrer'
                        className='inline-block'
                    >
                        <img src={tiktok} alt='TikTok' className='h-8 w-auto md:h-9 lg:h-10 object-contain transition-transform hover:scale-110 cursor-pointer' />
                    </a>

                </div>

                {/* Línea divisoria decorativa discreta */}
                <hr className='border-gray-300 opacity-30' />

                {/* Fila Inferior: Enlaces Legales Responsivos */}
                <div className='flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-xs md:text-sm text-gray-200'>
                    <Link to="/terminos-condiciones" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                        Términos y Condiciones
                    </Link>
                    <span className="hidden sm:inline opacity-50">|</span> {/* Separador visual que se oculta en móvil */}
                    <Link to="/politica-privacidad" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                        Política de Privacidad
                    </Link>
                </div>

            </div>
        </div>
    )
}