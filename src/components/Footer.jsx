import facebook from '../../public/facebook.png';
import whatsapp from '../../public/whatsapp2.png';
import insta from '../../public/insta.png';
import tiktok from '../../public/tik-tok.png';
import { Link } from 'react-router-dom';

export const Footer = () => {
    // Obtenemos y limpiamos el número de teléfono (solo dígitos, ej: 593999999999)
    const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");
    const defaultMessage = encodeURIComponent("Hola Ferretería H2O, me gustaría recibir más información sobre sus productos.");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

    return (
        <footer className='relative w-full bg-slate-800 shadow-md'>
            <div className='max-w-7xl mx-auto px-6 py-6 space-y-4'>
                
                {/* Fila Superior: Derechos y Redes Sociales */}
                <div className='flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0'>
                    
                    <p className='text-sm md:text-base lg:text-lg text-white text-center md:text-left order-2 md:order-1'>
                        ® Derechos Reservados - Ferretería H2O
                    </p>
                    
                    {/* Contenedor de iconos */}
                    <div className='flex items-center justify-center flex-wrap gap-4 order-1 md:order-2'>
                        
                        {/* Facebook */}
                        <a
                            href='https://www.facebook.com/share/1EQyKkb4fF/'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-block'
                            aria-label="Facebook"
                        >
                            <img src={facebook} alt='Facebook' className='h-8 w-auto md:h-9 lg:h-10 object-contain transition-transform hover:scale-110 cursor-pointer' />
                        </a>

                        {/* WhatsApp Directo al Chat */}
                        <a 
                            href={whatsappUrl} 
                            target='_blank' 
                            rel='noopener noreferrer'
                            className='inline-block'
                            aria-label="Contactar por WhatsApp"
                            title="Escríbenos por WhatsApp"
                        >
                            <img src={whatsapp} alt='WhatsApp' className='h-8 w-auto md:h-9 lg:h-10 object-contain transition-transform hover:scale-110 cursor-pointer' />
                        </a>

                        {/* Instagram */}
                        <a 
                            href='https://www.instagram.com/ferreh2o?stkn=dm9xNHI4bGR0dXNs' 
                            target='_blank' 
                            rel='noopener noreferrer'
                            className='inline-block'
                            aria-label="Instagram"
                        >
                            <img src={insta} alt='Instagram' className='h-8 w-auto md:h-9 lg:h-10 object-contain transition-transform hover:scale-110 cursor-pointer' />
                        </a>

                        {/* TikTok */}
                        <a 
                            href='https://www.tiktok.com/@ferre_h2o?_r=1&_t=ZS-99lgE4eB8Nw' 
                            target='_blank' 
                            rel='noopener noreferrer'
                            className='inline-block'
                            aria-label="TikTok"
                        >
                            <img src={tiktok} alt='TikTok' className='h-8 w-auto md:h-9 lg:h-10 object-contain transition-transform hover:scale-110 cursor-pointer' />
                        </a>

                    </div>
                </div>

                {/* Línea divisoria */}
                <hr className='border-gray-500 opacity-30' />

                {/* Fila Inferior: Enlaces Legales Responsivos */}
                <div className='flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-xs md:text-sm text-gray-200'>
                    <Link to="/terminos-condiciones" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                        Términos y Condiciones
                    </Link>
                    <span className="hidden sm:inline opacity-50">|</span>
                    <Link to="/politica-privacidad" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                        Política de Privacidad
                    </Link>
                </div>

            </div>
        </footer>
    );
};