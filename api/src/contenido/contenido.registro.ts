/**
 * Registro de todo lo que Cintia puede editar desde el admin además de la
 * portada, las líneas y los más vendidos (que tienen sus propias tablas).
 *
 * Cada campo tiene una `clave` estable, el copy con el que arranca
 * (`porDefecto`: exactamente lo que estaba escrito en el código del frontend) y
 * cómo se edita. En la base solo se guardan los valores que ella cambió (tabla
 * Texto); todo lo demás sale de acá. Sumar un texto editable nuevo es agregar
 * una línea a CAMPOS y leerlo en el frontend con la misma clave.
 *
 * En los textos se pueden usar estas marcas, que el frontend reemplaza:
 *   {envioGratis}  monto desde el que el envío en zona es sin cargo
 *   {costoEnvio}   costo fijo del envío en zona
 */

export type TipoCampo = 'texto' | 'largo' | 'numero' | 'lista' | 'imagen';

export interface Campo {
  clave: string;
  grupo: string;
  etiqueta: string;
  ayuda?: string;
  tipo: TipoCampo;
  porDefecto: string;
}

export interface Grupo {
  id: string;
  titulo: string;
  descripcion: string;
  /** Qué pantalla del admin lo muestra. */
  pantalla: 'textos' | 'envios';
}

const MARCAS = 'Podés usar {envioGratis} para que se escriba solo el monto de envío gratis.';

export const GRUPOS: Grupo[] = [
  { id: 'anuncios', titulo: 'Barra de anuncios', descripcion: 'Los mensajes que rotan arriba de todo el sitio, uno por vez. Dejá un renglón vacío para no mostrarlo.', pantalla: 'textos' },
  { id: 'franja', titulo: 'Franja de atributos', descripcion: 'La cinta que se desplaza debajo de la portada y de cada producto. Cada renglón lleva su ícono; dejá uno vacío para no mostrarlo.', pantalla: 'textos' },
  { id: 'combos-home', titulo: 'Combos en la portada', descripcion: 'El título de la sección de combos de la portada.', pantalla: 'textos' },
  { id: 'pilares', titulo: 'Nuestro Origen en la portada', descripcion: 'El bloque con los tres pilares de la marca. Cada uno puede llevar una foto cuadrada; sin foto se muestra solo el texto.', pantalla: 'textos' },
  { id: 'banner', titulo: 'Banner «Armá tu ritual»', descripcion: 'El banner de la portada que lleva al selector de rituales. Sin foto se muestra de color liso.', pantalla: 'textos' },
  { id: 'pie', titulo: 'Pie de página', descripcion: 'Lo que se lee al final de todas las páginas.', pantalla: 'textos' },
  { id: 'ficha', titulo: 'Ficha de producto', descripcion: 'Los textos fijos que acompañan a cada producto (la caja de opciones de compra, los íconos y los títulos de las secciones).', pantalla: 'textos' },
  { id: 'combos', titulo: 'Combos', descripcion: 'Textos de la lista de combos y de la página de cada combo.', pantalla: 'textos' },
  { id: 'rituales', titulo: 'Rituales AM / PM', descripcion: 'Los textos de las páginas de rituales.', pantalla: 'textos' },
  { id: 'carrito', titulo: 'Carrito', descripcion: 'Los textos del carrito lateral.', pantalla: 'textos' },
  { id: 'checkout', titulo: 'Finalizar compra', descripcion: 'Los avisos que se leen mientras la persona completa el pedido.', pantalla: 'textos' },
  { id: 'envio', titulo: 'Envíos', descripcion: 'El monto para envío gratis, el costo del reparto y los barrios de la zona. Lo que pongas acá es también lo que se le cobra a quien compra.', pantalla: 'envios' },
  { id: 'pago', titulo: 'Datos para transferir', descripcion: 'Lo que ve la persona al terminar el pedido para pagar por transferencia. Lo que dejes vacío no se muestra.', pantalla: 'envios' },
];

const franja = (n: number, porDefecto: string): Campo => ({
  clave: `franja.${n}`,
  grupo: 'franja',
  etiqueta: `Renglón ${n}`,
  tipo: 'texto',
  porDefecto,
});

const anuncio = (n: number, porDefecto: string): Campo => ({
  clave: `anuncio.${n}`,
  grupo: 'anuncios',
  etiqueta: `Mensaje ${n}`,
  ayuda: n === 1 ? MARCAS : undefined,
  tipo: 'texto',
  porDefecto,
});

const pilar = (n: number, titulo: string, texto: string): Campo[] => [
  { clave: `home.pilar.${n}.titulo`, grupo: 'pilares', etiqueta: `Pilar ${n} — título`, tipo: 'texto', porDefecto: titulo },
  { clave: `home.pilar.${n}.texto`, grupo: 'pilares', etiqueta: `Pilar ${n} — texto`, tipo: 'largo', porDefecto: texto },
  { clave: `home.pilar.${n}.foto`, grupo: 'pilares', etiqueta: `Pilar ${n} — foto`, ayuda: 'Cuadrada, con un solo ingrediente sobre fondo neutro.', tipo: 'imagen', porDefecto: '' },
];

export const CAMPOS: Campo[] = [
  // ---- Barra de anuncios
  anuncio(1, 'Reparto propio en la zona todos los viernes'),
  anuncio(2, 'Envío sin cargo desde {envioGratis}'),
  anuncio(3, 'Entrega en Canning y zona sur'),
  anuncio(4, '15% de descuento pagando por transferencia'),
  anuncio(5, ''),

  // ---- Franja de atributos
  franja(1, '100% trazable'),
  franja(2, 'Sin rellenos ni ingredientes innecesarios'),
  franja(3, 'Upgrade de bienestar'),
  franja(4, 'Slow living'),
  franja(5, ''),
  franja(6, ''),

  // ---- Portada
  { clave: 'home.combos.titulo', grupo: 'combos-home', etiqueta: 'Título de la sección', tipo: 'texto', porDefecto: 'Combos Sinérgicos' },

  { clave: 'home.pilares.titulo', grupo: 'pilares', etiqueta: 'Título del bloque', tipo: 'texto', porDefecto: 'Nuestro Origen' },
  {
    clave: 'home.pilares.texto',
    grupo: 'pilares',
    etiqueta: 'Texto del bloque',
    tipo: 'largo',
    porDefecto:
      'No nos propusimos crear una marca más de productos naturales. ¿Cómo podemos hacer de un simple momento una experiencia de bienestar profunda, que forme parte de la vida cotidiana sin esfuerzo?',
  },
  { clave: 'home.pilares.boton', grupo: 'pilares', etiqueta: 'Texto del botón', ayuda: 'Lleva a la página «Nuestro Origen».', tipo: 'texto', porDefecto: 'Aprender más' },
  ...pilar(1, 'Origen trazable', 'Sabemos de dónde viene cada ingrediente y lo contamos en la ficha de cada producto.'),
  ...pilar(2, 'Sin rellenos', 'Solo lo que cumple una función. Nada de ingredientes innecesarios.'),
  ...pilar(3, 'Upgrade de bienestar', 'Pequeños rituales, de la mañana a la noche, que se integran a tu día sin esfuerzo.'),

  { clave: 'home.banner.titulo', grupo: 'banner', etiqueta: 'Título', tipo: 'texto', porDefecto: 'Armá tu ritual' },
  { clave: 'home.banner.texto', grupo: 'banner', etiqueta: 'Texto', tipo: 'largo', porDefecto: 'El día tiene dos mitades. Elegí tu momento: mañana o noche.' },
  { clave: 'home.banner.boton', grupo: 'banner', etiqueta: 'Texto del botón', ayuda: 'Lleva al selector de rituales AM / PM.', tipo: 'texto', porDefecto: 'Elegir mi ritual' },
  { clave: 'home.banner.foto', grupo: 'banner', etiqueta: 'Foto de fondo', ayuda: 'Horizontal, ancha. El texto se lee en blanco encima, así que conviene una foto no muy clara.', tipo: 'imagen', porDefecto: '' },

  // ---- Pie de página
  { clave: 'pie.titulo', grupo: 'pie', etiqueta: 'Título del newsletter', tipo: 'texto', porDefecto: 'Sumate al Club de la Pausa Consciente' },
  { clave: 'pie.bajada', grupo: 'pie', etiqueta: 'Texto del newsletter', tipo: 'largo', porDefecto: 'Una carta cada quince días. Sin spam: te podés dar de baja cuando quieras.' },
  { clave: 'pie.boton', grupo: 'pie', etiqueta: 'Texto del botón', tipo: 'texto', porDefecto: 'Suscribirme' },
  {
    clave: 'pie.legal',
    grupo: 'pie',
    etiqueta: 'Aviso legal',
    tipo: 'largo',
    porDefecto:
      'Los productos comercializados son alimentos y suplementos dietarios. No son medicamentos y no reemplazan una alimentación variada ni el consejo de un profesional de la salud. Ante cualquier duda, consultá con tu médico o nutricionista.',
  },
  { clave: 'pie.copyright', grupo: 'pie', etiqueta: 'Línea de derechos', tipo: 'texto', porDefecto: '© 2026 SACRED Wellness Club' },
  { clave: 'pie.linea', grupo: 'pie', etiqueta: 'Línea de la derecha', tipo: 'texto', porDefecto: 'Términos · Privacidad · Botón de arrepentimiento · Defensa al consumidor' },

  // ---- Ficha de producto
  { clave: 'ficha.opciones.titulo', grupo: 'ficha', etiqueta: 'Caja de compra — encabezado', tipo: 'texto', porDefecto: 'Pago por transferencia -15%' },
  { clave: 'ficha.opciones.1', grupo: 'ficha', etiqueta: 'Caja de compra — punto 1', ayuda: MARCAS, tipo: 'texto', porDefecto: '15% de descuento pagando por transferencia' },
  { clave: 'ficha.opciones.2', grupo: 'ficha', etiqueta: 'Caja de compra — punto 2', tipo: 'texto', porDefecto: 'Reparto propio en la zona los viernes' },
  { clave: 'ficha.opciones.3', grupo: 'ficha', etiqueta: 'Caja de compra — punto 3', ayuda: MARCAS, tipo: 'texto', porDefecto: 'Envío sin cargo desde {envioGratis} en tu zona' },
  { clave: 'ficha.confianza.1', grupo: 'ficha', etiqueta: 'Ícono del camión', tipo: 'texto', porDefecto: 'Envíos a todo el país' },
  { clave: 'ficha.confianza.2', grupo: 'ficha', etiqueta: 'Ícono de la tarjeta', tipo: 'texto', porDefecto: 'Pagás por transferencia' },
  { clave: 'ficha.confianza.3', grupo: 'ficha', etiqueta: 'Ícono de cambios', ayuda: 'Lleva a la página «Cambios y devoluciones».', tipo: 'texto', porDefecto: 'Cambios y devoluciones' },
  { clave: 'ficha.combinalo', grupo: 'ficha', etiqueta: 'Título de los combos sugeridos', tipo: 'texto', porDefecto: 'Combinalo con' },
  { clave: 'ficha.misma-linea', grupo: 'ficha', etiqueta: 'Título de productos de la misma línea', tipo: 'texto', porDefecto: 'De la misma línea' },
  { clave: 'ficha.pocas-unidades', grupo: 'ficha', etiqueta: 'Aviso de poco stock', ayuda: 'Aparece cuando quedan pocas unidades del producto.', tipo: 'texto', porDefecto: 'Quedan pocas unidades' },

  // ---- Combos
  { clave: 'combos.titulo', grupo: 'combos', etiqueta: 'Lista de combos — título', tipo: 'texto', porDefecto: 'Combos Sinérgicos' },
  {
    clave: 'combos.intro',
    grupo: 'combos',
    etiqueta: 'Lista de combos — texto',
    tipo: 'largo',
    porDefecto:
      'Propuestas de combinaciones alquímicas de productos para potenciar resultados nutricionales y sensoriales. Cuando dos o tres alimentos se consumen juntos, la absorción y el efecto bioactivo se multiplican, eso es la sinergia.',
  },
  { clave: 'combo.porque', grupo: 'combos', etiqueta: 'Página del combo — título de «por qué se potencian»', tipo: 'texto', porDefecto: 'Por qué se potencian' },
  { clave: 'combo.envio', grupo: 'combos', etiqueta: 'Página del combo — nota de envío', ayuda: MARCAS, tipo: 'texto', porDefecto: 'Reparto en zona los viernes · Envío sin cargo desde {envioGratis}' },
  { clave: 'combo.piezas', grupo: 'combos', etiqueta: 'Página del combo — título de las piezas', tipo: 'texto', porDefecto: 'Cada pieza, con su propia ficha' },

  // ---- Rituales
  { clave: 'rituales.titulo', grupo: 'rituales', etiqueta: 'Selector — título', tipo: 'texto', porDefecto: 'Elegí tu ritual' },
  {
    clave: 'rituales.intro',
    grupo: 'rituales',
    etiqueta: 'Selector — texto',
    tipo: 'largo',
    porDefecto:
      'Diseñada para acompañar la curva biológica del día: desde el encendido consciente de la mañana hasta el descanso restaurador de la noche.',
  },
  { clave: 'ritual.am.titulo', grupo: 'rituales', etiqueta: 'Ritual AM — título', tipo: 'texto', porDefecto: 'RITUAL AM: Encendido, Claridad & Vitalidad Celular' },
  {
    clave: 'ritual.am.texto',
    grupo: 'rituales',
    etiqueta: 'Ritual AM — texto',
    tipo: 'largo',
    porDefecto:
      'El arte del despertar consciente. Fórmulas botánicas y minerales diseñados para activar la hidratación de tus glándulas, encender la mente y nutrir el cuerpo con energía limpia y sin agitación.',
  },
  { clave: 'ritual.pm.titulo', grupo: 'rituales', etiqueta: 'Ritual PM — título', tipo: 'texto', porDefecto: 'RITUAL PM: Desconexión, Calma & Restauración Nocturna' },
  {
    clave: 'ritual.pm.texto',
    grupo: 'rituales',
    etiqueta: 'Ritual PM — texto',
    tipo: 'largo',
    porDefecto:
      'El arte de desacelerar. Medicinas botánicas, plantas adaptógenas y tónicos tibios formulados para indicarle a tu sistema nervioso que es momento de soltar, bajar el cortisol y retornar al centro.',
  },

  // ---- Carrito
  { clave: 'carrito.vacio', grupo: 'carrito', etiqueta: 'Carrito vacío', tipo: 'texto', porDefecto: 'Todavía no agregaste nada. Es un buen momento para armar tu ritual.' },
  {
    clave: 'carrito.falta',
    grupo: 'carrito',
    etiqueta: 'Aviso de lo que falta para el envío gratis',
    ayuda: 'Escribí {falta} donde va el monto que le falta a la persona.',
    tipo: 'texto',
    porDefecto: 'Te faltan {falta} para el envío sin cargo en tu zona.',
  },
  { clave: 'carrito.listo', grupo: 'carrito', etiqueta: 'Aviso cuando ya llegó al envío gratis', tipo: 'texto', porDefecto: 'Listo: tu envío en zona es sin cargo.' },
  { clave: 'carrito.sugeridos', grupo: 'carrito', etiqueta: 'Título de las sugerencias', tipo: 'texto', porDefecto: 'Completalo con' },

  // ---- Finalizar compra
  {
    clave: 'checkout.entrega',
    grupo: 'checkout',
    etiqueta: 'Aviso en «Entrega»',
    tipo: 'largo',
    porDefecto: 'Envío a domicilio — reparto propio en zona los viernes, o Correo Argentino/Andreani fuera de zona.',
  },
  {
    clave: 'checkout.fuera-de-zona',
    grupo: 'checkout',
    etiqueta: 'Aviso para quien vive fuera de la zona',
    tipo: 'largo',
    porDefecto:
      'Fuera de la zona de reparto propio despachamos por Correo Argentino o Andreani. El costo se cotiza por código postal y te lo confirmamos por email antes de coordinar el pago.',
  },
  { clave: 'checkout.pago', grupo: 'checkout', etiqueta: 'Aviso en «Pago»', tipo: 'largo', porDefecto: 'Transferencia bancaria — te enviamos los datos por email o WhatsApp para coordinarlo.' },
  {
    clave: 'checkout.pago-nota',
    grupo: 'checkout',
    etiqueta: 'Segundo aviso en «Pago»',
    tipo: 'largo',
    porDefecto: 'El pago se confirma a mano una vez que lo recibimos — tu pedido queda «Pendiente de pago» hasta entonces.',
  },

  // ---- Envíos (valores que también usa el servidor para cobrar)
  { clave: 'envio.gratisDesde', grupo: 'envio', etiqueta: 'Envío sin cargo desde (en pesos)', ayuda: 'Si la compra llega a este monto, el reparto en zona no se cobra.', tipo: 'numero', porDefecto: '60000' },
  { clave: 'envio.costoZona', grupo: 'envio', etiqueta: 'Costo del reparto en zona (en pesos)', ayuda: 'Se cobra cuando la compra no llega al monto de envío gratis.', tipo: 'numero', porDefecto: '3500' },
  { clave: 'envio.barrios', grupo: 'envio', etiqueta: 'Barrios de la zona de reparto', ayuda: 'Uno por renglón. Es la lista que se ofrece al finalizar la compra.', tipo: 'lista', porDefecto: 'Canning\nEzeiza\nSan Vicente' },

  // ---- Datos para transferir
  { clave: 'pago.titular', grupo: 'pago', etiqueta: 'Titular de la cuenta', tipo: 'texto', porDefecto: '' },
  { clave: 'pago.banco', grupo: 'pago', etiqueta: 'Banco', tipo: 'texto', porDefecto: '' },
  { clave: 'pago.cbu', grupo: 'pago', etiqueta: 'CBU / CVU', tipo: 'texto', porDefecto: '' },
  { clave: 'pago.alias', grupo: 'pago', etiqueta: 'Alias', tipo: 'texto', porDefecto: '' },
  { clave: 'pago.cuit', grupo: 'pago', etiqueta: 'CUIT / CUIL', tipo: 'texto', porDefecto: '' },
  {
    clave: 'pago.instrucciones',
    grupo: 'pago',
    etiqueta: 'Instrucciones después de transferir',
    ayuda: 'Por ejemplo, a dónde mandar el comprobante.',
    tipo: 'largo',
    porDefecto: '',
  },
];

export const CAMPO_POR_CLAVE = new Map(CAMPOS.map((c) => [c.clave, c]));

// ---------------------------------------------------------------------------
// Páginas de texto (Nuestro Origen, Envíos, Preguntas frecuentes, legales…)
// El cuerpo se escribe en un formato simple (ver web/components/Prosa.tsx):
//   ## Subtítulo · ### Pregunta · - lista · > cita · **negrita** · ==resaltado== · [texto](/link)
// ---------------------------------------------------------------------------

export interface PaginaRegistro {
  slug: string;
  titulo: string;
  cuerpo: string;
  /** Dónde se ve en el sitio (para el enlace «Ver en el sitio» del admin). */
  ruta: string;
}

export const PAGINAS: PaginaRegistro[] = [
  {
    slug: 'nuestro-origen',
    ruta: '/nuestro-origen',
    titulo: 'Nuestro Origen',
    cuerpo: [
      'No nos propusimos crear una marca más de productos naturales.',
      '> ¿Cómo podemos hacer de ==un simple momento una experiencia== de bienestar profunda, ==que forme parte de la vida cotidiana== ==sin== esfuerzo?',
      'Esta pregunta surgió tras años de buscar respuestas en el ritmo acelerado de la vida moderna, donde nos acostumbramos a vivir corriendo tras la siguiente taza de café industrial, agotados y sobreestimulados al mismo tiempo. Sabíamos que ese no era el camino hacia la plenitud ni hacia la presencia.',
      'Decidimos volver al origen. Comenzamos a buscar ingredientes puros, sin maltodextrinas, sin endulzantes artificiales y sin procesos que apaguen nuestra fuerza biológica.',
      'Nacimos para compartir la energía transformadora de la nutrición ancestral y el biohacking consciente. Creemos que cada taza, cada cucharada y cada pausa es una oportunidad para recordar quién sos y regalarte un rito sagrado de autocuidado.',
    ].join('\n\n'),
  },
  {
    slug: 'envios',
    ruta: '/envios',
    titulo: 'Envíos y entregas',
    cuerpo: [
      '## Reparto propio en zona — todos los viernes',
      'Recorremos la zona barrio por barrio, todos los viernes. Superando el mínimo de compra, el envío corre por nuestra cuenta. Si estás fuera del radio, despachamos a todo el país.',
      [
        '- Envío sin cargo superando {envioGratis} de compra.',
        '- Por debajo del mínimo, costo fijo de reparto.',
        '- Elegís tu barrio de una lista cerrada al finalizar la compra.',
        '- Corte de pedidos: miércoles 23:59 (propuesta) para entrar en el reparto del viernes. Un pedido posterior pasa al viernes siguiente.',
        '- Te avisamos por correo o WhatsApp el jueves, confirmando que tu pedido sale al día siguiente.',
      ].join('\n'),
      '## Fuera de zona — resto del país',
      'Despachamos a todo el país por Correo Argentino y Andreani. Cotización automática por código postal. Envío sin cargo a partir de un monto mayor, a definir.',
      'Te enviamos el número de seguimiento por correo al despachar.',
    ].join('\n\n'),
  },
  {
    slug: 'preguntas-frecuentes',
    ruta: '/preguntas-frecuentes',
    titulo: 'Preguntas frecuentes',
    cuerpo: [
      '### ¿Cómo se calcula el envío?',
      'En la zona de reparto propio, entregamos los viernes y el envío es sin cargo superando {envioGratis}. Fuera de zona, despachamos por Correo Argentino o Andreani con cotización por código postal.',
      '### ¿Qué medios de pago aceptan?',
      'Por ahora, transferencia bancaria. Al finalizar tu pedido te mostramos los datos para pagar y lo confirmamos a mano apenas recibimos el pago.',
      '### ¿Puedo devolver un producto si no me convenció?',
      'Sí, tenés 10 días corridos desde que lo recibís para arrepentirte de la compra sin dar motivo — usá el [botón de arrepentimiento](/boton-de-arrepentimiento).',
    ].join('\n\n'),
  },
  {
    slug: 'contacto',
    ruta: '/contacto',
    titulo: 'Contacto',
    cuerpo: 'Muy pronto vas a encontrar acá nuestros canales de contacto.',
  },
  {
    slug: 'cambios-y-devoluciones',
    ruta: '/cambios-y-devoluciones',
    titulo: 'Cambios y devoluciones',
    cuerpo:
      'Estamos definiendo los plazos y el procedimiento de cambios y devoluciones.\n\nSi querés arrepentirte de una compra, usá el [botón de arrepentimiento](/boton-de-arrepentimiento): cubre la revocación dentro de los primeros 10 días por ley, sin necesidad de dar un motivo.',
  },
  {
    slug: 'terminos-y-condiciones',
    ruta: '/terminos-y-condiciones',
    titulo: 'Términos y condiciones',
    cuerpo: 'Estamos terminando de redactar este texto. Muy pronto vas a encontrar acá los términos y condiciones de compra.',
  },
  {
    slug: 'politica-de-privacidad',
    ruta: '/politica-de-privacidad',
    titulo: 'Política de privacidad',
    cuerpo: 'Estamos terminando de redactar este texto. Muy pronto vas a encontrar acá nuestra política de privacidad y cómo cuidamos tus datos personales.',
  },
  {
    slug: 'boton-de-arrepentimiento',
    ruta: '/boton-de-arrepentimiento',
    titulo: 'Botón de arrepentimiento',
    cuerpo: [
      'Como consumidor tenés derecho a revocar tu compra dentro de los **10 días corridos** desde que la recibiste, sin necesidad de dar ningún motivo y sin que se te exija registro previo ni ningún trámite adicional. Este derecho está garantizado por la Ley 24.240 de Defensa del Consumidor.',
      '## Cómo ejercer tu derecho de arrepentimiento',
      'Completá el formulario con el número de tu pedido y contanos qué querés devolver. Te contactamos para coordinar la devolución.',
    ].join('\n\n'),
  },
];

export const PAGINA_POR_SLUG = new Map(PAGINAS.map((p) => [p.slug, p]));
