/**
 * Catálogo completo (17 productos + 8 combos reales del brief §5.8/§5.9),
 * copy aprobado, sin editar salvo el de los combos (propuesta pendiente de
 * validación de la marca, `copyAprobado: false`). Único consumidor: seed.ts
 * — movido junto con el resto de prisma/ cuando el backend pasó a NestJS
 * (ver Registro del proyecto en el vault de Obsidian).
 *
 * Precio, stock y formato son MOCK — el brief los deja como "definiciones
 * pendientes" (§7) del lado de la marca.
 */

export type LineaSlug =
  | "foco-vitalidad"
  | "longevidad-glow"
  | "salud-intestinal"
  | "calma-alquimica";

export type RitualModo = "am" | "pm";

export interface FormulaItem {
  ingrediente: string;
  texto: string;
}

export interface SeedProducto {
  slug: string;
  nombre: string;
  formulaSubtitulo?: string;
  linea: LineaSlug;
  ritual: RitualModo[];
  orden: number;
  momentoSugerido?: string;
  descripcion: string;
  laFormula?: FormulaItem[];
  beneficios: string[];
  ritualDeUso: string;
  ingredientes?: string;
  notaDePureza?: string;
  origen?: string;
  precio: number;
  formato: string;
  stock: number;
  destacado?: string;
  nombrePendiente?: boolean;
}

export interface SeedCombo {
  slug: string;
  nombre: string;
  bajada: string;
  productos: string[];
  porQueSePotencian: string;
  ritual: RitualModo[];
  precio: number;
  stock: number;
  copyAprobado: boolean;
}

export const PRODUCTOS: SeedProducto[] = [
  // ── FOCO & VITALIDAD (6) ──────────────────────────────────────
  {
    slug: "mct-liquido",
    nombre: "MCT Líquido",
    formulaSubtitulo: "Good Bless You",
    linea: "foco-vitalidad",
    ritual: ["am"],
    orden: 1,
    momentoSugerido: "Café matutino / ventana de ayuno",
    descripcion: "Aceite dorado purificado de triglicéridos C8 y C10, grasas saludables de absorción ultra rápida. Al ser 100% lípido, aporta mayor concentración de grasa por gramo. Ideal para personas experimentadas en dietas cetogénicas con un tracto digestivo muy fuerte. Es la herramienta definitiva para potenciar ventanas de ayuno, nutrir las membranas celulares y activar cetonas limpias.",
    beneficios: [
      "Combustible mitocondrial inmediato que no se almacena como grasa.",
      "Favorece la saciedad: ayuda a controlar los antojos y prolonga la sensación de plenitud.",
      "Protege la estabilidad de la glucosa en sangre y el balance hormonal.",
      "Ideal para optimizar dietas keto o potenciar el ayuno consciente.",
    ],
    ritualDeUso: "Mezclar de 1 cdita. a 1 cucharada en tu café matutino (bulletproof), infusiones, aderezos, ensaladas ó tomarlo solo directo con cuchara. Se recomienda aumentar la dosis de forma gradual según preferencia.",
    ingredientes: "100% triglicéridos de cadena media (MCT) C8 derivados de aceite de coco puro prensado. Sin aditivos artificiales.",
    precio: 29900,
    formato: "PENDIENTE",
    stock: 16,
  },
  {
    slug: "mct-en-polvo",
    nombre: "MCT en Polvo",
    formulaSubtitulo: "Leguilab",
    linea: "foco-vitalidad",
    ritual: ["am"],
    orden: 2,
    momentoSugerido: "Desayuno o media mañana",
    descripcion: "Este formato en polvo es un suplemento altamente versátil y de fácil digestión, ideal para potenciar la energía física y la claridad mental sin la pesadez estomacal. Aporta sedosidad y cremosidad natural a las preparaciones. Cuenta con el más alto nivel de certificación en calidad y pureza, procedente de Alemania. Además cuenta con certificado Sin T.A.C.C., garantizando un producto seguro para celíacos.",
    beneficios: [
      "Disipa la neblina mental y enciende la agudeza cognitiva en minutos.",
      "Favorece la saciedad: ayuda a controlar los antojos y prolonga la sensación de plenitud.",
      "Mayor tolerancia digestiva: el formato en polvo es significativamente más amable y delicado con la mucosa intestinal que el aceite MCT tradicional.",
      "Acción prebiótica adicional: la goma de acacia es una fibra prebiótica que no sólo aporta MCTs, sino que alimenta la microbiota intestinal.",
      "Ideal para llevar de viaje sin riesgos de derrames.",
    ],
    ritualDeUso: "Agregar 1 cucharadita a tu infusión caliente, licuados, bowls. Se recomienda aumentar la dosis en forma gradual según preferencia.",
    ingredientes: "100% triglicéridos de cadena media (MCT) C8 y goma acacia (Fibra natural de origen vegetal). No incluye maltodextrina ni aditivos artificiales.",
    precio: 27800,
    formato: "PENDIENTE",
    stock: 25,
  },
  {
    slug: "matcha-premium",
    nombre: "Matcha Premium",
    linea: "foco-vitalidad",
    ritual: ["am"],
    orden: 3,
    momentoSugerido: "Media mañana",
    descripcion: "Polvo finamente molido hecho de hojas de té verde que ha trascendido sus raíces tradicionales para convertirse en un fenómeno global. El matcha es considerado una medicina que calma el diálogo interno mientras despierta la mente a un estado de presencia plena y energía sostenida. No es casualidad que los monjes budistas llevasen siglos usando el té matcha para meditar durante horas sin quedarse dormidos ni dispersarse. Reconocido por su vibrante tono verde y sabor terroso, ofrece una alternativa única y saludable al café regular para quienes buscan energía sin los efectos secundarios del café: más cafeína que un té verde convencional, pero menos que una taza de café filtrado.",
    beneficios: [
      "Concentración y energía, sin la taquicardia o los nervios que puede provocar el exceso de café.",
      "La L-Teanina actúa sobre los neurotransmisores del cerebro: reduce la ansiedad, incrementa la producción de ondas alfa en el cerebro asociadas al estado de relajación y modula la absorción de cafeína.",
      "Desintoxica el organismo mediante su alta concentración de clorofila pura.",
      "Aumenta el metabolismo y proporciona energía limpia durante horas.",
    ],
    ritualDeUso: "Colocar 2-3 g. e infusionar en un poquito de agua caliente, temperatura ideal de 75-80 °C. Batir en forma de W preferentemente con un batidor de bambú hasta crear una espuma cremosa. Completar con tu leche vegetal preferida ó agua. Sumar endulzante y aceite de coco MCT para potenciarlo.",
    ingredientes: "Polvo de hojas jóvenes molidas en piedra 100% puro, cultivadas a la sombra, recolectado directo del origen: Shizuoka, Japón. No lleva azúcares, lácteos ni aditivos.",
    origen: "Shizuoka, Japón",
    precio: 32400,
    formato: "PENDIENTE",
    stock: 20,
    destacado: "Más vendido",
  },
  {
    slug: "blend-acai-maca-andina",
    nombre: "Blend Açaí + Maca Andina",
    linea: "foco-vitalidad",
    ritual: ["am"],
    orden: 4,
    momentoSugerido: "Desayuno, en batido o bowl",
    descripcion: "El encuentro sagrado entre la fuerza de la cordillera andina y la vitalidad de la selva amazónica. Una sinergia adaptógena creada para equilibrar los ritmos hormonales, encender la libido y sostener la energía sin agotar tus reservas.",
    beneficios: [
      "Modula el equilibrio endocrino y alivia la fatiga física y mental.",
      "Aumenta la resistencia, la vitalidad y el tono vital de forma natural.",
      "Aporta una recarga densa de minerales esenciales y antioxidantes oscuros.",
    ],
    ritualDeUso: "Añadir 1 cucharada a tus batidos matutinos, tazones de yogur o porridges de avena para arrancar el día en sintonía.",
    ingredientes: "Açaí en polvo 100% puro (obtenido por liofilización en frío) y raíz de Maca Andina en polvo. Sin azúcares añadidos, aditivos, saborizantes sintéticos ni rellenos.",
    precio: 26900,
    formato: "PENDIENTE",
    stock: 21,
  },
  {
    slug: "cacao-en-pasta-ecuador",
    nombre: "Cacao en Pasta Orgánico de Ecuador",
    linea: "foco-vitalidad",
    ritual: ["am", "pm"],
    orden: 10,
    momentoSugerido: "Ceremonia de la mañana o de la noche",
    descripcion: "Medicina del corazón en su estado más ancestral, puro y magnético. Cacao 100% nativo procesado a baja temperatura para preservar su manteca vegetal natural, sus aceites esenciales, teobromina y la energía viva de la tierra.",
    beneficios: [
      "Es el principal alimento conocido por estimular la liberación de la “molécula del bliss”: anandamina y serotonina.",
      "Abre el chakra del corazón y mejora la circulación sanguínea cerebral.",
      "Fuente profunda de magnesio biodisponible para relajar la musculatura y el sistema nervioso.",
      "Foco, creatividad y bienestar integral.",
    ],
    ritualDeUso: "Rallar ó picar de 10-20 g, disolver en agua ó leche vegetal muy caliente sin hervir y batir con devoción para una bebida ceremonial. Podés endulzar a gusto y sumar aceite de coco MCT para potenciar su sabor y beneficios.",
    ingredientes: "100% granos de cacao entero (mantenimiento integral de su manteca de cacao natural) tostado y molido, de la variedad Arriba Nacional - Ecuador, famoso por su fino aroma. Sin azúcar · Sin aditivos · Sin alcalinizar.",
    precio: 23400,
    formato: "PENDIENTE",
    stock: 27,
  },
  {
    slug: "sal-marina-en-escamas",
    nombre: "Sal Marina en Escamas de la Patagonia",
    linea: "foco-vitalidad",
    ritual: ["am", "pm"],
    orden: 11,
    momentoSugerido: "Transversal",
    descripcion: "Cristales puros nacidos de la fuerza salvaje del Océano Atlántico patagónico. Escamas de sal marina no refinada, secadas por el sol y el viento del sur, cargadas de electrolitos vivos y minerales traza para restaurar la conductividad eléctrica de tu cuerpo y encender una hidratación celular profunda.",
    beneficios: [
      "Sostiene la salud de las glándulas suprarrenales (adrenales), ayudando a moderar la fatiga y el estrés.",
      "Aporta un espectro completo de minerales biodisponibles (magnesio, potasio, calcio y oligoelementos) para una hidratación real a nivel celular.",
      "Cero procesos químicos, lavados industriales o antiaglomerantes; pureza viva y crujiente de origen patagónico.",
    ],
    ritualDeUso: "Disolver una pizca en tu agua matutina con limón para activar el cuerpo (Adrenal Water), o espolvorear sobre tostadas de palta, chocolates rituales, elixires y platillos para elevar su sabor y densidad nutricional.",
    ingredientes: "Cristales de sal marina natural obtenidos por la evaporación controlada del agua del mar patagónico. Sin aditivos químicos ni tratamientos industriales de refinamiento.",
    origen: "Patagonia, Argentina",
    precio: 9800,
    formato: "PENDIENTE",
    stock: 40,
  },

  // ── LONGEVIDAD & GLOW (4) ─────────────────────────────────────
  {
    slug: "blend-piel",
    nombre: "Blend Piel",
    formulaSubtitulo: "Cacao + Tremella + Schisandra + Amalaki",
    linea: "longevidad-glow",
    ritual: ["am"],
    orden: 5,
    momentoSugerido: "Desayuno, en leche vegetal tibia o café",
    descripcion: "Una pócima de belleza ancestral que despierta la hidratación profunda de tu piel. Esta mezcla combina adaptógenos, superalimentos y antioxidantes formulados principalmente para promover la salud cutánea, estimular la producción de colágeno y proteger las células contra el daño oxidativo.",
    laFormula: [
      { ingrediente: "Cacao", texto: "Rico en flavonoides (antioxidantes), mejora la circulación sanguínea hacia la piel, optimizando la hidratación y aportando firmeza y luminosidad natural." },
      { ingrediente: "Tremella (Hongo de la nieve)", texto: "Actúa como un ácido hialurónico vegetal. Retiene hasta 500 veces su peso en agua, proporcionando hidratación profunda y mejorando la elasticidad de la piel." },
      { ingrediente: "Schisandra", texto: "Baya adaptógena que ayuda al cuerpo a gestionar el estrés (un factor clave en el envejecimiento prematuro y brotes). Mantiene la barrera de humedad de la piel y unifica el tono." },
      { ingrediente: "Amalaki (Grosella espinosa india)", texto: "Una de las fuentes naturales más concentradas de vitamina C. Es esencial para la síntesis de colágeno, combate los radicales libres y previene las manchas." },
    ],
    beneficios: [
      "Estimula la producción natural de colágeno y elastina.",
      "Aporta una concentración excepcional de antioxidantes que combaten el envejecimiento prematuro.",
      "Protege y regenera el tejido cutáneo frente al estrés ambiental.",
    ],
    ritualDeUso: "Integrar 1 cucharada en tu leche vegetal tibia, smoothie o taza de café matutina. Podés añadir una cdita. de endulzante y de aceite de coco MCT para potenciar.",
    precio: 32900,
    formato: "PENDIENTE",
    stock: 18,
  },
  {
    slug: "blend-colageno-hibiscus",
    nombre: "Blend Colágeno Bovino + Extracto de Hibiscus",
    linea: "longevidad-glow",
    ritual: ["am", "pm"],
    orden: 9,
    momentoSugerido: "Desayuno o después de cenar. Sin cafeína",
    descripcion: "Elixir rosado de juventud eterna, combinando una fuente concentrada de proteínas estructurales con potentes antioxidantes.",
    laFormula: [
      { ingrediente: "Colágeno Bovino", texto: "aporta los aminoácidos esenciales (como glicina, prolina e hidroxiprolina) necesarios para reparar la matriz de la piel, mejorar la firmeza cutánea, fortalecer uñas y cabello, y mantener la salud articular." },
      { ingrediente: "Extracto de Hibiscus", texto: "proviene exclusivamente de la flor entera liofilizada, un proceso de deshidratación en frío que preserva intacta la estructura celular, el color radiante y los principios activos de la planta." },
    ],
    beneficios: [
      "Mejora la elasticidad, firmeza y densidad de la piel.",
      "Fortalece el crecimiento de uñas y hebras capilares desde la raíz.",
      "La vitamina C natural del Hibiscus potencia la síntesis propia de colágeno en el cuerpo.",
    ],
    ritualDeUso: "Primero se debe hidratar en frío, disolviendo 1 cucharada en agua/jugo y dejar reposar de 3 a 5 minutos para que la gelatina absorba el líquido y “florezca” (se hinche). Luego agregar agua caliente (sin necesidad de que hierva, a unos 60-70 °C) y revolver vigorosamente hasta que el polvo se disuelva por completo.",
    ingredientes: "gelatina origen bovino ultra pureza, de sabor y aroma totalmente neutros: procesada para eliminar cualquier olor o residuo característico de origen animal, combinada únicamente con flor de hibiscus liofilizada real, sin perfumantes ni enmascaradores sintéticos.",
    notaDePureza: "Es normal que al finalizar la bebida observemos un ligero sedimento en el fondo. Corresponde a las micropartículas de la flor de hibiscus liofilizada que conserva toda su riqueza botánica sin agregados químicos para forzar una solubilidad artificial. Revolvé antes de tomar y disfrutá de un ingrediente 100% real.",
    precio: 41200,
    formato: "PENDIENTE",
    stock: 22,
  },
  {
    slug: "petalos-de-rosas",
    nombre: "Pétalos de Rosas",
    linea: "longevidad-glow",
    ritual: ["am", "pm"],
    orden: 12,
    momentoSugerido: "Transversal, como topping",
    descripcion: "La medicina del corazón y de la belleza botánica atemporal. Pétalos enteros cosechados para infundir gracia, aroma y delicadeza antioxidante a tus pociones diarias, suavizando el espíritu y embelleciendo cada taza.",
    beneficios: [
      "Aportan polifenoles protectores que ayudan a calmar la inflamación celular.",
      "Eleva el estado de ánimo con su aromaterapia natural y sutil.",
      "Agrega una dimensión estética y sagrada a cualquier bebida o platillo.",
    ],
    ritualDeUso: "Espolvorear generosamente como topping sobre lattes, bowls de frutas, tés o baños de vapor faciales.",
    precio: 14800,
    formato: "PENDIENTE",
    stock: 30,
  },
  {
    slug: "hojicha",
    nombre: "Hojicha",
    linea: "longevidad-glow",
    ritual: ["pm"],
    orden: 14,
    momentoSugerido: "Media tarde o después de comer",
    descripcion: "Té verde japonés tostado único que se destaca por su tueste artesanal a altas temperaturas. Este proceso caramaliza sus azúcares naturales, eliminando el amargor y la astringencia, y aportándole su característico color marrón rojizo que invitan a una pausa reparadora sin alterar tu energía.",
    beneficios: [
      "Aporta antioxidantes (como las catequinas) y L-teanina, promoviendo un estado de calma mental y relajación sin generar somnolencia.",
      "Bajo contenido de cafeína y taninos: esto lo convierte en un té extremadamente suave para el sistema digestivo, ideal incluso para personas sensibles a los estimulantes.",
      "Restaura la calma mental e infunde una sensación de confort inmediato.",
    ],
    ritualDeUso: "A diferencia de otros tés verdes sensibles que requieren agua tibia, el Hojicha soporta temperaturas más elevadas gracias a su tueste. Utilizá agua entre 85-90° C. con 1,5-2 g. de Hojicha (aprox. 1 cucharadita de té al ras o la medida de un cuchara chashaku de bambú) batiendo de 2 a 3 minutos. Podés consumirlo infusionado en agua ó leche vegetal para crear un suave y cremoso Hojicha Latte. Sumar endulzante y aceite de coco MCT para potenciarlo.",
    ingredientes: "Polvo de hojas jóvenes 100% puro, secado al vapor y tostado suavemente en recipientes de porcelana, recolectado directo del origen: Aichi, Japón. No lleva azúcares, lácteos ni aditivos.",
    origen: "Aichi, Japón",
    precio: 21500,
    formato: "PENDIENTE",
    stock: 15,
  },

  // ── SALUD INTESTINAL & MICROBIOTA SAGRADA (5) ────────────────
  {
    slug: "blend-mate-rose-ritual",
    nombre: "Blend para Mate – ROSE RITUAL",
    linea: "salud-intestinal",
    ritual: ["am", "pm"],
    orden: 7,
    momentoSugerido: "Mateada de la mañana o la tarde",
    descripcion: "Un abrazo aromático para el rito diario del mate. Las láminas suaves de coco y la delicadeza de las rosas visten la yerba mate, transformando la cebada en un rito aromático, sedoso y amable con tu estómago.",
    beneficios: [
      "Suaviza la acidez y la agresividad de la yerba en la mucosa gástrica.",
      "Las grasas saludables del coco brindan una sensación de saciedad y calma.",
      "Convierte la mateada en una pausa meditativa y aromática.",
    ],
    ritualDeUso: "Agregar una cucharadita directamente sobre la yerba mate antes de verter el agua tibia.",
    ingredientes: "Coco en Escamas, Pétalos de Rosa.",
    precio: 17900,
    formato: "PENDIENTE",
    stock: 24,
  },
  {
    slug: "blend-mate-cacao-rosa-mosqueta",
    nombre: "Blend para Mate – [nombre pendiente]",
    nombrePendiente: true,
    linea: "salud-intestinal",
    ritual: ["am", "pm"],
    orden: 8,
    momentoSugerido: "Mateada de la mañana o la tarde",
    descripcion: "Una alquimia terrenal y silvestre. Las notas calientes del cacao fusionadas con el toque cítrico de la rosa mosqueta enriquecen tu mate con virtudes digestivas y un aroma abrigador.",
    beneficios: [
      "Protege la digestión y previene la hinchazón abdominal durante la cebada.",
      "Aporta una dosis sutil de vitamina C y bioflavonoides antioxidantes.",
      "Perfuma la yerba mate con un matiz achocolatado irresistible.",
    ],
    ritualDeUso: "Añadir 1 ó 2 cditas. sobre la yerba antes de comenzar a cebar.",
    ingredientes: "Cascarillas de Cacao y Rosa Mosqueta.",
    precio: 17900,
    formato: "PENDIENTE",
    stock: 24,
  },
  {
    slug: "miel-maple-syrup",
    nombre: "Miel Maple Syrup",
    formulaSubtitulo: "Origen Canadá",
    linea: "salud-intestinal",
    ritual: ["am", "pm"],
    orden: 13,
    momentoSugerido: "Transversal, como endulzante",
    descripcion: "El néctar dorado extraído del corazón de los bosques silvestres de Canadá. Un endulzante botánico puro que conserva la memoria mineral de la tierra y un sabor acaramelado inolvidable.",
    beneficios: [
      "Alternativa de bajo índice glucémico rica en antioxidantes naturales.",
      "Contiene minerales traza como manganeso, potasio y zinc.",
      "Nutre los sentidos sin inflamar ni sobrecargar el hígado.",
    ],
    ritualDeUso: "Rociar sobre pancakes, bowls de avenas/granolas, utilizar en repostería consciente ó para armonizar el amargor de infusiones.",
    ingredientes: "100% pura savia natural del árbol de arce concentrada por calor. No contiene agua, azúcar agregada ni conservantes.",
    origen: "Canadá",
    precio: 18900,
    formato: "PENDIENTE",
    stock: 28,
  },
  {
    slug: "nibs-de-cacao",
    nombre: "Nibs de Cacao",
    linea: "salud-intestinal",
    ritual: ["am"],
    orden: 6,
    momentoSugerido: "Topping del desayuno",
    descripcion: "Pequeñas gemas de cacao puro tostado y troceado. Un topping crujiente e intenso con notas amargas que recuerdan el origen primigenio del alimento de los dioses.",
    beneficios: [
      "Concentración masiva de polifenoles digestivos y protectores.",
      "Alto contenido de fibra, magnesio, antioxidantes y grasas saludables.",
      "Estimula la producción de enzimas digestivas.",
    ],
    ritualDeUso: "Como topping sobre tazones de avena/granolas, smoothies, chía puddings, frutas ó directamente consumir tipo snack.",
    ingredientes: "Granos de cacao fermentados, tostados, descascarillados y picados en pequeños trozos puros (virutas).",
    precio: 19800,
    formato: "PENDIENTE",
    stock: 33,
    destacado: "Repuesto",
  },
  {
    slug: "semillas-de-cacao",
    nombre: "Semillas de Cacao",
    linea: "salud-intestinal",
    ritual: ["pm"],
    orden: 17,
    momentoSugerido: "Snack de media tarde",
    descripcion: "El grano sagrado en su forma más salvaje y crujiente. Se encuentran dentro de la mazorca del cacao, se fermentan para desarrollar su sabor y luego se dejan secar al sol. Son una cápsula de fuerza vegetal repleta de magnesio, antioxidantes y fibra pura para despertar el intestino y los sentidos.",
    beneficios: [
      "Potente alimento prebiótico que favorece la diversidad intestinal.",
      "Satisface el deseo de texturas crocantes aportando energía pura.",
      "Ayuda a regular el tránsito intestinal de manera natural.",
    ],
    ritualDeUso: "Tostar y pelar su cáscara suavemente con los dedos. Consumir como snack ó trocear sobre fruta fresca y postres.",
    ingredientes: "Granos enteros y crudos del fruto del cacao (Theobroma) con su cáscara.",
    precio: 16900,
    formato: "PENDIENTE",
    stock: 26,
  },

  // ── CALMA ALQUÍMICA & CORTISOL (2) ────────────────────────────
  {
    slug: "blend-calma",
    nombre: "Blend Calma",
    linea: "calma-alquimica",
    ritual: ["pm"],
    orden: 16,
    momentoSugerido: "Última hora, antes de dormir",
    descripcion: "Una pócima sagrada para desarmar el estrés del día y suavizar las aristas de la mente, bajar las revoluciones y envolver tu ser en un manto de serenidad profunda.",
    laFormula: [
      { ingrediente: "Cacao", texto: "Aporta una base rica en magnesio y teobromina, favoreciendo la producción de serotonina y dopamina para elevar el estado de ánimo de forma suave y reconfortante." },
      { ingrediente: "Reishi (Hongo de la longevidad)", texto: "Adaptógeno maestro que calma el sistema nervioso central, reduce la irritabilidad mental y fortalece la inmunidad, preparando el cuerpo para un descanso reparador." },
      { ingrediente: "Ashwagandha", texto: "Disminuye de forma directa los niveles de cortisol (la hormona del estrés), aliviando la fatiga suprarrenal, la ansiedad y la tensión física acumulada." },
      { ingrediente: "Rhodiola", texto: "mejora la resiliencia frente a la sobrecarga emocional o el agotamiento diario." },
      { ingrediente: "Pétalos de Rosa", texto: "Aportan una sutil nota floral y compuestos antioxidantes que suavizan el perfil aromático de las raíces y brindan un toque reconfortante al ritual." },
    ],
    beneficios: [
      "Regula el sistema nervioso y ayuda a disipar la ansiedad acumulada.",
      "Prepara el cuerpo para un descanso reparador y un sueño de alta calidad.",
      "Equilibra la respuesta del organismo ante las exigencias emocionales y físicas.",
    ],
    ritualDeUso: "Disolver 1 cucharada en una taza con agua caliente o leche vegetal (almendras, avena o coco). Mezclar vigorosamente o usar un espumador hasta lograr una bebida espumosa y tibia.",
    ingredientes: "Cacao, Reishi, Ashwagandha, Rhodiola, Pétalos de Rosa.",
    precio: 35600,
    formato: "PENDIENTE",
    stock: 12,
  },
  {
    slug: "blend-golden-milk",
    nombre: "Blend Golden Milk",
    linea: "calma-alquimica",
    ritual: ["pm"],
    orden: 15,
    momentoSugerido: "Ceremonia de la tarde o de la noche",
    descripcion: "Inspirada en la milenaria tradición ayurvédica, nuestra Golden Milk es un elixir reconfortante, antiinflamatorio y digestivo diseñado para restaurar el equilibrio diario. Combinamos cúrcuma orgánica de máxima calidad con especias nobles y la sedosidad de la leche de coco sin caseína, logrando una bebida cremosa, equilibrada y profundamente restauradora. Formulado sin pimienta negra (apto para estómagos sensibles): a diferencia de las mezclas comerciales tradicionales, excluimos intencionalmente la pimienta negra de nuestra receta pensando en personas con colon irritable, gastritis o alta sensibilidad digestiva y mucosa intestinal.",
    beneficios: [
      "Cúrcuma Orgánica: potente antiinflamatorio y antioxidante que apoya la salud articular, la inmunidad y el bienestar general.",
      "Jengibre Orgánico & Cardamomo: estimulan la digestión, disminuyen la hinchazón abdominal y aportan una calidez aromática única.",
      "Leche de Coco (sin caseína): aporta la fracción grasa saludable (MCTs) necesaria para favorecer la absorción natural de los fitonutrientes de las especias.",
      "Canela & Lúcuma: ayudan a regular los picos de glucosa en sangre.",
    ],
    ritualDeUso: "Mezclar 1 cucharadita en agua bien caliente (sin hervir). Emulsionar durante unos segundos hasta obtener una textura dorada y cremosa. Para un latte más denso, emulsionar con una leche vegetal. Puede añadirse endulzante, un toque de pimienta y aceite de coco MCT para potenciar su alquimia.",
    ingredientes: "Cúrcuma orgánica, Jengibre orgánico, leche de coco sin caseína, canela, lúcuma, cardamomo.",
    precio: 28900,
    formato: "PENDIENTE",
    stock: 19,
    destacado: "Nuevo",
  },
];

export const COMBOS: SeedCombo[] = [
  // ── Los cuatro de lanzamiento ──────────────────────────────
  {
    slug: "el-despertar",
    nombre: "El Despertar",
    bajada: "Encender el día sin sobresaltos.",
    productos: ["matcha-premium", "mct-en-polvo", "sal-marina-en-escamas"],
    porQueSePotencian: "La pizca de sal marina en el agua de la mañana repone los electrolitos que el cuerpo perdió durante la noche y sostiene a las glándulas suprarrenales antes de que aparezca cualquier estímulo. El MCT en polvo aporta la fracción grasa que hace que la cafeína del matcha se libere de a poco, en lugar de golpear de una vez. Y la L-teanina del matcha ordena ese estímulo: foco largo, sin taquicardia y sin la caída de media mañana. Los tres juntos hacen algo que ninguno hace solo: energía sostenida durante horas.",
    ritual: ["am"],
    precio: 62900,
    stock: 9,
    copyAprobado: false,
  },
  {
    slug: "el-descenso",
    nombre: "El Descenso",
    bajada: "El camino de vuelta al centro, después de las siete de la tarde.",
    productos: ["blend-golden-milk", "blend-calma", "miel-maple-syrup"],
    porQueSePotencian: "La Golden Milk trabaja primero, sobre la digestión y la inflamación de la cena: la grasa de la leche de coco es lo que permite que la curcumina se absorba de verdad, y la canela y la lúcuma amortiguan el pico de glucosa. Una hora más tarde entra el Blend Calma, con ashwagandha y reishi bajando el cortisol para que el sueño llegue solo, sin forzarlo. El maple endulza a los dos sin volver a levantar la glucemia. No es una bebida: es una secuencia.",
    ritual: ["pm"],
    precio: 74900,
    stock: 7,
    copyAprobado: false,
  },
  {
    slug: "glow",
    nombre: "Glow",
    bajada: "Colágeno, y todo lo que el colágeno necesita para funcionar.",
    productos: ["blend-piel", "blend-colageno-hibiscus", "petalos-de-rosas"],
    porQueSePotencian: "Tomar colágeno sin vitamina C es darle ladrillos al cuerpo sin darle el albañil: la vitamina C es el cofactor obligatorio de su síntesis. Acá llega por dos vías, el hibiscus del blend rosado y el amalaki del Blend Piel, una de las fuentes naturales más concentradas que existen. La tremella hidrata desde adentro como un ácido hialurónico vegetal y la schisandra sostiene el eje del estrés, que es el factor que más envejece la piel. Los pétalos de rosa cierran el ritual.",
    ritual: ["am", "pm"],
    precio: 79900,
    stock: 6,
    copyAprobado: false,
  },
  {
    slug: "ceremonia-de-cacao",
    nombre: "Ceremonia de Cacao",
    bajada: "El cacao completo: bebida, textura y mineral.",
    productos: ["cacao-en-pasta-ecuador", "nibs-de-cacao", "sal-marina-en-escamas"],
    porQueSePotencian: "El cacao en pasta es la bebida, entera y sin alcalinizar, con su manteca intacta. Los nibs suman la fibra y el crujido que la pasta no tiene. Y una escama de sal marina sobre la taza no es decoración: la sal suprime la percepción del amargor y hace que el cacao sepa más a cacao. Es el recurso que usan los chocolateros, acá con minerales vivos adentro.",
    ritual: ["am", "pm"],
    precio: 54900,
    stock: 11,
    copyAprobado: false,
  },
  // ── Los cuatro de segunda tanda ────────────────────────────
  {
    slug: "segundo-cerebro",
    nombre: "Segundo Cerebro",
    bajada: "Fibra prebiótica y polifenoles, que es la única combinación que la microbiota aprovecha.",
    productos: ["mct-en-polvo", "nibs-de-cacao", "semillas-de-cacao"],
    porQueSePotencian: "Los polifenoles del cacao no se absorben en el intestino delgado: llegan enteros al colon, y ahí las bacterias los transforman en los compuestos que el cuerpo sí puede usar. Para hacer ese trabajo, esas bacterias necesitan fibra. La goma de acacia del MCT en polvo es exactamente esa fibra prebiótica; los nibs y las semillas aportan los polifenoles y el volumen. Uno sin el otro se desaprovecha.",
    ritual: ["am", "pm"],
    precio: 58900,
    stock: 10,
    copyAprobado: false,
  },
  {
    slug: "la-mateada-sagrada",
    nombre: "La Mateada Sagrada",
    bajada: "Dos formas de vestir la yerba. Una para el ánimo de la mañana, otra para el de la tarde.",
    productos: ["blend-mate-rose-ritual", "blend-mate-cacao-rosa-mosqueta"],
    porQueSePotencian: "Los dos blends resuelven el mismo problema —la agresividad de la yerba sobre la mucosa gástrica— por caminos distintos. Rose Ritual lo hace con la grasa del coco y la delicadeza de la rosa. El de cascarilla de cacao y rosa mosqueta, con notas tostadas y un aporte de vitamina C. Tener los dos es poder elegir el carácter de la mateada sin cambiar el mate.",
    ritual: ["am", "pm"],
    precio: 32900,
    stock: 14,
    copyAprobado: false,
  },
  {
    slug: "la-pausa-de-la-tarde",
    nombre: "La Pausa de la Tarde",
    bajada: "El puente entre el día y la noche.",
    productos: ["hojicha", "petalos-de-rosas", "miel-maple-syrup"],
    porQueSePotencian: "El hojicha es el único té de la casa que se puede tomar a las seis de la tarde sin pagarlo a la madrugada: el tueste baja la cafeína y los taninos y deja la L-teanina, que es la que calma sin dar sueño. Los pétalos de rosa suman aromaterapia real sobre la taza, y el maple redondea el tueste sin picos de glucosa. Es la transición, no el final.",
    ritual: ["pm"],
    precio: 48900,
    stock: 13,
    copyAprobado: false,
  },
  {
    slug: "raiz-y-fuego",
    nombre: "Raíz y Fuego",
    bajada: "La cordillera y la selva, en la misma taza.",
    productos: ["blend-acai-maca-andina", "cacao-en-pasta-ecuador", "miel-maple-syrup"],
    porQueSePotencian: "La maca trabaja sobre el eje endocrino de forma acumulativa y silenciosa: se nota a las tres semanas. El cacao aporta el magnesio y la teobromina que levantan el ánimo el mismo día en que los tomás. Juntos cubren las dos velocidades, la que se siente hoy y la que se construye. El maple hace que sea un placer sostenerlo todos los días, que es la única forma de que un adaptógeno haga efecto.",
    ritual: ["am"],
    precio: 61900,
    stock: 8,
    copyAprobado: false,
  },
];
