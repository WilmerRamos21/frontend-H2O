export const PrivacyPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Políticas de Privacidad</h1>
            <p className="mb-4 text-sm text-gray-500">Última actualización: Mayo 2026</p>
            
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">1. Información que Recopilamos y Seguridad de tus Pagos</h2>
                <p>🔒 Seguridad Absoluta en tus Pagos (Stripe): Al realizar una compra, la información de tu tarjeta de crédito o débito se introduce directamente en los servidores seguros de Stripe mediante una conexión cifrada (SSL/TLS). Ferretería H2O nunca almacena, visualiza ni tiene acceso a los datos completos de tu tarjeta. Stripe solo nos notifica si el pago fue aprobado o rechazado para que podamos proceder con la entrega de tu mercancía.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. Uso de la Información</h2>
                <p>Tus datos personales se utilizan estrictamente para:</p>
                <p>Procesar, facturar y entregar tus pedidos de ferretería.</p>
                <p>Coordinar la entrega local a través de nuestros repartidores o servicios de mensajería.</p>
                <p>Contactarte rápidamente por WhatsApp o teléfono en caso de haber un problema con el stock o la dirección de entrega.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">3. Compartición de Datos</h2>
                <p>Ferretería H2O no vende, alquila ni comparte tus datos con terceras empresas para fines publicitarios. Tus datos de dirección y teléfono solo se compartirán con el personal de transporte encargado de llevar tu pedido a tu domicilio.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">4. Tus Derechos</h2>
                <p>Tienes derecho a solicitar el acceso, corrección o eliminación de tus datos personales de nuestra base de datos en cualquier momento. Para hacerlo, puedes comunicarte con nosotros directamente a través de cualquiera de nuestros canales oficiales de atención.</p>
            </section>

                        <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. Precios y Disponibilidad de Stock</h2>
                <p>Todos los precios mostrados en la página web incluyen los impuestos de ley. Debido a la naturaleza del sector ferretero, el stock de ciertos materiales de alta rotación puede variar rápidamente...</p>
            </section>
        </div>
    );
};