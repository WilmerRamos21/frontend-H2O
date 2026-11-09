export const TermsPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Términos y Condiciones de Uso</h1>
            <p className="mb-4 text-sm text-gray-500">Última actualización: Mayo 2026</p>
            
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">1. Generalidades y Cobertura Local</h2>
                <p>Este sitio web está destinado exclusivamente a la comercialización y despacho de herramientas, materiales y productos de ferretería a nivel local dentro de Quito / Mitad del mundo. No realizamos envíos fuera de esta zona de cobertura a menos que se coordine previamente de forma explícita.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. Precios y Disponibilidad de Stock</h2>
                <p>Todos los precios mostrados en la página web incluyen los. impuestos de ley. Debido a la naturaleza del sector ferretero, el stock de ciertos materiales de alta rotación puede variar rápidamente. En caso de que pagues por un producto que se haya agotado, te contactaremos de inmediato para ofrecerte un reemplazo equivalente o la devolución total de tu dinero.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">3. Entregas, Despacho y Retiro</h2>
                <p>Retiro en Tienda: El cliente puede optar por recoger su pedido en nuestra sucursal física sin costo adicional, presentando su comprobante de pago digital.</p>
                <p>Envío a Domicilio: Los envíos locales se programarán dentro de las [X] horas/días hábiles posteriores a la confirmación del pago.</p>
                <p>Materiales Pesados: Para compras de materiales de construcción, de gran volumen o peso pesado, la entrega se realizará a pie de camión (primer piso o planta baja), salvo acuerdo previo.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">4. Políticas de Garantía y Devoluciones</h2>
                <p>Todos nuestros productos cuentan con la garantía legal del fabricante contra defectos de fábrica.Para solicitar un cambio o devolución, el cliente dispone de [X, ej: 5 o 30] días desde la recepción del producto. Este debe devolverse en su empaque original, sin señales de uso y con la factura correspondiente.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">5. Métodos de Pago y Facturación</h2>
                <p>Pasarela de Pago Segura: Los pagos en nuestro sitio web se procesan exclusivamente de forma digital utilizando Stripe, una de las plataformas de pago más seguras y confiables a nivel mundial.</p>
                <p>Tarjetas Aceptadas: Aceptamos tarjetas de crédito y débito nacionales e internacionales (Visa, Mastercard, American Express, entre otras).</p>
                <p>Validación del Pedido: El procesamiento y despacho de los materiales de ferretería comenzará una vez que Stripe confirme y autorice el cobro de manera exitosa. Si el pago es rechazado por el banco emisor, el pedido se cancelará automáticamente.</p>
                <p>Comprobante de Venta: Tras confirmar el pago, el sistema generará y enviará automáticamente la factura o comprobante de venta digital al correo electrónico registrado por el cliente.</p>
            </section>
        </div>
    );
};