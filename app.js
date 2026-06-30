// Álbum Matemático Virtual con sincronización a Google Sheets vía Apps Script
// ------------------------------------------------------------------------
// Antes de usar:
// 1) Reemplaza API_URL con la URL del Web App de Apps Script.
// 2) Ajusta las rutas de imágenes dentro de la carpeta /images.
// 3) Si agregas páginas, replica el formato del arreglo PAGES.
//
// Formato de imágenes de láminas:
//   images/laminas/<archivo>.webp
//   Ejemplo: images/laminas/001_nacimiento_numero.webp
//
// Insignias y niveles:
//   images/insignias/<id>.png
//   images/niveles/<rol>.png

const API_URL = "https://script.google.com/macros/s/AKfycbzRRT0lChcz8-lFbcgQ_MVrJ8JkMokNJM0l_PcREjOwFT9gx4KY2IAsW8MfAjy3Os7H/exec";
 

const STUDENTS = {
  "89B-01-EMILYN": "Álvarez Ballesteros Emilyn Natalia",
  "89B-02-VALERIA": "Álvarez Guerra Valeria Alejandra",
  "89B-03-MARIANGEL": "Álvarez Sotomayor Mariángel",
  "89B-04-CALEB": "Angulo Dominguez Caleb",
  "89B-05-ANTHONY": "Araque Bedoya Anthony",
  "89B-06-SIMON": "Arboleda Palacio Simón",
  "89B-07-DIEGO": "Benavides Paniagua Diego Alejandro",
  "89B-08-FELIPE": "Blandón Samuel Felipe",
  "89B-09-MELANY": "Bracamonte Tabares Melany Andrea",
  "89B-10-CAMILA": "Cadavid Montoya María Camila",
  "89B-11-YARA": "Diaz Pamplona Yara Nicole",
  "89B-12-MATIAS": "Echavarría Arias Matías",
  "89B-13-JHOSUA": "Fernández Herrera Jhosua",
  "89B-14-PAULA": "Gil Domicó Paula Andrea",
  "89B-15-SEBASTIAN": "Giraldo Mejía Juan Sebastián",
  "89B-16-CHARICK": "Giraldo Villada Charick Lorena",
  "89B-17-MELISA": "Gómez Urrego Melisa",
  "89B-18-LINA": "González Cuervo Lina Stefany",
  "89B-19-SOFIA": "Hurtado Villa Sofía",
  "89B-20-SALOME": "Londoño Arenas Salomé",
  "89B-21-SAMUEL": "Mejía Marulanda Samuel David",
  "89B-22-VALENTINA": "Piza Herrera Valentina",
  "89B-23-DEIBY": "Ramírez Ramírez Deiby Alexander",
  "89B-24-JEILER": "Ríos Duque Jeiler Adrián",
  "89B-25-HEIDYS": "Ríos Martínez Heidys",
  "89B-26-CAMILA2": "Rondón Quiñones Camila Alejandra",
  "89B-27-LUCIANA": "Sierra Zapata Luciana",
  "89B-28-SOFIA2": "Úsuga Mazo Sofía",
  "89B-29-LUISA": "Velasquez Berrio Luisa Fernanda",
  "89B-30-SALOME2": "Velásquez Londoño Salomé",
  "89B-31-MARIANA": "Villada Villa Mariana"
};

function laminaNumber(pageNumber, slotIndex) {
  return String((pageNumber - 1) * 6 + slotIndex + 1).padStart(3, "0");
}

function stubCards(pageNumber) {
  return Array.from({ length: 6 }, (_, i) => ({
    number: laminaNumber(pageNumber, i),
    title: "Próximamente",
    legend: "Esta lámina se activará cuando tu docente publique los códigos correspondientes.",
    image: "",
    unlockCodes: [],
    comingSoon: true
  }));
}

// Prefijos VAL-XXX-NN según el nombre de cada página (XXX = iniciales del tema)
const PAGE_VALIDATION_PREFIX = {
  1: "CON",  // Los Primeros Contadores
  2: "MUN",  // El Mundo de los Números
  3: "POD",  // Los Cuatro Poderes
  4: "GUA",  // Los Guardianes del Cálculo
  5: "PAR",  // Las Partes del Todo
  6: "DEC",  // El Reino de los Decimales
  7: "FOR",  // El Reino de las Formas
  8: "ESP",  // Constructores del Espacio
  9: "MED",  // Maestros de la Medición
  10: "MET", // El Gran Sistema Métrico
  11: "DAT", // Cazadores de Datos
  12: "DES", // Descifrando Información
  13: "LEN", // El Lenguaje Secreto
  14: "MAQ", // Máquinas de Resolver Problemas
  15: "UNI", // El Mapa del Universo
  16: "MOV", // Matemáticas en Movimiento
  17: "PIO", // Los Pioneros del Pensamiento
  18: "GEN", // Genios que Cambiaron el Mundo
  19: "COL", // Ciencia en Colombia
  20: "MCA"  // Los Maestros Colombianos
};

function teacherValidationCode(number) {
  const prefix = PAGE_VALIDATION_PREFIX[number] || "PAG";
  return `VAL-${prefix}-${String(number).padStart(2, "0")}`;
}

function stubPage(key, number, name, color, description) {
  return {
    key,
    number,
    name,
    menuTitle: `Pág. ${number}`,
    description: description || "Contenido en preparación. Pronto estarán disponibles las láminas de esta página.",
    teacherValidationCode: teacherValidationCode(number),
    color,
    comingSoon: true,
    cards: stubCards(number)
  };
}

function formatPageLabel(page) {
  if (!page) return "Página";
  if (page.number && page.name) return `Página ${page.number} · ${page.name}`;
  return page.menuTitle || page.name || "Página";
}

function getActivePages() {
  return PAGES.filter((page) => !page.comingSoon);
}

const LAMINA_IMAGES_DIR = "images/laminas";

function laminaImagePath(file) {
  return `${LAMINA_IMAGES_DIR}/${file}`;
}

// Reservado para el tema Mixtos (próximamente). No activo en el álbum aún.
const LAMINA_MIXTOS = {
  title: "Lamina Mixtos",
  unlockCodes: [
    "MIX-X9Q7-4K2",
    "MIX-B7L2-Z9P",
    "MIX-R3T8-1VX",
    "MIX-Q6M4-W2A",
    "MIX-Z8P1-K7D"
  ]
};

// Metadatos oficiales de láminas (Documento Maestro — vista ampliada)
const LAMINA_DETAIL = {
  "001": {
    shortDesc: "Los primeros seres humanos aprendieron a contar cantidades.",
    laminaType: "Historia Matemática",
    relatedApp: "Contemos",
    curiosity: "Las primeras formas de conteo utilizaban piedras y marcas sobre huesos.",
    relatedLaminas: ["002", "007"]
  },
  "002": {
    shortDesc: "¿Por qué contamos de diez en diez? Nuestros dedos nos dieron la pista.",
    laminaType: "Sistemas Numéricos",
    relatedApp: "Romanos Kids",
    curiosity: "El sistema decimal es el más usado en el mundo por nuestra forma de contar con los dedos.",
    relatedLaminas: ["001", "003"]
  },
  "003": {
    shortDesc: "Los romanos escribían números con letras en monumentos y relojes.",
    laminaType: "Sistemas Numéricos",
    relatedApp: "Romanos Kids",
    curiosity: "Aún hoy ves números romanos en relojes, libros y edificios antiguos.",
    relatedLaminas: ["002", "004"]
  },
  "004": {
    shortDesc: "Los egipcios registraban cosechas e impuestos con símbolos grabados.",
    laminaType: "Historia Matemática",
    relatedApp: "Sistemas Antiguos",
    curiosity: "Cada símbolo egipcio representaba una potencia de diez.",
    relatedLaminas: ["003", "005"]
  },
  "005": {
    shortDesc: "Con puntos y barras, los mayas representaban cantidades enormes.",
    laminaType: "Historia Matemática",
    relatedApp: "Sistemas Antiguos",
    curiosity: "Los mayas estudiaban el cielo usando un sistema numérico muy avanzado.",
    relatedLaminas: ["004", "006"]
  },
  "006": {
    shortDesc: "Solo dos símbolos, 0 y 1, mueven la tecnología de hoy.",
    laminaType: "Matemática Moderna",
    relatedApp: "Código Binario",
    curiosity: "Computadores, celulares y videojuegos hablan el lenguaje binario.",
    relatedLaminas: ["005", "007"]
  },
  "007": {
    shortDesc: "Son los números con los que contamos objetos, pasos y estrellas.",
    laminaType: "Conjuntos Numéricos",
    relatedApp: "Contemos",
    curiosity: "Los naturales son el primer gran conjunto que aprendemos en la escuela.",
    relatedLaminas: ["001", "008"]
  },
  "008": {
    shortDesc: "Un número pequeño que cambió para siempre la forma de calcular.",
    laminaType: "Conjuntos Numéricos",
    relatedApp: "Números Enteros",
    curiosity: "El número que representa la nada terminó cambiando el mundo entero.",
    relatedLaminas: ["007", "009"]
  },
  "009": {
    shortDesc: "Los negativos representan deudas, frío bajo cero y profundidades.",
    laminaType: "Conjuntos Numéricos",
    relatedApp: "Números Enteros",
    curiosity: "Los enteros amplían el conteo hacia atrás, más allá del cero.",
    relatedLaminas: ["008", "010"]
  },
  "010": {
    shortDesc: "Una idea sin fin: siempre puede existir un número aún mayor.",
    laminaType: "Conceptos Matemáticos",
    relatedApp: "Números Enteros, Recta Numérica",
    curiosity: "No existe el número más grande porque siempre es posible construir uno mayor.",
    relatedLaminas: ["009", "011"]
  },
  "011": {
    shortDesc: "Números que se escriben como fracción, como media pizza o tres cuartos.",
    laminaType: "Conjuntos Numéricos",
    relatedApp: "Mixtora",
    curiosity: "Un racional puede verse como fracción o como número decimal.",
    relatedLaminas: ["010", "012"]
  },
  "012": {
    shortDesc: "Una línea donde cada punto representa un número ordenado.",
    laminaType: "Representación",
    relatedApp: "Recta Numérica",
    curiosity: "A la derecha del cero van los positivos y a la izquierda los negativos.",
    relatedLaminas: ["009", "011"]
  }
};

const PAGES = [
  {
    key: "mixtos",
    number: 1,
    name: "Los Primeros Contadores",
    menuTitle: "Pág. 1",
    description: "De dónde surgió el conteo y cómo distintas culturas —y la tecnología— inventaron formas de escribir cantidades.",
    teacherValidationCode: teacherValidationCode(1),
    color: "#7c5cff",
    cards: [
      { id: "001", number: "001", title: "El Nacimiento del Número", file: "001_nacimiento_numero.webp", image: laminaImagePath("001_nacimiento_numero.webp"), legend: "Hace miles de años no existían los números. Los primeros seres humanos contaban piedras, animales y días para organizar su vida. Así comenzó una de las mayores aventuras de la humanidad.", unlockCodes: [
        "NAC-X9Q7-4K2", "NAC-B7L2-Z9P", "NAC-R3T8-1VX", "NAC-Q6M4-W2A", "NAC-Z8P1-K7D"
      ] },
      { id: "002", number: "002", title: "Sistema Decimal", file: "002_sistema_decimal.webp", image: laminaImagePath("002_sistema_decimal.webp"), legend: "¿Por qué contamos de diez en diez? Nuestros diez dedos inspiraron el sistema decimal, una poderosa herramienta que hoy utiliza casi todo el mundo para representar cantidades enormes.", unlockCodes: [
        "SDE-Y7D2-8QK", "SDE-K3P9-X5T", "SDE-V8A4-R2M", "SDE-N6Z1-W7L", "SDE-P4T8-3XB"
      ] },
      { id: "003", number: "003", title: "Numeración Romana", file: "003_numeracion_romana.webp", image: laminaImagePath("003_numeracion_romana.webp"), legend: "Los antiguos romanos construyeron caminos, acueductos y ciudades usando letras para representar números. Aún hoy podemos encontrarlos en relojes, monumentos y libros.", unlockCodes: [
        "ROM-Q873-V2P", "ROM-M4T7-K9A", "ROM-B9X1-R6D", "ROM-T3P8-W5N", "ROM-L7K2-Y4Q"
      ] },
      { id: "004", number: "004", title: "Numeración Egipcia", file: "004_numeracion_egipcia.webp", image: laminaImagePath("004_numeracion_egipcia.webp"), legend: "Mucho antes de las calculadoras, los egipcios registraban cosechas, impuestos y construcciones utilizando símbolos grabados en papiros y monumentos.", unlockCodes: [
        "EGI-D7Q1-L9X", "EGI-P8M3-R2K", "EGI-Y4T9-A6V", "EGI-K2X8-N7D", "EGI-W9R5-Z1P"
      ] },
      { id: "005", number: "005", title: "Numeración Maya", file: "005_numeracion_maya.webp", image: laminaImagePath("005_numeracion_maya.webp"), legend: "Los mayas desarrollaron uno de los sistemas numéricos más sorprendentes de la antigüedad. Con puntos y barras podían representar cantidades enormes y estudiar el movimiento de los astros.", unlockCodes: [
        "MAY-T9X2-Q4M", "MAY-A3K8-L7P", "MAY-M6R1-V9D", "MAY-Q2P7-X5Z", "MAY-K8D4-N3T"
      ] },
      { id: "006", number: "006", title: "Numeración Binaria", file: "006_numeracion_binaria.webp", image: laminaImagePath("006_numeracion_binaria.webp"), legend: "Aunque solo utiliza dos símbolos, 0 y 1, el sistema binario es el lenguaje secreto de computadores, celulares, videojuegos y gran parte de la tecnología moderna.", unlockCodes: [
        "BIN-79X4-P7K", "BIN-K2R8-M5Q", "BIN-T7L3-X9D", "BIN-P6A1-VBN", "BIN-X4Q9-K2M"
      ] }
    ]
  },

  {
    key: "enteros",
    number: 2,
    name: "El Mundo de los Números",
    menuTitle: "Pág. 2",
    description: "Los conjuntos numéricos que ampliaron el conteo: naturales, cero, enteros, infinito y las herramientas para ordenarlos.",
    teacherValidationCode: teacherValidationCode(2),
    color: "#35d4ff",
    cards: [
      { id: "007", number: "007", title: "Números Naturales", file: "007_numeros_naturales.webp", image: laminaImagePath("007_numeros_naturales.webp"), legend: "Son los números que usamos para contar y ordenar el mundo que nos rodea. Desde los primeros pasos de un niño hasta las estrellas visibles en el cielo, siempre están presentes.", unlockCodes: [
        "NAT-X7K2-9QP", "NAT-B4M8-R2L", "NAT-Z9A1-W3X", "NAT-T5Q7-K8N", "NAT-P2V6-L4D"
      ] },
      { id: "008", number: "008", title: "El Cero", file: "008_el_cero.webp", image: laminaImagePath("008_el_cero.webp"), legend: "Parece un número sencillo, pero su invención cambió la historia. Gracias al cero podemos escribir números grandes, realizar cálculos complejos y desarrollar la matemática moderna.\n\nCuriosidad: «El número que representa la nada terminó cambiando el mundo entero.»", unlockCodes: [
        "CER-A9K3-2LM", "CER-D1P8-X7Q", "CER-R2W6-5NB", "CER-K8T1-Z3V", "CER-Y7L4-M9C"
      ] },
      { id: "009", number: "009", title: "Números Enteros", file: "009_numeros_enteros.webp", image: laminaImagePath("009_numeros_enteros.webp"), legend: "Cuando los números naturales ya no fueron suficientes, aparecieron los números negativos. Ellos permiten representar temperaturas bajo cero, deudas, profundidades y muchos fenómenos de la vida cotidiana.", unlockCodes: [
        "NEN-V3Q8-1ZT", "NEN-L9K2-7MP", "NEN-X5N4-2RW", "NEN-T1B7-9QC", "NEN-M6R3-K8A"
      ] },
      { id: "010", number: "010", title: "El Infinito", file: "010_el_infinito.webp", image: laminaImagePath("010_el_infinito.webp"), legend: "El infinito no es un número, sino una idea matemática que representa algo que no tiene fin. Por más grande que sea un número, siempre puede existir otro mayor.\n\nCuriosidad: No existe el número más grande porque siempre es posible construir uno mayor.", unlockCodes: [
        "INF-E7K3-9XP", "INF-R5M2-4LQ", "INF-B9T6-1ZW", "INF-Y3N8-7RC", "INF-H2P4-X5M"
      ] },
      { id: "011", number: "011", title: "Números Racionales", file: "011_numeros_racionales.webp", image: laminaImagePath("011_numeros_racionales.webp"), legend: "Son los números que se pueden escribir como fracción: ½, ¾, 0,5 o −2. Sirven para medir partes de algo, como media pizza o tres cuartos de litro.", unlockCodes: [
        "RAC-G8K2-4ZR", "RAC-T3M9-1WP", "RAC-L5X6-7QB", "RAC-R9P2-3NK", "RAC-W1C8-6XM"
      ] },
      { id: "012", number: "012", title: "La Recta Numérica", file: "012_recta_numerica.webp", image: laminaImagePath("012_recta_numerica.webp"), legend: "Es una línea donde cada punto es un número. El 0 está al centro: a la derecha van los positivos y a la izquierda los negativos.", unlockCodes: [
        "REC-A8T2-C7R", "REC-K4M9-P3W", "REC-B7N2-X5L", "REC-T6Q1-R8J", "REC-H3V5-Z9D"
      ] }
    ]
  },

  stubPage("cuatro-poderes", 3, "Los Cuatro Poderes", "#f59e42"),
  stubPage("guardianes-calculo", 4, "Los Guardianes del Cálculo", "#f59e42"),

  {
    key: "fracciones",
    number: 5,
    name: "Las Partes del Todo",
    menuTitle: "Pág. 5",
    description: "Las fracciones permiten representar partes de un todo. Aprende a operar con ellas y resuelve desafíos cada vez más complejos.",
    teacherValidationCode: teacherValidationCode(5),
    color: "#3ee28a",
    cards: [
      { number: "025", title: "Fracciones equivalentes", legend: "Dos fracciones son equivalentes si representan la misma cantidad. Multiplica o divide numerador y denominador por el mismo número.", image: "images/fracciones/1.png", unlockCodes: [] },
      { number: "026", title: "Suma de fracciones", legend: "Para sumar fracciones con diferente denominador, primero encuentra el MCM (mínimo común múltiplo) de los denominadores.", image: "images/fracciones/2.png", unlockCodes: [] },
      { number: "027", title: "Resta de fracciones", legend: "La resta de fracciones sigue el mismo proceso que la suma: busca un denominador común y resta los numeradores.", image: "images/fracciones/3.png", unlockCodes: [] },
      { number: "028", title: "Multiplicación", legend: "Para multiplicar fracciones: multiplica numerador por numerador y denominador por denominador. ¡No necesitas igual denominador!", image: "images/fracciones/4.png", unlockCodes: [] },
      { number: "029", title: "División de fracciones", legend: "Para dividir fracciones, multiplica por la fracción invertida (inverso multiplicativo). Ej: (2/3) ÷ (4/5) = (2/3) × (5/4).", image: "images/fracciones/5.png", unlockCodes: [] },
      { number: "030", title: "Reto final", legend: "Resuelve: (3/4) × (2/5) + (1/2) ÷ (3/5). ¡Sigue el orden de operaciones! Primero multiplica y divide, luego suma.", image: "images/fracciones/6.png", unlockCodes: [] }
    ]
  },

  stubPage("decimales", 6, "El Reino de los Decimales", "#3ee28a"),
  stubPage("formas", 7, "El Reino de las Formas", "#e879f9"),
  stubPage("espacio", 8, "Constructores del Espacio", "#e879f9"),
  stubPage("medicion", 9, "Maestros de la Medición", "#35d4ff"),
  stubPage("metrico", 10, "El Gran Sistema Métrico", "#35d4ff"),
  stubPage("cazadores-datos", 11, "Cazadores de Datos", "#7c5cff"),
  stubPage("descifrando", 12, "Descifrando Información", "#7c5cff"),
  stubPage("lenguaje-secreto", 13, "El Lenguaje Secreto", "#f472b6"),
  stubPage("maquinas-problemas", 14, "Máquinas de Resolver Problemas", "#f472b6"),
  stubPage("mapa-universo", 15, "El Mapa del Universo", "#fbbf24"),
  stubPage("matematicas-movimiento", 16, "Matemáticas en Movimiento", "#fbbf24"),
  stubPage("pioneros", 17, "Los Pioneros del Pensamiento", "#a78bfa"),
  stubPage("genios", 18, "Genios que Cambiaron el Mundo", "#a78bfa"),
  stubPage("ciencia-colombia", 19, "Ciencia en Colombia", "#34d399"),
  stubPage("maestros-colombianos", 20, "Los Maestros Colombianos", "#34d399")
];

// Álbum Matemático Universal — secciones, insignias y niveles
// Documento Maestro v1.0
const SECTIONS = [
  {
    id: "numeros",
    roman: "I",
    title: "El Reino de los Números",
    description: "Antes de aprender a sumar, restar o resolver ecuaciones, la humanidad tuvo que inventar los números. Descubriremos cómo surgió el conteo, cómo diferentes civilizaciones representaron cantidades y cómo aparecieron ideas tan importantes como el cero, los números negativos y el infinito.",
    badge: { id: "caldas", name: "Caldas", image: "images/insignias/caldas.png" },
    pageKeys: ["mixtos", "enteros"]
  },
  {
    id: "operaciones",
    roman: "II",
    title: "Los Secretos de las Operaciones",
    description: "Los números por sí solos no bastan. Aquí aprenderemos las herramientas que permiten resolver problemas, construir estrategias y realizar cálculos.",
    badge: { id: "garavito", name: "Garavito", image: "images/insignias/garavito.png" },
    pageKeys: ["cuatro-poderes", "guardianes-calculo"]
  },
  {
    id: "fracciones",
    roman: "III",
    title: "El Imperio de las Fracciones",
    description: "Las fracciones permiten representar partes de un todo. Desde repartir una pizza hasta calcular descuentos, esta sección muestra cómo expresar cantidades no enteras.",
    badge: { id: "policarpa", name: "Policarpa", image: "images/insignias/policarpa.png" },
    pageKeys: ["fracciones", "decimales"]
  },
  {
    id: "geometria",
    roman: "IV",
    title: "La Tierra de la Geometría",
    description: "Las formas están presentes en la naturaleza, el arte y la arquitectura. Esta sección explora figuras, cuerpos y relaciones espaciales.",
    badge: { id: "botero", name: "Botero", image: "images/insignias/botero.png" },
    pageKeys: ["formas", "espacio"]
  },
  {
    id: "medida",
    roman: "V",
    title: "Los Exploradores de la Medida",
    description: "Medir es comparar. Gracias a las medidas podemos conocer tamaños, distancias, masas, tiempos y muchas otras características del mundo.",
    badge: { id: "codazzi", name: "Codazzi", image: "images/insignias/codazzi.png" },
    pageKeys: ["medicion", "metrico"]
  },
  {
    id: "datos",
    roman: "VI",
    title: "El Laboratorio de los Datos",
    description: "Los datos cuentan historias. En esta sección aprenderemos a recolectar, organizar y analizar información.",
    badge: { id: "vasco", name: "Vasco", image: "images/insignias/vasco.png" },
    pageKeys: ["cazadores-datos", "descifrando"]
  },
  {
    id: "algebra",
    roman: "VII",
    title: "El Reino del Álgebra",
    description: "El álgebra permite descubrir patrones y resolver problemas mediante símbolos y expresiones matemáticas.",
    badge: { id: "euler", name: "Euler", image: "images/insignias/euler.png" },
    pageKeys: ["lenguaje-secreto", "maquinas-problemas"]
  },
  {
    id: "universo",
    roman: "VIII",
    title: "Matemáticas del Universo",
    description: "Las matemáticas nos ayudan a comprender el movimiento de los planetas, las estrellas y muchos fenómenos de la naturaleza.",
    badge: { id: "newton", name: "Newton", image: "images/insignias/newton.png" },
    pageKeys: ["mapa-universo", "matematicas-movimiento"]
  },
  {
    id: "grandes",
    roman: "IX",
    title: "Grandes Matemáticos",
    description: "Detrás de cada descubrimiento matemático hubo personas curiosas que cambiaron la forma de entender el mundo.",
    badge: { id: "pitagoras", name: "Pitágoras", image: "images/insignias/pitagoras.png" },
    pageKeys: ["pioneros", "genios"]
  },
  {
    id: "colombia",
    roman: "X",
    title: "Matemáticas de Colombia",
    description: "Colombia también ha aportado científicos, educadores, ingenieros y pensadores que han contribuido al desarrollo del conocimiento.",
    badge: { id: "mutis", name: "Mutis", image: "images/insignias/mutis.png" },
    pageKeys: ["ciencia-colombia", "maestros-colombianos"]
  }
];

const BADGE_LORE = {
  caldas: {
    description: "Francisco José de Caldas fue uno de los grandes científicos colombianos.",
    mathConnection: "La observación y la medición son el primer paso para comprender el mundo."
  },
  garavito: {
    description: "Jorge Eliécer Gaitán Garavito dedicó su vida al estudio del cielo y los cálculos astronómicos.",
    mathConnection: "Las operaciones precisas permiten resolver problemas complejos paso a paso."
  },
  policarpa: {
    description: "Policarpa Salavarrieta representa la valentía y la estrategia en la historia colombiana.",
    mathConnection: "Las fracciones nos ayudan a repartir, comparar y tomar decisiones justas."
  },
  botero: {
    description: "Fernando Botero mostró al mundo la belleza de las formas ampliadas y las proporciones.",
    mathConnection: "La geometría estudia figuras, tamaños y relaciones en el espacio."
  },
  codazzi: {
    description: "Agustín Codazzi fue un ingeniero y geógrafo clave en la cartografía de Colombia.",
    mathConnection: "Medir con exactitud es fundamental para conocer y describir el territorio."
  },
  vasco: {
    description: "José Celestino Mutis formó generaciones de naturalistas; Vasco representa la exploración científica.",
    mathConnection: "Los datos organizados revelan patrones que no se ven a simple vista."
  },
  euler: {
    description: "Leonhard Euler fue uno de los matemáticos más prolíficos de la historia.",
    mathConnection: "El álgebra usa símbolos para expresar relaciones y resolver problemas."
  },
  newton: {
    description: "Isaac Newton explicó el movimiento de los cuerpos y las leyes que rigen el universo.",
    mathConnection: "Las matemáticas describen el movimiento de planetas, caídas y fenómenos naturales."
  },
  pitagoras: {
    description: "Pitágoras y su escuela exploraron números, música y las relaciones del universo.",
    mathConnection: "Detrás de cada descubrimiento matemático hay curiosidad y pensamiento profundo."
  },
  mutis: {
    description: "José Celestino Mutis lideró la Expedición Botánica y el estudio científico en Colombia.",
    mathConnection: "Colombia ha aportado saberes que enriquecen la educación matemática del país."
  }
};

const ACHIEVEMENTS_CATALOG = [
  { id: "first_unlock", title: "Primer Desbloqueo", desc: "Desbloquea tu primera lámina" },
  { id: "page_complete", title: "Página Completa", desc: "Completa todas las láminas de una página" },
  { id: "first_badge", title: "Primera Insignia", desc: "Obtén tu primera insignia de sección" },
  { id: "guardian_numeros", title: "Guardián de los Números", desc: "Completa la Sección I" },
  { id: "operations_adept", title: "Aprendiz de Operaciones", desc: "Completa la Sección II" },
  { id: "fraction_hero", title: "Héroe de las Fracciones", desc: "Completa la Sección III" },
  { id: "geometry_explorer", title: "Explorador Geométrico", desc: "Completa la Sección IV" },
  { id: "measure_expert", title: "Experto en Medida", desc: "Completa la Sección V" },
  { id: "data_hunter", title: "Cazador de Datos", desc: "Completa la Sección VI" },
  { id: "algebra_voice", title: "Voz del Álgebra", desc: "Completa la Sección VII" },
  { id: "universe_mapper", title: "Cartógrafo del Universo", desc: "Completa la Sección VIII" },
  { id: "great_thinker", title: "Gran Pensador", desc: "Completa la Sección IX" },
  { id: "colombia_pride", title: "Orgullo Colombiano", desc: "Completa la Sección X" },
  { id: "time_traveler", title: "Viajero del Tiempo", desc: "Desbloquea las 6 láminas de la Página 1" },
  { id: "number_world", title: "Mundo de los Números", desc: "Desbloquea las 6 láminas de la Página 2" },
  { id: "note_taker", title: "Reflexión escrita", desc: "Escribe la reflexión de una página" },
  { id: "speed_demon", title: "Velocista", desc: "Desbloquea 3 láminas en un día" },
  { id: "all_pages", title: "Matemático Completo", desc: "Valida todas las páginas activas" },
  { id: "three_badges", title: "Coleccionista", desc: "Obtén 3 insignias" },
  { id: "five_badges", title: "Guardián Matemático", desc: "Obtén 5 insignias" },
  { id: "all_badges", title: "Leyenda del Álbum", desc: "Obtén las 10 insignias" },
  { id: "level_aprendiz", title: "Aprendiz Confirmado", desc: "Alcanza el nivel Aprendiz de Caldas" },
  { id: "level_explorador", title: "Ruta del Explorador", desc: "Alcanza el nivel Explorador Codazzi" },
  { id: "level_estratega", title: "Mente Estratégica", desc: "Alcanza el nivel Estratega Córdoba" },
  { id: "level_ingeniero", title: "Ingeniero en Marcha", desc: "Alcanza el nivel Ingeniero Ospina" },
  { id: "level_astronomo", title: "Ojos al Cielo", desc: "Alcanza el nivel Astrónomo Garavito" },
  { id: "level_maestro", title: "Maestro del Álbum", desc: "Alcanza el nivel Maestro Mutis" },
  { id: "validated_three", title: "Tres Validaciones", desc: "Valida 3 páginas con tu docente" },
  { id: "half_album", title: "Medio Camino", desc: "Desbloquea la mitad de las láminas activas" },
  { id: "full_album", title: "Álbum Completo", desc: "Desbloquea todas las láminas activas" }
];

const SECTION_ACHIEVEMENT_IDS = {
  numeros: "guardian_numeros",
  operaciones: "operations_adept",
  fracciones: "fraction_hero",
  geometria: "geometry_explorer",
  medida: "measure_expert",
  datos: "data_hunter",
  algebra: "algebra_voice",
  universo: "universe_mapper",
  grandes: "great_thinker",
  colombia: "colombia_pride"
};

const LEVEL_ACHIEVEMENT_IDS = {
  1: "level_aprendiz",
  2: "level_explorador",
  3: "level_estratega",
  4: "level_ingeniero",
  5: "level_astronomo",
  6: "level_maestro"
};

const LEVELS = [
  { level: 1, personaje: "Caldas", title: "Aprendiz de Caldas", quality: "Observación y curiosidad", minBadges: 1, image: "images/niveles/aprendiz.png" },
  { level: 2, personaje: "Codazzi", title: "Explorador Codazzi", quality: "Exploración y representación espacial", minBadges: 2, image: "images/niveles/explorador.png" },
  { level: 3, personaje: "Córdoba", title: "Estratega Córdoba", quality: "Pensamiento estratégico", minBadges: 4, image: "images/niveles/estratega.png" },
  { level: 4, personaje: "Ospina", title: "Ingeniero Ospina", quality: "Diseño y construcción", minBadges: 6, image: "images/niveles/ingeniero.png" },
  { level: 5, personaje: "Garavito", title: "Astrónomo Garavito", quality: "Precisión y cálculo", minBadges: 8, image: "images/niveles/astronomo.png" },
  { level: 6, personaje: "Mutis", title: "Maestro Mutis", quality: "Sabiduría integral", minBadges: 10, image: "images/niveles/maestro.png" }
];

const STARTER_LEVEL = {
  level: 0,
  personaje: "Caldas",
  title: "Explorador en formación",
  quality: "Primeros pasos",
  minBadges: 0,
  image: "images/niveles/aprendiz.png"
};

function formatLevelRequirement(minBadges) {
  return `${minBadges} insignia${minBadges === 1 ? "" : "s"}`;
}

function badgeImagePath(badge) {
  if (!badge) return "";
  return badge.image || `images/insignias/${badge.id}.png`;
}

const BADGE_FALLBACK_ICON = {
  caldas: "📘",
  garavito: "🔭",
  policarpa: "🛡️",
  botero: "🎨",
  codazzi: "🗺️",
  vasco: "📊",
  euler: "∑",
  newton: "🍎",
  pitagoras: "△",
  mutis: "🌿"
};

function badgeFallbackIcon(badge) {
  return BADGE_FALLBACK_ICON[badge?.id] || "🏅";
}

function mediaFallbackScript() {
  return "this.style.display='none';const f=this.nextElementSibling;if(f)f.style.display='flex';";
}

function badgeMediaHtml(badge, earned, { size = "sm", alt = "" } = {}) {
  const src = badgeImagePath(badge);
  const label = alt || `Insignia ${badge?.name || ""}`;
  const stateClass = earned ? "badge-media--earned" : "badge-media--locked";
  const fallback = badgeFallbackIcon(badge);
  return `
    <span class="badge-media-wrap badge-media-wrap--${size}">
      <img
        class="badge-media badge-media--${size} ${stateClass}"
        src="${src}"
        alt="${label}"
        loading="lazy"
        onerror="${mediaFallbackScript()}"
      />
      <span class="badge-media-fallback badge-media-fallback--${size} ${stateClass}" style="display:none" aria-hidden="true">${fallback}</span>
    </span>
  `;
}

function levelMediaHtml(level, { size = "md" } = {}) {
  const src = level?.image || "";
  const title = level?.title || "Nivel";
  const fallback = level?.level > 0 ? "⭐" : "🌱";
  if (!src) {
    return `<span class="level-media-fallback level-media-fallback--${size}" aria-hidden="true">${fallback}</span>`;
  }
  return `
    <span class="level-media-wrap level-media-wrap--${size}">
      <img
        class="level-media level-media--${size}"
        src="${src}"
        alt="${title}"
        loading="lazy"
        onerror="${mediaFallbackScript()}"
      />
      <span class="level-media-fallback level-media-fallback--${size}" style="display:none" aria-hidden="true">${fallback}</span>
    </span>
  `;
}

const app = {
  user: null,
  pageIndex: 0,
  state: null,
  pendingUnlockGlow: null
};

const $ = (id) => document.getElementById(id);

const dom = {
  loginScreen: $("loginScreen"),
  albumScreen: $("albumScreen"),
  adminScreen: $("adminScreen"),
  usernameInput: $("usernameInput"),
  enterBtn: $("enterBtn"),
  loginFeedback: $("loginFeedback"),
  studentLine: $("studentLine"),
  codeInput: $("codeInput"),
  useCodeBtn: $("useCodeBtn"),
  feedback: $("feedback"),
  progressFill: $("progressFill"),
  progressText: $("progressText"),
  completeBox: $("completeBox"),
  validatedBox: $("validatedBox"),
  validatedText: $("validatedText"),
  teacherValidateBtn: $("teacherValidateBtn"),
  teacherModal: $("teacherModal"),
  teacherCodeInput: $("teacherCodeInput"),
  confirmTeacherBtn: $("confirmTeacherBtn"),
  closeTeacherBtn: $("closeTeacherBtn"),
  teacherFeedback: $("teacherFeedback"),
  pageTabs: $("pageTabs"),
  albumGrid: $("albumGrid"),
  pageNumber: $("pageNumber"),
  pageName: $("pageName"),
  pageMeta: $("pageMeta"),
  backBtn: $("backBtn"),
  statsContent: $("statsContent"),
  badgesSummary: $("badgesSummary"),
  levelSummary: $("levelSummary"),
  achievementsSummary: $("achievementsSummary"),
  historyContent: $("historyContent"),
  exportProgressBtn: $("exportProgressBtn"),
  badgesModal: $("badgesModal"),
  badgesModalGrid: $("badgesModalGrid"),
  badgesModalProgress: $("badgesModalProgress"),
  badgesCollectionView: $("badgesCollectionView"),
  badgeDetailView: $("badgeDetailView"),
  badgeDetailTitle: $("badgeDetailTitle"),
  badgeDetailMedia: $("badgeDetailMedia"),
  badgeDetailBody: $("badgeDetailBody"),
  levelsModal: $("levelsModal"),
  levelsModalList: $("levelsModalList"),
  levelsModalBar: $("levelsModalBar"),
  levelsModalMeta: $("levelsModalMeta"),
  achievementsModal: $("achievementsModal"),
  achievementsModalList: $("achievementsModalList"),
  achievementsModalProgress: $("achievementsModalProgress"),
  openBadgesModalBtn: $("openBadgesModalBtn"),
  openLevelsModalBtn: $("openLevelsModalBtn"),
  openAchievementsModalBtn: $("openAchievementsModalBtn"),
  closeBadgesModalBtn: $("closeBadgesModalBtn"),
  closeBadgeDetailBtn: $("closeBadgeDetailBtn"),
  backToBadgesBtn: $("backToBadgesBtn"),
  closeLevelsModalBtn: $("closeLevelsModalBtn"),
  closeAchievementsModalBtn: $("closeAchievementsModalBtn"),
  rewardModal: $("rewardModal"),
  rewardModalIcon: $("rewardModalIcon"),
  rewardModalTitle: $("rewardModalTitle"),
  rewardModalMessage: $("rewardModalMessage"),
  closeRewardBtn: $("closeRewardBtn"),
  sectionRoman: $("sectionRoman"),
  sectionTitle: $("sectionTitle"),
  sectionDescription: $("sectionDescription"),
  sectionBadgePreview: $("sectionBadgePreview"),
  pageReflectionWrap: $("pageReflectionWrap"),
  laminaModal: $("laminaModal"),
  laminaModalBody: $("laminaModalBody"),
  closeLaminaModalBtn: $("closeLaminaModalBtn")
};

function normalizeUser(value) {
  return String(value || "").trim().toUpperCase();
}

function defaultState() {
  const unlockedByPage = {};
  const usedCodesByPage = {};
  const validatedByPage = {};
  const unlockedAt = {};
  const reflectionByPage = {};
  const achievements = {};
  const insignias = {};
  const celebrations = { pages: {}, sections: {}, levels: {} };
  const levelReachedAt = {};

  for (const section of SECTIONS) {
    insignias[section.badge.id] = { earned: false, date: "", sectionId: section.id };
  }

  for (const page of PAGES) {
    unlockedByPage[page.key] = Array(page.cards.length).fill(false);
    usedCodesByPage[page.key] = [];
    validatedByPage[page.key] = { done: false, date: "" };
    unlockedAt[page.key] = Array(page.cards.length).fill("");
    reflectionByPage[page.key] = "";
  }

  // Logros disponibles
  for (const a of ACHIEVEMENTS_CATALOG) {
    achievements[a.id] = { unlocked: false, date: "" };
  }

  return { unlockedByPage, usedCodesByPage, validatedByPage, unlockedAt, reflectionByPage, achievements, insignias, celebrations, levelReachedAt };
}

function getSectionForPage(pageKey) {
  return SECTIONS.find((section) => section.pageKeys.includes(pageKey)) || null;
}

function getSectionPages(section) {
  return section.pageKeys
    .map((key) => PAGES.find((p) => p.key === key))
    .filter(Boolean);
}

function getActiveSectionPages(section) {
  return getSectionPages(section).filter((page) => !page.comingSoon);
}

function isPageCompleted(state, pageKey) {
  const page = PAGES.find((p) => p.key === pageKey);
  if (!page) return false;
  const unlocked = state?.unlockedByPage?.[pageKey] || [];
  return unlocked.length === page.cards.length && unlocked.every(Boolean);
}

function isSectionComplete(state, section) {
  const pages = getActiveSectionPages(section);
  if (!pages.length) return false;
  return pages.every((page) => isPageCompleted(state, page.key));
}

function syncInsigniasFromProgress(state) {
  if (!state) return;
  if (!state.insignias) state.insignias = {};

  for (const section of SECTIONS) {
    if (!section.pageKeys.length) continue;

    const badgeId = section.badge.id;
    if (!state.insignias[badgeId]) {
      state.insignias[badgeId] = { earned: false, date: "", sectionId: section.id };
    }

    if (isSectionComplete(state, section) && !state.insignias[badgeId].earned) {
      state.insignias[badgeId].earned = true;
      state.insignias[badgeId].date = new Date().toLocaleDateString("es-CO");
    }
  }
}

function getEarnedBadges(state) {
  syncInsigniasFromProgress(state);
  return SECTIONS.filter((section) => state?.insignias?.[section.badge.id]?.earned);
}

function getBadgeCount(state) {
  return getEarnedBadges(state).length;
}

function getCurrentLevelInfo(badgeCount) {
  let current = STARTER_LEVEL;
  for (const level of LEVELS) {
    if (badgeCount >= level.minBadges) current = level;
  }
  return current;
}

function getNextLevelInfo(badgeCount) {
  return LEVELS.find((level) => badgeCount < level.minBadges) || null;
}

function parseLocaleDate(dateStr) {
  if (!dateStr) return 0;
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const day = Number(parts[0]);
    const month = Number(parts[1]);
    const year = Number(parts[2]);
    if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
      return new Date(year, month - 1, day).getTime();
    }
  }
  const parsed = Date.parse(dateStr);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function deriveLevelReachedDate(state, level) {
  if (!state || !level || level.level === 0) return "";

  const earnedDates = getEarnedBadges(state)
    .map((section) => state.insignias?.[section.badge.id]?.date || "")
    .filter(Boolean)
    .sort((a, b) => parseLocaleDate(a) - parseLocaleDate(b));

  if (earnedDates.length < level.minBadges) return "";
  return earnedDates[level.minBadges - 1];
}

function getLevelReachedDate(state, level) {
  if (!state || !level || level.level === 0) return "";

  if (state.levelReachedAt?.[level.level]) {
    return state.levelReachedAt[level.level];
  }

  return deriveLevelReachedDate(state, level);
}

function backfillLevelReachedAt(state) {
  if (!state) return;
  if (!state.levelReachedAt) state.levelReachedAt = {};

  const badgeCount = getBadgeCount(state);
  for (const level of LEVELS) {
    if (badgeCount < level.minBadges || state.levelReachedAt[level.level]) continue;
    const derived = deriveLevelReachedDate(state, level);
    if (derived) state.levelReachedAt[level.level] = derived;
  }
}

function rememberLevelReached(state, levelNumber) {
  if (!state || !levelNumber) return;
  if (!state.levelReachedAt) state.levelReachedAt = {};
  if (state.levelReachedAt[levelNumber]) return;
  state.levelReachedAt[levelNumber] = new Date().toLocaleDateString("es-CO");
}

function getLevelProgress(badgeCount) {
  const current = getCurrentLevelInfo(badgeCount);
  const next = getNextLevelInfo(badgeCount);

  if (!next) {
    const maxBadges = LEVELS[LEVELS.length - 1].minBadges;
    return { current: badgeCount, needed: maxBadges, percent: 100 };
  }

  const prevThreshold = current.minBadges;
  const span = next.minBadges - prevThreshold;
  const progress = badgeCount - prevThreshold;

  return {
    current: badgeCount,
    needed: next.minBadges,
    percent: span > 0 ? Math.round((progress / span) * 100) : 0
  };
}

function migrateInsignias(insignias) {
  const source = insignias || {};
  const bySection = {};

  for (const [id, data] of Object.entries(source)) {
    if (data?.sectionId) bySection[data.sectionId] = { ...data, oldId: id };
  }

  if (source.colombia?.earned) {
    bySection.colombia = { ...source.colombia, earned: true, sectionId: "colombia" };
  }

  if (source.comerciante?.earned) {
    bySection.fracciones = { ...source.comerciante, earned: true, sectionId: "fracciones" };
  }

  if (source.pitagoras?.earned) {
    const sid = source.pitagoras.sectionId || "grandes";
    if (sid === "universo") {
      bySection.universo = { ...source.pitagoras, earned: true, sectionId: "universo" };
    } else {
      bySection.grandes = { ...source.pitagoras, earned: true, sectionId: "grandes" };
    }
  }

  if (source.policarpa?.earned) {
    const sid = source.policarpa.sectionId || "grandes";
    if (sid === "fracciones") {
      bySection.fracciones = { ...source.policarpa, earned: true, sectionId: "fracciones" };
    } else if (sid === "grandes") {
      bySection.grandes = { earned: true, sectionId: "grandes" };
    }
  }

  if (source.newton?.earned) {
    bySection.universo = { ...source.newton, earned: true, sectionId: "universo" };
  }

  const migrated = {};
  for (const section of SECTIONS) {
    const badgeId = section.badge.id;
    const previous = source[badgeId] || bySection[section.id];
    migrated[badgeId] = previous
      ? { earned: !!previous.earned, date: previous.date || "", sectionId: section.id }
      : { earned: false, date: "", sectionId: section.id };
  }

  return migrated;
}

function getUserState() {
  return app.state || defaultState();
}

function currentPage() {
  return PAGES[app.pageIndex];
}

function studentName() {
  return STUDENTS[app.user] || app.user || "";
}

function storageSnapshot() {
  const s = getUserState();
  return {
    username: app.user,
    fullName: studentName(),
    unlockedByPage: s.unlockedByPage,
    usedCodesByPage: s.usedCodesByPage,
    validatedByPage: s.validatedByPage,
    unlockedAt: s.unlockedAt || {},
    reflectionByPage: s.reflectionByPage || {},
    achievements: s.achievements || {},
    insignias: s.insignias || {},
    celebrations: s.celebrations || { pages: {}, sections: {}, levels: {} },
    levelReachedAt: s.levelReachedAt || {},
    updatedAt: new Date().toISOString()
  };
}

function getAdminCode() {
  return sessionStorage.getItem("albumAdminCode") || "";
}

async function postApi(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function playTone({ frequency = 440, duration = 120, type = "sine", gain = 0.04, startAfter = 0 }) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = playTone.ctx || (playTone.ctx = new AudioCtx());
  if (ctx.state === "suspended") ctx.resume();

  const now = ctx.currentTime + startAfter;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration / 1000);

  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration / 1000 + 0.02);
}

function successSound() {
  playTone({ frequency: 660, duration: 90, type: "square", gain: 0.03 });
  playTone({ frequency: 880, duration: 110, type: "square", gain: 0.025, startAfter: 0.1 });
}

function errorSound() {
  playTone({ frequency: 180, duration: 170, type: "sawtooth", gain: 0.03 });
  playTone({ frequency: 140, duration: 170, type: "sawtooth", gain: 0.02, startAfter: 0.08 });
}

function setScreen(name) {
  dom.loginScreen.classList.toggle("screen--active", name === "login");
  dom.albumScreen.classList.toggle("screen--active", name === "album");
  if (adminDom.adminScreen) {
    adminDom.adminScreen.classList.toggle("screen--active", name === "admin");
  }
}

function showLoginFeedback(message, kind = "info") {
  dom.loginFeedback.textContent = message;
  dom.loginFeedback.style.color =
    kind === "success" ? "var(--success)" :
    kind === "error" ? "var(--danger)" :
    "var(--muted)";

  dom.loginFeedback.classList.remove("show");
  void dom.loginFeedback.offsetWidth;
  dom.loginFeedback.classList.add("show");
}

function showFeedback(message, kind = "info") {
  dom.feedback.textContent = message;
  dom.feedback.style.color =
    kind === "success" ? "var(--success)" :
    kind === "error" ? "var(--danger)" :
    "var(--text)";

  dom.feedback.classList.remove("show");
  void dom.feedback.offsetWidth;
  dom.feedback.classList.add("show");
}

function showTeacherFeedback(message, kind = "info") {
  dom.teacherFeedback.textContent = message;
  dom.teacherFeedback.style.color =
    kind === "success" ? "var(--success)" :
    kind === "error" ? "var(--danger)" :
    "var(--text)";

  dom.teacherFeedback.classList.remove("show");
  void dom.teacherFeedback.offsetWidth;
  dom.teacherFeedback.classList.add("show");
}

function updateHeader() {
  dom.studentLine.textContent = `${studentName()} · ${app.user} · Grupo 8-9 B`;

  const page = currentPage();
  const section = getSectionForPage(page.key);

  if (dom.sectionRoman) {
    dom.sectionRoman.textContent = section ? `SECCIÓN ${section.roman}` : "SECCIÓN";
  }
  if (dom.sectionTitle) {
    dom.sectionTitle.textContent = section?.title || "Sección en preparación";
  }
  if (dom.sectionDescription) {
    dom.sectionDescription.textContent = section?.description || "";
  }

  if (dom.pageNumber) {
    dom.pageNumber.textContent = page.number ? `Página ${page.number}` : "Página";
  }
  if (dom.pageName) {
    dom.pageName.textContent = page.name || formatPageLabel(page);
  }
  if (dom.pageMeta) {
    dom.pageMeta.textContent = page.description || "";
  }
}

function getAchievementCount(state) {
  if (!state?.achievements) return 0;
  return ACHIEVEMENTS_CATALOG.filter((a) => state.achievements[a.id]?.unlocked).length;
}

function unlockAchievement(state, id) {
  if (!state.achievements) state.achievements = {};
  if (!state.achievements[id]) state.achievements[id] = { unlocked: false, date: "" };
  if (state.achievements[id].unlocked) return false;
  state.achievements[id].unlocked = true;
  state.achievements[id].date = new Date().toLocaleDateString("es-CO");
  return true;
}

function renderStats() {
  if (!app.state) return;

  syncInsigniasFromProgress(app.state);
  const statsEl = dom.statsContent;
  if (!statsEl) return;

  let totalUnlocked = 0;
  let totalCards = 0;
  let validatedPages = 0;
  const activePages = getActivePages();

  for (const page of activePages) {
    const unlocked = app.state.unlockedByPage?.[page.key] || [];
    totalUnlocked += unlocked.filter(Boolean).length;
    totalCards += page.cards.length;
    if (app.state.validatedByPage?.[page.key]?.done) validatedPages++;
  }

  statsEl.innerHTML = `
    <div><strong>${totalUnlocked}</strong> / ${totalCards} láminas</div>
    <div><strong>${validatedPages}</strong> / ${activePages.length} páginas validadas</div>
  `;

  const badgeCount = getBadgeCount(app.state);
  const currentLevel = getCurrentLevelInfo(badgeCount);
  const achievementCount = getAchievementCount(app.state);

  if (dom.badgesSummary) {
    dom.badgesSummary.textContent = `${badgeCount} / ${SECTIONS.length} obtenidas`;
  }
  if (dom.levelSummary) {
    dom.levelSummary.textContent = currentLevel.title;
  }
  if (dom.achievementsSummary) {
    dom.achievementsSummary.textContent = `${achievementCount} / ${ACHIEVEMENTS_CATALOG.length}`;
  }

  renderHistory();
  renderSectionBadge();
}

function renderBadgesAndLevel() {
  renderStats();
}

function renderHistory() {
  const el = dom.historyContent;
  if (!el || !app.state) return;

  let html = "";
  let count = 0;

  for (const page of PAGES) {
    const unlockedAt = app.state.unlockedAt?.[page.key] || [];
    for (let i = 0; i < unlockedAt.length; i++) {
      if (!unlockedAt[i]) continue;
      count++;
      if (count > 4) break;
      const card = page.cards[i];
      html += `
        <div class="history-item">
          <span>${card?.number || i + 1} · ${card?.title || "Lámina"}</span>
          <span>${unlockedAt[i]}</span>
        </div>
      `;
    }
    if (count > 4) break;
  }

  el.innerHTML = html || `<div class="history-empty">Sin historial aún</div>`;
}

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove("hidden");
  modalEl.setAttribute("aria-hidden", "false");
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add("hidden");
  modalEl.setAttribute("aria-hidden", "true");
}

function showBadgesCollectionView() {
  dom.badgesCollectionView?.classList.remove("hidden");
  dom.badgeDetailView?.classList.add("hidden");
}

function openBadgesModal() {
  if (!app.state) return;
  syncInsigniasFromProgress(app.state);
  showBadgesCollectionView();

  const badgeCount = getBadgeCount(app.state);
  if (dom.badgesModalProgress) {
    dom.badgesModalProgress.textContent = `Progreso: ${badgeCount} / ${SECTIONS.length}`;
  }

  if (dom.badgesModalGrid) {
    dom.badgesModalGrid.innerHTML = SECTIONS.map((section) => {
      const earned = !!app.state.insignias?.[section.badge.id]?.earned;
      return `
        <button type="button" class="collection-tile ${earned ? "collection-tile--earned" : "collection-tile--locked"}" data-section-id="${section.id}">
          ${badgeMediaHtml(section.badge, earned, { size: "md", alt: section.badge.name })}
          <span class="collection-tile__name">${section.badge.name}</span>
          <span class="collection-tile__state">${earned ? "✓" : "🔒"}</span>
        </button>
      `;
    }).join("");

    dom.badgesModalGrid.querySelectorAll("[data-section-id]").forEach((btn) => {
      btn.addEventListener("click", () => openBadgeDetail(btn.dataset.sectionId));
    });
  }

  openModal(dom.badgesModal);
}

function openBadgeDetail(sectionId) {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section || !app.state) return;

  const earned = !!app.state.insignias?.[section.badge.id]?.earned;
  const lore = BADGE_LORE[section.badge.id] || {
    description: `La insignia ${section.badge.name} reconoce tu avance en el álbum matemático.`,
    mathConnection: "Cada sección conecta las matemáticas con personajes y saberes importantes."
  };

  if (dom.badgeDetailTitle) {
    dom.badgeDetailTitle.textContent = `🏅 INSIGNIA ${section.badge.name.toUpperCase()}`;
  }
  if (dom.badgeDetailMedia) {
    dom.badgeDetailMedia.innerHTML = badgeMediaHtml(section.badge, earned, { size: "lg", alt: section.badge.name });
  }
  if (dom.badgeDetailBody) {
    dom.badgeDetailBody.innerHTML = `
      <p><strong>Estado:</strong> ${earned ? "Obtenida" : "Bloqueada"}</p>
      <p><strong>Se obtiene al completar:</strong><br>${section.title}</p>
      <p><strong>Descripción:</strong><br>${lore.description}</p>
      <p><strong>Conexión matemática:</strong><br>${lore.mathConnection}</p>
      ${earned && app.state.insignias?.[section.badge.id]?.date ? `<p><strong>Fecha:</strong> ${app.state.insignias[section.badge.id].date}</p>` : ""}
    `;
  }

  dom.badgesCollectionView?.classList.add("hidden");
  dom.badgeDetailView?.classList.remove("hidden");
}

function closeBadgesModal() {
  closeModal(dom.badgesModal);
  showBadgesCollectionView();
}

function openLevelsModal() {
  if (!app.state) return;

  const badgeCount = getBadgeCount(app.state);
  const currentLevel = getCurrentLevelInfo(badgeCount);
  const nextLevel = getNextLevelInfo(badgeCount);
  const currentStep = currentLevel.level > 0 ? currentLevel.level : 0;
  const barPercent = Math.round((currentStep / LEVELS.length) * 100);

  if (dom.levelsModalList) {
    dom.levelsModalList.innerHTML = LEVELS.map((level) => {
      const earned = badgeCount >= level.minBadges;
      const isCurrent = !earned && nextLevel?.level === level.level;
      const icon = earned ? "✓" : isCurrent ? "➡" : "🔒";
      const stateClass = earned ? "collection-list__item--earned" : isCurrent ? "collection-list__item--current" : "collection-list__item--locked";
      return `
        <div class="collection-list__item ${stateClass}">
          <span class="collection-list__icon">${icon}</span>
          <div class="collection-list__text">
            <strong>${level.title}</strong>
            <span>${level.quality}</span>
            <span class="collection-list__req">${formatLevelRequirement(level.minBadges)}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  if (dom.levelsModalBar) dom.levelsModalBar.style.width = `${barPercent}%`;
  if (dom.levelsModalMeta) {
    dom.levelsModalMeta.textContent = currentStep > 0
      ? `Nivel ${currentStep} de ${LEVELS.length}`
      : `Explorador en formación · ${LEVELS.length} niveles por alcanzar`;
  }

  openModal(dom.levelsModal);
}

function openAchievementsModal() {
  if (!app.state) return;

  const earnedCount = getAchievementCount(app.state);
  if (dom.achievementsModalProgress) {
    dom.achievementsModalProgress.textContent = `${earnedCount} / ${ACHIEVEMENTS_CATALOG.length} desbloqueados`;
  }

  if (dom.achievementsModalList) {
    dom.achievementsModalList.innerHTML = ACHIEVEMENTS_CATALOG.map((achievement) => {
      const unlocked = !!app.state.achievements?.[achievement.id]?.unlocked;
      return `
        <div class="collection-list__item ${unlocked ? "collection-list__item--earned" : "collection-list__item--locked"}">
          <span class="collection-list__icon">${unlocked ? "✓" : "🔒"}</span>
          <div class="collection-list__text">
            <strong>${achievement.title}</strong>
            <span>${achievement.desc}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  openModal(dom.achievementsModal);
}

function renderAchievements() {
  // Resumen en barra lateral; detalle en modal.
}

function renderSectionBadge() {
  const el = dom.sectionBadgePreview;
  if (!el || !app.state) return;

  syncInsigniasFromProgress(app.state);
  const section = getSectionForPage(currentPage().key);
  if (!section || !section.pageKeys.length) {
    el.classList.add("hidden");
    el.innerHTML = "";
    return;
  }

  const badgeCount = getBadgeCount(app.state);
  const currentLevel = getCurrentLevelInfo(badgeCount);
  const levelDate = getLevelReachedDate(app.state, currentLevel);
  const earned = !!app.state.insignias?.[section.badge.id]?.earned;
  const insigniaDate = app.state.insignias?.[section.badge.id]?.date || "";
  const activePages = getActiveSectionPages(section);
  const pagesDone = activePages.filter((page) => isPageCompleted(app.state, page.key)).length;
  const pagesTotal = activePages.length;

  el.classList.remove("hidden");
  el.innerHTML = `
    <div class="section-reward-footer">
      <div class="section-reward section-reward--level">
        <div class="section-reward__label">Tu nivel</div>
        <div class="section-reward__card ${currentLevel.level > 0 ? "section-reward__card--earned" : ""}">
          ${levelMediaHtml(currentLevel, { size: "lg" })}
          <div class="section-reward__info">
            <div class="section-reward__name">${currentLevel.title}</div>
            <div class="section-reward__meta">${currentLevel.quality}</div>
            ${levelDate ? `<div class="section-reward__date">Alcanzado: <span>${levelDate}</span></div>` : ""}
          </div>
        </div>
      </div>
      <div class="section-reward section-reward--badge">
        <div class="section-reward__label">Insignia de la sección</div>
        <div class="section-reward__card ${earned ? "section-reward__card--earned" : ""}">
          ${badgeMediaHtml(section.badge, earned, { size: "lg", alt: `Insignia ${section.badge.name}` })}
          <div class="section-reward__info">
            <div class="section-reward__name">Insignia ${section.badge.name}</div>
            ${
              earned
                ? `<div class="section-reward__date">Obtenida: <span>${insigniaDate}</span></div>`
                : `<div class="section-reward__hint">Completa las ${pagesTotal} páginas de esta sección (${pagesDone}/${pagesTotal}).</div>`
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

function backfillCelebrations(state) {
  if (!state) return;
  if (!state.celebrations) {
    state.celebrations = { pages: {}, sections: {}, levels: {} };
  }

  for (const page of PAGES) {
    if (isPageCompleted(state, page.key)) {
      state.celebrations.pages[page.key] = true;
    }
  }

  for (const section of SECTIONS) {
    if (isSectionComplete(state, section)) {
      state.celebrations.sections[section.id] = true;
    }
  }

  const badgeCount = getBadgeCount(state);
  const currentLevel = getCurrentLevelInfo(badgeCount).level;
  for (const level of LEVELS) {
    if (badgeCount >= level.minBadges) {
      state.celebrations.levels[level.level] = true;
    }
  }
}

function ensureCelebrationsState() {
  if (!app.state.celebrations) {
    app.state.celebrations = { pages: {}, sections: {}, levels: {} };
  }
  if (!app.state.celebrations.pages) app.state.celebrations.pages = {};
  if (!app.state.celebrations.sections) app.state.celebrations.sections = {};
  if (!app.state.celebrations.levels) app.state.celebrations.levels = {};
}

function showRewardModal({ icon, title, message, image = "" }) {
  if (!dom.rewardModal) return;

  if (image && dom.rewardModalIcon) {
    dom.rewardModalIcon.innerHTML = `<img class="reward-modal__badge" src="${image}" alt="" />`;
  } else if (dom.rewardModalIcon) {
    dom.rewardModalIcon.textContent = icon;
  }
  dom.rewardModalTitle.textContent = title;
  dom.rewardModalMessage.textContent = message;
  dom.rewardModal.classList.remove("hidden");
  dom.rewardModal.setAttribute("aria-hidden", "false");
  successSound();
}

function closeRewardModal() {
  if (!dom.rewardModal) return;
  dom.rewardModal.classList.add("hidden");
  dom.rewardModal.setAttribute("aria-hidden", "true");
}

function checkProgressCelebrations(beforeState) {
  if (!app.state) return;

  ensureCelebrationsState();
  syncInsigniasFromProgress(app.state);

  const beforeBadges = beforeState ? getBadgeCount(beforeState) : 0;
  const afterBadges = getBadgeCount(app.state);
  const beforeLevel = getCurrentLevelInfo(beforeBadges).level;
  const afterLevel = getCurrentLevelInfo(afterBadges).level;
  const queue = [];

  for (const page of PAGES) {
    const wasComplete = beforeState ? isPageCompleted(beforeState, page.key) : false;
    const isComplete = isPageCompleted(app.state, page.key);
    if (isComplete && !wasComplete && !app.state.celebrations.pages[page.key]) {
      app.state.celebrations.pages[page.key] = true;
      queue.push({
        icon: "📘",
        title: "PÁGINA COMPLETADA",
        message: `Completaste la Página ${page.number}: ${page.name}. Solicita la validación de tu docente para continuar.`
      });
    }
  }

  for (const section of SECTIONS) {
    const wasComplete = beforeState ? isSectionComplete(beforeState, section) : false;
    const isComplete = isSectionComplete(app.state, section);
    if (isComplete && !wasComplete && !app.state.celebrations.sections[section.id]) {
      app.state.celebrations.sections[section.id] = true;
      queue.push({
        icon: "🏅",
        title: "INSIGNIA OBTENIDA",
        message: `Obtuviste la insignia ${section.badge.name} por completar la sección ${section.roman}. ${section.title}.`,
        image: badgeImagePath(section.badge)
      });
    }
  }

  if (afterLevel > beforeLevel && !app.state.celebrations.levels[afterLevel]) {
    app.state.celebrations.levels[afterLevel] = true;
    rememberLevelReached(app.state, afterLevel);
    const levelInfo = getCurrentLevelInfo(afterBadges);
    queue.push({
      icon: "⭐",
      title: "NUEVO NIVEL ALCANZADO",
      message: `Ahora eres ${levelInfo.title}. ¡Sigue explorando el álbum matemático!`,
      image: levelInfo.image || ""
    });
  }

  queue.forEach((item, index) => {
    setTimeout(() => showRewardModal(item), 350 + index * 1800);
  });
}

function snapshotProgressState(state) {
  if (!state) return null;
  const clone = JSON.parse(JSON.stringify(state));
  syncInsigniasFromProgress(clone);
  return clone;
}

function renderTabs() {
  dom.pageTabs.innerHTML = "";

  PAGES.forEach((page, idx) => {
    const btn = document.createElement("button");
    const state = getPageState(page.key);

    let icon = "";
    if (state === "validated") icon = "🟢";
    else if (state === "completed") icon = "🟠";
    else if (state === "inprogress") icon = "🟡";
    else icon = "🔴";

    btn.className = `page-tab ${idx === app.pageIndex ? "is-active" : ""}`;

    const name = page.menuTitle || page.name || formatPageLabel(page);
    btn.textContent = `${icon} ${name}`;

    btn.onclick = () => {
      app.pageIndex = idx;
      dom.feedback.textContent = "";
      renderAll();
    };

    dom.pageTabs.appendChild(btn);
  });
}

function ensurePageState() {
  if (!app.state) app.state = defaultState();

  const key = currentPage().key;
  if (!Array.isArray(app.state.unlockedByPage[key])) {
    app.state.unlockedByPage[key] = Array(currentPage().cards.length).fill(false);
  }
  if (!Array.isArray(app.state.usedCodesByPage[key])) {
    app.state.usedCodesByPage[key] = [];
  }
  if (!app.state.validatedByPage[key]) {
    app.state.validatedByPage[key] = { done: false, date: "" };
  }
}

function ensurePageStateFor(pageKey) {
  if (!app.state) app.state = defaultState();

  const page = PAGES.find((p) => p.key === pageKey);
  if (!page) return;

  if (!Array.isArray(app.state.unlockedByPage[pageKey])) {
    app.state.unlockedByPage[pageKey] = Array(page.cards.length).fill(false);
  }
  if (!Array.isArray(app.state.usedCodesByPage[pageKey])) {
    app.state.usedCodesByPage[pageKey] = [];
  }
  if (!app.state.validatedByPage[pageKey]) {
    app.state.validatedByPage[pageKey] = { done: false, date: "" };
  }
}

function findMatchingCard(code) {
  const normalized = normalizeUser(code);

  for (let pageIndex = 0; pageIndex < PAGES.length; pageIndex++) {
    const page = PAGES[pageIndex];

    for (let cardIndex = 0; cardIndex < page.cards.length; cardIndex++) {
      const card = page.cards[cardIndex];
      if (card.comingSoon || !card.unlockCodes?.length) continue;
      const match = card.unlockCodes.some((c) => normalizeUser(c) === normalized);

      if (match) {
        return {
          pageKey: page.key,
          pageIndex,
          cardIndex,
          card
        };
      }
    }
  }

  return null;
}

function currentUnlocked() {
  ensurePageState();
  return app.state.unlockedByPage[currentPage().key];
}

function currentUsedCodes() {
  ensurePageState();
  return app.state.usedCodesByPage[currentPage().key];
}

function currentValidated() {
  ensurePageState();
  return app.state.validatedByPage[currentPage().key];
}

function getPageState(pageKey) {
  const state = app.state || defaultState();
  const unlocked = state.unlockedByPage[pageKey] || [];
  const validated = state.validatedByPage[pageKey]?.done;

  const done = unlocked.filter(Boolean).length;
  const total = unlocked.length;

  if (validated) return "validated";
  if (done === total && total > 0) return "completed";
  if (done > 0) return "inprogress";
  return "notstarted";
}

function setDefaultFeedback(message, kind = "info") {
  showFeedback(message, kind);
}

function renderProgress() {
  const page = currentPage();

  if (page.comingSoon) {
    dom.progressFill.style.width = "0%";
    dom.progressText.textContent = `0 / ${page.cards.length} láminas`;
    dom.completeBox?.classList.add("hidden");
    dom.validatedBox?.classList.add("hidden");
    dom.codeInput.disabled = true;
    dom.useCodeBtn.disabled = true;
    dom.codeInput.placeholder = "Página en preparación";
    dom.codeInput.style.opacity = "0.5";
    dom.useCodeBtn.style.opacity = "0.5";
    setDefaultFeedback("Esta página estará disponible pronto. Tu docente activará las láminas cuando corresponda.", "info");
    return;
  }

  const unlocked = currentUnlocked();
  const done = unlocked.filter(Boolean).length;
  const total = unlocked.length;

  const isCompleted = done === total;
  const isValidated = currentValidated().done;

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  dom.progressFill.style.width = `${pct}%`;
  dom.progressText.textContent = `${done} / ${total} láminas`;

  dom.completeBox?.classList.toggle("hidden", !isCompleted || isValidated);
  dom.validatedBox?.classList.toggle("hidden", !isValidated);

  if (isValidated) {
    dom.validatedText.textContent = `Validada el ${currentValidated().date || "sin fecha"}.`;
  }

  if (!isCompleted) {
    setDefaultFeedback("Ingresa un código para desbloquear una lámina.", "info");
  } else if (isCompleted && !isValidated) {
    setDefaultFeedback("🎉 Página completada. Solicita validación del docente.", "success");
  } else if (isValidated) {
    setDefaultFeedback("✅ Página validada. Puedes continuar con la siguiente.", "success");
  }

  dom.codeInput.disabled = isValidated;
  dom.useCodeBtn.disabled = isValidated;

  if (isValidated) {
    dom.codeInput.placeholder = "Página validada ✔";
  } else {
    dom.codeInput.placeholder = "Ej: UNI-T5M8-W4B";
  }

  dom.codeInput.style.opacity = isValidated ? "0.5" : "1";
  dom.useCodeBtn.style.opacity = isValidated ? "0.5" : "1";
}

async function imageExists(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = path;
  });
}

function cardNumberLabel(card, index) {
  return card.id || card.number || String(index + 1).padStart(3, "0");
}

function getLaminaDetail(card) {
  const key = card.id || card.number;
  return LAMINA_DETAIL[key] || {};
}

function truncateWords(text, maxWords = 20) {
  const words = String(text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (!words.length) return "";
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}…`;
}

function getCardDescription(card) {
  const parts = String(card.legend || "").split("\n\n");
  return parts[0].trim();
}

function getCardCuriosity(card) {
  const detail = getLaminaDetail(card);
  if (detail.curiosity) return detail.curiosity;

  const parts = String(card.legend || "").split("\n\n");
  if (parts.length < 2) return "";
  return parts.slice(1).join(" ").replace(/^Curiosidad:\s*/i, "").replace(/[«»]/g, "").trim();
}

function getCardShortDesc(card) {
  const detail = getLaminaDetail(card);
  if (detail.shortDesc) return truncateWords(detail.shortDesc, 20);

  const fallback = getCardDescription(card) || card.title || "Descubre esta lámina del álbum.";
  return truncateWords(fallback, 20);
}

function findCardByRef(ref) {
  for (const page of PAGES) {
    const found = page.cards.find((c) => (c.id || c.number) === ref);
    if (found) return found;
  }
  return null;
}

function getRelatedLaminasLines(card) {
  const detail = getLaminaDetail(card);
  const refs = detail.relatedLaminas || [];
  return refs.map((ref) => {
    const related = findCardByRef(ref);
    if (!related) return ref;
    const number = related.number || related.id || ref;
    return `${number} ${related.title}`;
  });
}

function getCardLaminaType(card) {
  return getLaminaDetail(card).laminaType || "Lámina Matemática";
}

function getCardRelatedApp(card) {
  return getLaminaDetail(card).relatedApp || "Álbum Matemático Universal";
}

function buildCardImageHtml(card, unlocked) {
  if (card.comingSoon || !card.image) {
    return `<div class="card__image-container card__image-container--placeholder">
      <div class="card__lock card__lock--soon" title="Lámina en preparación">🕒</div>
    </div>`;
  }

  const imgStyle = unlocked
    ? ""
    : ' style="filter: blur(3px) grayscale(0.7) opacity(0.7);"';

  const lockOverlay = unlocked
    ? ""
    : '<div class="card__lock" title="Lámina bloqueada">🔒</div>';

  return `<div class="card__image-container">
    ${lockOverlay}
    <img class="card__img" src="${card.image}" alt="${card.title}"${imgStyle} />
  </div>`;
}

function openLaminaModal(card, index) {
  if (!dom.laminaModal || !dom.laminaModalBody) return;

  const page = currentPage();
  const unlocked = currentUnlocked()[index];
  const section = getSectionForPage(page.key);
  const numberLabel = cardNumberLabel(card, index);
  const unlockDate = app.state?.unlockedAt?.[page.key]?.[index] || "";
  const shortDesc = getCardShortDesc(card);
  const description = getCardDescription(card);
  const curiosity = getCardCuriosity(card);
  const relatedLines = getRelatedLaminasLines(card);
  const imageHtml = card.image
    ? `<div class="lamina-modal__media"><img src="${card.image}" alt="${card.title}" /></div>`
    : `<div class="lamina-modal__media lamina-modal__media--empty">Ilustración en preparación</div>`;

  if (!unlocked) {
    dom.laminaModalBody.innerHTML = `
      <div class="lamina-modal__number">${numberLabel}</div>
      <h3 id="laminaModalTitle" class="lamina-modal__title">${card.title}</h3>
      ${imageHtml}
      <p class="lamina-modal__teaser">${shortDesc}</p>
      <p class="lamina-modal__locked-msg">🔒 Desbloquea esta lámina con un código para ver toda la información.</p>
    `;
  } else {
    dom.laminaModalBody.innerHTML = `
      <div class="lamina-modal__number">${numberLabel}</div>
      <h3 id="laminaModalTitle" class="lamina-modal__title">${card.title}</h3>
      ${imageHtml}
      <dl class="lamina-modal__meta">
        <div><dt>Tipo</dt><dd>${getCardLaminaType(card)}</dd></div>
        <div><dt>Sección</dt><dd>${section?.title || "—"}</dd></div>
        <div><dt>App relacionada</dt><dd>${getCardRelatedApp(card)}</dd></div>
      </dl>
      <div class="lamina-modal__section">
        <h4>Descripción</h4>
        <p>${description || shortDesc}</p>
      </div>
      ${curiosity ? `<div class="lamina-modal__section"><h4>Curiosidad</h4><p>${curiosity}</p></div>` : ""}
      ${relatedLines.length ? `<div class="lamina-modal__section"><h4>Láminas relacionadas</h4><ul class="lamina-modal__related">${relatedLines.map((line) => `<li>${line}</li>`).join("")}</ul></div>` : ""}
      ${unlockDate ? `<div class="lamina-modal__date">Desbloqueada: <span>${unlockDate}</span></div>` : ""}
    `;
  }

  openModal(dom.laminaModal);
}

function closeLaminaModal() {
  closeModal(dom.laminaModal);
}

async function buildCard(card, index) {
  const unlocked = currentUnlocked()[index];
  const page = currentPage();
  const wrapper = document.createElement("article");
  wrapper.className = `card ${unlocked ? "card--unlocked" : "card--locked"}`;
  wrapper.dataset.cardIndex = String(index);
  wrapper.setAttribute("role", "button");
  wrapper.setAttribute("tabindex", "0");
  wrapper.setAttribute("aria-label", `Lámina ${cardNumberLabel(card, index)}: ${card.title}`);

  if (unlocked && page.color) {
    wrapper.style.borderColor = `${page.color}40`;
  }

  const numberLabel = cardNumberLabel(card, index);
  const shortDesc = getCardShortDesc(card);
  const unlockDate = app.state?.unlockedAt?.[page.key]?.[index] || "";

  wrapper.innerHTML = `
    <div class="card__number">${numberLabel}</div>
    ${buildCardImageHtml(card, unlocked)}
    <div class="card__content">
      <div class="card__title">${card.title}</div>
      <p class="card__summary">${shortDesc}</p>
      ${unlockDate ? `<div class="card__history">Desbloqueada: <span>${unlockDate}</span></div>` : ""}
    </div>
  `;

  const open = () => openLaminaModal(card, index);
  wrapper.addEventListener("click", open);
  wrapper.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });

  return wrapper;
}

// Guardar reflexión de página (una por página)
function savePageReflection(pageKey, value) {
  if (!app.state) return;
  if (!app.state.reflectionByPage) app.state.reflectionByPage = {};
  app.state.reflectionByPage[pageKey] = value;

  if (value && value.trim().length > 0) {
    if (unlockAchievement(app.state, "note_taker")) {
      showAchievementToast("note_taker");
    }
  }

  saveToCloud();
}

function renderPageReflection() {
  const el = dom.pageReflectionWrap;
  if (!el || !app.state) return;

  const page = currentPage();
  const value = app.state.reflectionByPage?.[page.key] || "";

  el.innerHTML = `
    <div class="page-reflection">
      <div class="page-reflection__label">🏁 Reflexión de la Página</div>
      <p class="page-reflection__question">¿Qué fue lo más interesante que aprendiste en esta página?</p>
      <textarea
        id="pageReflectionInput"
        class="page-reflection__input"
        placeholder="Escribe aquí tu descubrimiento o aprendizaje más importante..."
        aria-label="Reflexión de la página"
      ></textarea>
    </div>
  `;

  const textarea = el.querySelector("#pageReflectionInput");
  if (!textarea) return;

  textarea.value = value;
  textarea.addEventListener("change", () => savePageReflection(page.key, textarea.value));
}

// Sistema de logros
function checkAchievements(state) {
  if (!state?.achievements) return;

  let newAchievements = [];
  const pushIfNew = (id) => {
    if (unlockAchievement(state, id)) newAchievements.push(id);
  };

  let totalUnlocked = 0;
  let totalCards = 0;
  for (const page of getActivePages()) {
    const unlocked = state.unlockedByPage?.[page.key] || [];
    totalUnlocked += unlocked.filter(Boolean).length;
    totalCards += page.cards.length;
  }

  if (totalUnlocked >= 1) pushIfNew("first_unlock");
  if (totalCards > 0 && totalUnlocked >= Math.ceil(totalCards / 2)) pushIfNew("half_album");
  if (totalCards > 0 && totalUnlocked >= totalCards) pushIfNew("full_album");

  for (const page of PAGES) {
    const unlocked = state.unlockedByPage?.[page.key] || [];
    if (unlocked.length === page.cards.length && unlocked.every(Boolean)) {
      pushIfNew("page_complete");
      if (page.key === "mixtos") pushIfNew("time_traveler");
      if (page.key === "enteros") pushIfNew("number_world");
    }
  }

  const badgeCount = getBadgeCount(state);
  if (badgeCount >= 1) pushIfNew("first_badge");
  if (badgeCount >= 3) pushIfNew("three_badges");
  if (badgeCount >= 5) pushIfNew("five_badges");
  if (badgeCount >= SECTIONS.length) pushIfNew("all_badges");

  for (const section of SECTIONS) {
    if (isSectionComplete(state, section)) {
      const achievementId = SECTION_ACHIEVEMENT_IDS[section.id];
      if (achievementId) pushIfNew(achievementId);
    }
  }

  for (const level of LEVELS) {
    if (badgeCount >= level.minBadges) {
      const achievementId = LEVEL_ACHIEVEMENT_IDS[level.level];
      if (achievementId) pushIfNew(achievementId);
    }
  }

  const validatedCount = getActivePages().filter((page) => state.validatedByPage?.[page.key]?.done).length;
  const activePageTotal = getActivePages().length;
  if (validatedCount >= 3) pushIfNew("validated_three");
  if (validatedCount >= activePageTotal && activePageTotal > 0) pushIfNew("all_pages");

  for (const page of getActivePages()) {
    if (state.reflectionByPage?.[page.key]?.trim()) {
      pushIfNew("note_taker");
      break;
    }
  }

  if (newAchievements.length > 0) {
    setTimeout(() => showAchievementToast(newAchievements[0]), 500);
  }
}

function showAchievementToast(achievementId) {
  const catalogItem = ACHIEVEMENTS_CATALOG.find((a) => a.id === achievementId);
  const achievement = catalogItem
    ? { icon: "🎖️", title: `¡${catalogItem.title}!`, desc: catalogItem.desc }
    : null;
  if (!achievement) return;
  
  const toast = document.getElementById("achievementToast");
  if (!toast) return;
  
  toast.querySelector(".toast-icon").textContent = achievement.icon;
  toast.querySelector(".toast-title").textContent = achievement.title;
  toast.querySelector(".toast-description").textContent = achievement.desc;
  
  toast.classList.remove("hidden");
  successSound();
  
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 4000);
}

// Historial completo exportado aparte; el panel muestra las últimas entradas.
function renderHistoryPanel() {
  renderHistory();
}

// Exportar progreso a PDF
function exportProgress() {
  if (!app.user || !app.state) return;
  
  let content = `╔══════════════════════════════════════════════════════════╗
║     ÁLBOBUM MATEMÁTICO: AMIGOS DE LAS MATEMÁTICAS              ║
║     Estudiante: ${studentName()}                              ║
║     Usuario: ${app.user}                                           ║
║     Fecha: ${new Date().toLocaleDateString("es-CO")}                                    ║
╚══════════════════════════════════════════════════════════╝

`;
  
  for (const page of PAGES) {
    const unlocked = app.state.unlockedByPage?.[page.key] || [];
    const validated = app.state.validatedByPage?.[page.key]?.done;
    const validatedDate = app.state.validatedByPage?.[page.key]?.date || "";
    
    content += `┌──────────────────────────────────────────────────────┐
│ ${formatPageLabel(page)}
│ Estado: ${validated ? "✅ VALIDADA" : unlocked.filter(Boolean).length + "/6 láminas"}
└──────────────────────────────────────────────────────┘

`;
    
    for (let i = 0; i < page.cards.length; i++) {
      const isUnlocked = unlocked[i];
      content += `${isUnlocked ? "✅" : "⬜"} Lámina ${i + 1}: ${page.cards[i].title}
`;
    }

    const reflection = app.state.reflectionByPage?.[page.key] || "";
    if (reflection.trim()) {
      content += `
📝 Reflexión de la página:
${reflection}
`;
    }
    
    content += `
`;
  }
  
  // Crear y descargar archivo
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `album_${app.user}_${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showFeedback("📥 Progreso exportado", "success");
}

async function renderAlbum() {
  dom.albumGrid.innerHTML = "";
  const page = currentPage();

  for (let i = 0; i < page.cards.length; i++) {
    const node = await buildCard(page.cards[i], i);
    dom.albumGrid.appendChild(node);
  }

  renderProgress();
  renderTabs();
  updateHeader();
  renderPageReflection();
  applyUnlockGlow();
}

function celebrateUnlock(pageKey, cardIndex) {
  app.pendingUnlockGlow = { pageKey, cardIndex };
}

function applyUnlockGlow() {
  if (!app.pendingUnlockGlow || !dom.albumGrid) return;

  const { pageKey, cardIndex } = app.pendingUnlockGlow;
  if (pageKey !== currentPage().key) return;

  const cardEl = dom.albumGrid.children[cardIndex];
  if (!cardEl?.classList.contains("card")) return;

  app.pendingUnlockGlow = null;
  cardEl.classList.remove("card--celebrate");
  void cardEl.offsetWidth;
  cardEl.classList.add("card--celebrate");

  cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });

  window.setTimeout(() => {
    cardEl.classList.remove("card--celebrate");
  }, 2600);
}

async function renderAll() {
  updateHeader();
  renderTabs();
  renderStats();
  await renderAlbum();
}

function saveToCloud() {
  if (!app.user) return Promise.resolve();

  const snapshot = storageSnapshot();
  const localKey = `albumState_${app.user}`;
  
  // Siempre guardar en localStorage primero (más confiable)
  try {
    localStorage.setItem(localKey, JSON.stringify(snapshot));
    console.log("💾 Guardado en localStorage:", app.user);
  } catch (e) {
    console.warn("Error guardando en localStorage:", e);
  }

  // Luego intentar guardar en la nube
  return postApi({
    action: "save",
    ...snapshot
  }).catch((err) => {
    console.warn("No se pudo guardar en la nube (usando localStorage):", err.message);
  });
}

async function loadFromCloud(username) {
  const localKey = `albumState_${username}`;
  try {
    const url = `${API_URL}?action=load&username=${encodeURIComponent(username)}`;
    const res = await fetch(url, { method: "GET", mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.state) {
      console.log("☁️ Cargando desde la nube:", username);
      const migrated = migrateState(data.state);
      localStorage.setItem(localKey, JSON.stringify(migrated));
      return migrated;
    }
  } catch (err) {
    console.warn("Error cargando desde la nube:", err.message);
  }
  const localData = localStorage.getItem(localKey);
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      console.log("📦 Cargando desde localStorage:", username);
      return migrateState(parsed);
    } catch (e) {
      console.warn("Error parseando localStorage:", e);
    }
  }
  console.log("📝 Usando estado por defecto:", username);
  return defaultState();
}

function migrateReflectionByPage(state) {
  const reflection = {};
  for (const page of PAGES) {
    reflection[page.key] = "";
  }

  if (state?.reflectionByPage && typeof state.reflectionByPage === "object") {
    for (const page of PAGES) {
      const value = state.reflectionByPage[page.key];
      if (typeof value === "string") reflection[page.key] = value;
    }
  }

  if (state?.notesByPage && typeof state.notesByPage === "object") {
    for (const page of PAGES) {
      const notes = state.notesByPage[page.key];
      if (Array.isArray(notes)) {
        const first = notes.find((n) => n && String(n).trim());
        if (first && !reflection[page.key]) reflection[page.key] = String(first);
      } else if (typeof notes === "string" && notes.trim() && !reflection[page.key]) {
        reflection[page.key] = notes;
      }
    }
  }

  return reflection;
}

// Migrar estado anterior al nuevo formato
function migrateState(state) {
  if (!state) return defaultState();
  
  const base = defaultState();
  const migrated = {
    ...base,
    ...state,
    unlockedByPage: { ...base.unlockedByPage, ...(state.unlockedByPage || {}) },
    usedCodesByPage: { ...base.usedCodesByPage, ...(state.usedCodesByPage || {}) },
    validatedByPage: { ...base.validatedByPage, ...(state.validatedByPage || {}) },
    unlockedAt: { ...base.unlockedAt, ...(state.unlockedAt || {}) },
    reflectionByPage: migrateReflectionByPage(state),
    achievements: { ...base.achievements, ...(state.achievements || {}) },
    insignias: migrateInsignias({ ...base.insignias, ...(state.insignias || {}) }),
    celebrations: {
      pages: { ...(base.celebrations?.pages || {}), ...(state.celebrations?.pages || {}) },
      sections: { ...(base.celebrations?.sections || {}), ...(state.celebrations?.sections || {}) },
      levels: { ...(base.celebrations?.levels || {}), ...(state.celebrations?.levels || {}) }
    },
    levelReachedAt: { ...(base.levelReachedAt || {}), ...(state.levelReachedAt || {}) }
  };

  delete migrated.notesByPage;
  
  // Agregar unlockedAt si no existe
  if (!migrated.unlockedAt) {
    migrated.unlockedAt = {};
    for (const page of PAGES) {
      migrated.unlockedAt[page.key] = Array(page.cards.length).fill("");
    }
  }
  
  if (!migrated.achievements) {
    migrated.achievements = {};
  }

  for (const a of ACHIEVEMENTS_CATALOG) {
    if (!migrated.achievements[a.id]) {
      migrated.achievements[a.id] = { unlocked: false, date: "" };
    }
  }
  
  for (const page of PAGES) {
    if (!Array.isArray(migrated.unlockedByPage[page.key])) {
      migrated.unlockedByPage[page.key] = Array(page.cards.length).fill(false);
    }
    if (!Array.isArray(migrated.usedCodesByPage[page.key])) {
      migrated.usedCodesByPage[page.key] = [];
    }
    if (!migrated.validatedByPage[page.key]) {
      migrated.validatedByPage[page.key] = { done: false, date: "" };
    }
    if (!Array.isArray(migrated.unlockedAt[page.key])) {
      migrated.unlockedAt[page.key] = Array(page.cards.length).fill("");
    }
    if (typeof migrated.reflectionByPage[page.key] !== "string") {
      migrated.reflectionByPage[page.key] = "";
    }
  }

  syncInsigniasFromProgress(migrated);
  backfillLevelReachedAt(migrated);
  backfillCelebrations(migrated);

  return migrated;
}

async function loadAllStudentsFromCloud() {
  try {
    const url = `${API_URL}?action=loadall&adminCode=${encodeURIComponent(getAdminCode())}`;
    const res = await fetch(url, { method: "GET", mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.ok === false) throw new Error(data.message || "No autorizado");
    if (data && data.students) {
      console.log("☁️ Estudiantes cargados:", Object.keys(data.students).length);
      return data.students;
    }
    throw new Error("Respuesta sin estudiantes");
  } catch (err) {
    console.warn("Error cargando estudiantes:", err.message);
    const localStudents = {};
    for (const user of Object.keys(STUDENTS)) {
      const localData = localStorage.getItem(`albumState_${user}`);
      if (!localData) continue;
      try {
        localStudents[user] = migrateState(JSON.parse(localData));
      } catch (e) {
        console.warn("Error parseando progreso local:", user, e);
      }
    }
    return localStudents;
  }

  // ELIMINÉ LA LLAVE QUE CERRABA AQUÍ PREMATURAMENTE
  
  // Si la nube falla o no hay datos, intentar desde localStorage
  const localData = localStorage.getItem(localKey);
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      console.log("📦 Cargando desde localStorage (fallback):", username);
      return parsed;
    } catch (e) {
      console.warn("Error parseando localStorage:", e);
    }
  }
  
  console.log("📝 Usando estado por defecto:", username);
  return defaultState();
} // ESTA ES LA LLAVE QUE CIERRA LA FUNCIÓN CORRECTAMENTE

function findMatchingSlot(code) {
  const normalized = normalizeUser(code);
  const page = currentPage();
  const unlocked = currentUnlocked();

  return page.cards.findIndex((card, idx) => {
    const notYet = !unlocked[idx];
    const match = card.unlockCodes.some((c) => normalizeUser(c) === normalized);
    return notYet && match;
  });
}

async function login() {
  const user = normalizeUser(dom.usernameInput.value);

  if (!user) {
    errorSound();
    showLoginFeedback("Escribe tu usuario.", "error");
    return;
  }

  if (!STUDENTS[user]) {
    errorSound();
    showLoginFeedback("Ese usuario no está registrado.", "error");
    return;
  }

  try {
    app.user = user;
    localStorage.setItem("albumUser", user);

    showLoginFeedback("Cargando progreso...");
    app.state = await loadFromCloud(user);
    ensurePageState();
    setScreen("album");

    // Mostrar información de origen de datos
    const hasLocal = localStorage.getItem(`albumState_${user}`);
    showFeedback(hasLocal 
      ? `☁️ Datos cargados desde la nube. Bienvenido.` 
      : `📦 No había datos previos. Comenzaste desde cero.`, "info");
    showLoginFeedback("", "info");

    successSound();
    await renderAll();
  } catch (err) {
    console.error(err);
    errorSound();
    showLoginFeedback("Error al cargar. Usando datos locales.", "error");
    app.state = defaultState();
    ensurePageState();
    setScreen("album");
    await renderAll();
  }
}

function logout() {
  app.user = null;
  localStorage.removeItem("albumUser");

  app.pageIndex = 0;
  app.state = null;
  dom.usernameInput.value = "";
  dom.codeInput.value = "";
  dom.feedback.textContent = "";
  dom.studentLine.textContent = "";
  dom.albumGrid.innerHTML = "";
  dom.progressFill.style.width = "0%";
  dom.progressText.textContent = "0 / 6 láminas";
  dom.completeBox.classList.add("hidden");
  dom.validatedBox.classList.add("hidden");
  setScreen("login");
}

async function useCode() {
  const code = normalizeUser(dom.codeInput.value);
  let remoteCodeMessage = "";

  if (!code) {
    errorSound();
    showFeedback("Ingresa un código primero.", "error");
    return;
  }

  try {
    const data = await postApi({
      action: "validatecode",
      username: app.user,
      code,
      type: "unlock"
    });

    if (!data.ok) {
      remoteCodeMessage = data.message || "CÃ³digo incorrecto.";
    }

    const remotePage = PAGES.find((page) => page.key === data.pageKey);
    const remoteCard = remotePage?.cards?.[Number(data.cardIndex)];
    if (remoteCard && !remoteCard.unlockCodes.some((item) => normalizeUser(item) === code)) {
      remoteCard.unlockCodes.push(code);
    }
  } catch (err) {
    console.warn("ValidaciÃ³n remota no disponible, usando cÃ³digos locales:", err.message);
  }

  let match = null;

  for (let p = 0; p < PAGES.length; p++) {
    const page = PAGES[p];

    for (let c = 0; c < page.cards.length; c++) {
      const card = page.cards[c];

      const found = card.unlockCodes.some((k) => normalizeUser(k) === code);

      if (found) {
        match = {
          pageKey: page.key,
          pageIndex: p,
          cardIndex: c,
          card
        };
        break;
      }
    }

    if (match) break;
  }

  if (!match) {
    errorSound();
    showFeedback(remoteCodeMessage || "Código incorrecto.", "error");
    return;
  }

  ensurePageStateFor(match.pageKey);

  const unlocked = app.state.unlockedByPage[match.pageKey];

  if (unlocked[match.cardIndex]) {
    errorSound();
    showFeedback("Esa lámina ya estaba desbloqueada.", "error");
    return;
  }

  const beforeProgress = snapshotProgressState(app.state);

  unlocked[match.cardIndex] = true;
  if (!app.state.usedCodesByPage[match.pageKey].some((c) => normalizeUser(c) === code)) {
    app.state.usedCodesByPage[match.pageKey].push(code);
  }
  
  // Guardar fecha de desbloqueo
  if (!app.state.unlockedAt) app.state.unlockedAt = {};
  if (!app.state.unlockedAt[match.pageKey]) {
    app.state.unlockedAt[match.pageKey] = Array(PAGES.find(p => p.key === match.pageKey).cards.length).fill("");
  }
  app.state.unlockedAt[match.pageKey][match.cardIndex] = new Date().toLocaleDateString("es-CO");

  dom.codeInput.value = "";

  const pageName = formatPageLabel(PAGES[match.pageIndex]);

  if (match.pageKey === currentPage().key) {
    showFeedback(`¡Lámina desbloqueada! (${match.card.title})`, "success");
  } else {
    showFeedback(`🎯 Desbloqueaste una lámina en otra página: ${pageName}`, "success");
  }

  successSound();

  celebrateUnlock(match.pageKey, match.cardIndex);

  // Verificar logros
  checkAchievements(app.state);
  checkProgressCelebrations(beforeProgress);

  await saveToCloud();
  
  await renderAll();
}

function openTeacherModal() {
  if (currentUnlocked().filter(Boolean).length !== currentUnlocked().length) {
    errorSound();
    showFeedback("Primero completa las 6 láminas.", "error");
    return;
  }

  dom.teacherCodeInput.value = "";
  showTeacherFeedback("");
  dom.teacherModal.classList.remove("hidden");
  dom.teacherModal.setAttribute("aria-hidden", "false");
}

function closeTeacherModal() {
  dom.teacherModal.classList.add("hidden");
  dom.teacherModal.setAttribute("aria-hidden", "true");
}

async function confirmTeacherValidation() {
  const currentIndex = PAGES.findIndex((p) => p.key === currentPage().key);

  if (currentIndex > 0) {
    const prevPage = PAGES[currentIndex - 1];
    const prevValidated = app.state.validatedByPage[prevPage.key];

    if (!prevValidated || !prevValidated.done) {
      errorSound();
      showTeacherFeedback("Debes validar la página anterior primero.", "error");
      return;
    }
  }

  const code = normalizeUser(dom.teacherCodeInput.value);

  if (!code) {
    errorSound();
    showTeacherFeedback("Ingresa el código de validación.", "error");
    return;
  }

  const beforeProgress = snapshotProgressState(app.state);

  if (code !== normalizeUser(currentPage().teacherValidationCode)) {
    try {
      const data = await postApi({
        action: "validatecode",
        username: app.user,
        code,
        type: "teacher",
        pageKey: currentPage().key
      });
      if (data.ok) {
        currentValidated().done = true;
        currentValidated().date = new Date().toLocaleDateString("es-CO");
        checkAchievements(app.state);
        checkProgressCelebrations(beforeProgress);
        await saveToCloud();
        successSound();
        showTeacherFeedback("PÃ¡gina marcada como evaluada.", "success");
        closeTeacherModal();
        await renderAll();
        showFeedback("âœ… PÃ¡gina evaluada y registrada en la nube.", "success");
        return;
      }
      showTeacherFeedback(data.message || "CÃ³digo de validaciÃ³n incorrecto.", "error");
      return;
    } catch (err) {
      console.warn("ValidaciÃ³n docente remota no disponible:", err.message);
    }
    errorSound();
    showTeacherFeedback("Código de validación incorrecto.", "error");
    return;
  }

  currentValidated().done = true;
  currentValidated().date = new Date().toLocaleDateString("es-CO");

  // Verificar logros después de validar
  checkAchievements(app.state);
  checkProgressCelebrations(beforeProgress);

  await saveToCloud();

  successSound();
  showTeacherFeedback("Página marcada como evaluada.", "success");

  closeTeacherModal();
  await renderAll();

  showFeedback("✅ Página evaluada y registrada en la nube.", "success");
}

function wireEvents() {
  dom.enterBtn.addEventListener("click", login);
  dom.usernameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") login();
  });

  dom.useCodeBtn.addEventListener("click", useCode);
  dom.codeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") useCode();
  });

  dom.teacherValidateBtn.addEventListener("click", openTeacherModal);
  dom.confirmTeacherBtn.addEventListener("click", confirmTeacherValidation);
  dom.closeTeacherBtn.addEventListener("click", closeTeacherModal);
  dom.teacherModal.addEventListener("click", (e) => {
    if (e.target === dom.teacherModal) closeTeacherModal();
  });

  dom.backBtn.addEventListener("click", logout);

  if (dom.closeRewardBtn) {
    dom.closeRewardBtn.addEventListener("click", closeRewardModal);
  }
  if (dom.rewardModal) {
    dom.rewardModal.addEventListener("click", (e) => {
      if (e.target === dom.rewardModal) closeRewardModal();
    });
  }

  if (dom.openBadgesModalBtn) {
    dom.openBadgesModalBtn.addEventListener("click", openBadgesModal);
  }
  if (dom.openLevelsModalBtn) {
    dom.openLevelsModalBtn.addEventListener("click", openLevelsModal);
  }
  if (dom.openAchievementsModalBtn) {
    dom.openAchievementsModalBtn.addEventListener("click", openAchievementsModal);
  }
  if (dom.closeBadgesModalBtn) {
    dom.closeBadgesModalBtn.addEventListener("click", closeBadgesModal);
  }
  if (dom.closeBadgeDetailBtn) {
    dom.closeBadgeDetailBtn.addEventListener("click", closeBadgesModal);
  }
  if (dom.backToBadgesBtn) {
    dom.backToBadgesBtn.addEventListener("click", showBadgesCollectionView);
  }
  if (dom.closeLevelsModalBtn) {
    dom.closeLevelsModalBtn.addEventListener("click", () => closeModal(dom.levelsModal));
  }
  if (dom.closeAchievementsModalBtn) {
    dom.closeAchievementsModalBtn.addEventListener("click", () => closeModal(dom.achievementsModal));
  }
  if (dom.exportProgressBtn) {
    dom.exportProgressBtn.addEventListener("click", exportProgress);
  }

  if (dom.badgesModal) {
    dom.badgesModal.addEventListener("click", (e) => {
      if (e.target === dom.badgesModal) closeBadgesModal();
    });
  }
  if (dom.levelsModal) {
    dom.levelsModal.addEventListener("click", (e) => {
      if (e.target === dom.levelsModal) closeModal(dom.levelsModal);
    });
  }
  if (dom.achievementsModal) {
    dom.achievementsModal.addEventListener("click", (e) => {
      if (e.target === dom.achievementsModal) closeModal(dom.achievementsModal);
    });
  }
  if (dom.closeLaminaModalBtn) {
    dom.closeLaminaModalBtn.addEventListener("click", closeLaminaModal);
  }
  if (dom.laminaModal) {
    dom.laminaModal.addEventListener("click", (e) => {
      if (e.target === dom.laminaModal) closeLaminaModal();
    });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Escape closes modals
    if (e.key === "Escape") {
      closeTeacherModal();
      closeRewardModal();
      closeBadgesModal();
      closeLaminaModal();
      closeModal(dom.levelsModal);
      closeModal(dom.achievementsModal);
      closeAdminModal();
    }
    // Ctrl+K para focus en código
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      dom.codeInput.focus();
    }
    // Ctrl+Shift+A para Admin
    if (e.ctrlKey && e.shiftKey && e.key === "A") {
      e.preventDefault();
      if (app.user === "ADMIN") {
        setScreen("admin");
        renderAdminWelcome();
      }
    }
  });
}

// ==========================================
// SISTEMA DE LOGROS / ACHIEVEMENTS
// ==========================================

const ACHIEVEMENTS = [
  { id: "firstCard", title: "Primera Lámina", icon: "🌟", description: "Desbloquea tu primera lámina", condition: (s) => countTotalUnlocked(s) >= 1 },
  { id: "fiveCards", title: "Coleccionista", icon: "📚", description: "Desbloquea 5 láminas", condition: (s) => countTotalUnlocked(s) >= 5 },
  { id: "pageComplete", title: "Página Completa", icon: "📄", description: "Completa una página", condition: (s) => anyPageComplete(s) },
  { id: "firstValidated", title: "Aprobado", icon: "✅", description: "Valida tu primera página", condition: (s) => anyPageValidated(s) },
  { id: "allPages", title: "Matemático Maestro", icon: "🏆", description: "Valida todas las páginas", condition: (s) => allPagesValidated(s) },
  { id: "fastUnlock", title: "Velocista", icon: "⚡", description: "Desbloquea 3 láminas en un día", condition: (s) => hasFastUnlocks(s) }
];

function countTotalUnlocked(state) {
  if (!state || !state.unlockedByPage) return 0;
  let total = 0;
  for (const key in state.unlockedByPage) {
    total += state.unlockedByPage[key].filter(Boolean).length;
  }
  return total;
}

function anyPageComplete(state) {
  if (!state || !state.unlockedByPage) return false;
  for (const key in state.unlockedByPage) {
    const unlocked = state.unlockedByPage[key];
    if (unlocked.length > 0 && unlocked.filter(Boolean).length === unlocked.length) {
      return true;
    }
  }
  return false;
}

function anyPageValidated(state) {
  if (!state || !state.validatedByPage) return false;
  for (const key in state.validatedByPage) {
    if (state.validatedByPage[key]?.done) return true;
  }
  return false;
}

function allPagesValidated(state) {
  if (!state || !state.validatedByPage) return false;
  for (const page of PAGES) {
    if (!state.validatedByPage[page.key]?.done) return false;
  }
  return true;
}

function hasFastUnlocks(state) {
  // Por ahora retorna false - se implementaría con timestamps
  return false;
}

function checkLegacyAchievements(state) {
  const earned = JSON.parse(localStorage.getItem("albumAchievements") || "[]");
  const newAchievements = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (!earned.includes(achievement.id) && achievement.condition(state)) {
      earned.push(achievement.id);
      newAchievements.push(achievement);
    }
  }
  
  if (newAchievements.length > 0) {
    localStorage.setItem("albumAchievements", JSON.stringify(earned));
    // Mostrar el primer logro nuevo
    showAchievement(newAchievements[0]);
  }
}

function showAchievement(achievement) {
  const toast = document.getElementById("achievementToast");
  if (!toast) return;
  
  const iconEl = toast.querySelector(".toast-icon");
  const titleEl = toast.querySelector(".toast-title");
  const descEl = toast.querySelector(".toast-description");
  
  if (iconEl) iconEl.textContent = achievement.icon;
  if (titleEl) titleEl.textContent = achievement.title;
  if (descEl) descEl.textContent = achievement.description;
  
  toast.classList.remove("hidden");
  
  // Auto-ocultar después de 4 segundos
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 4000);
}

function getEarnedAchievements() {
  return JSON.parse(localStorage.getItem("albumAchievements") || "[]");
}

// ==========================================
// ADMIN PANEL
// ==========================================

const adminDom = {
  adminScreen: document.getElementById("adminScreen"),
  adminBackBtn: document.getElementById("adminBackBtn"),
  viewAllStudentsBtn: document.getElementById("viewAllStudentsBtn"),
  generateCodesBtn: document.getElementById("generateCodesBtn"),
  viewStatsBtn: document.getElementById("viewStatsBtn"),
  resetStudentBtn: document.getElementById("resetStudentBtn"),
  adminSearchInput: document.getElementById("adminSearchInput"),
  adminSearchResults: document.getElementById("adminSearchResults"),
  adminTitle: document.getElementById("adminTitle"),
  adminMeta: document.getElementById("adminMeta"),
  adminContent: document.getElementById("adminContent")
};

function openAdminLoginLegacy() {
  const code = prompt("Ingresa el código de administrador:");
  if (false) {
    app.user = "ADMIN";
    setScreen("admin");
    renderAdminWelcome();
  } else if (code) {
    errorSound();
    alert("Código incorrecto");
  }
}

async function openAdminLogin() {
  const code = prompt("Ingresa el codigo de administrador:");
  if (!code) return;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "admincheck", adminCode: code })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.message || "Codigo incorrecto");

    sessionStorage.setItem("albumAdminCode", code);
    app.user = "ADMIN";
    setScreen("admin");
    renderAdminWelcome();
  } catch (err) {
    errorSound();
    alert(err.message || "No se pudo validar el acceso de administrador");
  }
}

function renderAdminWelcome() {
  if (!adminDom.adminTitle) return;
  adminDom.adminTitle.textContent = "Panel de Administración";
  if (adminDom.adminMeta) adminDom.adminMeta.textContent = "Selecciona una acción del panel lateral";
  
  if (adminDom.adminContent) {
    adminDom.adminContent.innerHTML = `
      <div class="admin-welcome">
        <div style="font-size:64px; margin-bottom:16px;">🎓</div>
        <h3>Bienvenido al Panel de Admin</h3>
        <p>Selecciona una opción para comenzar a gestionar el álbum.</p>
      </div>
    `;
  }
}

// Pega este bloque en tu app(1).js
// Reemplaza la función vieja renderAllStudents() y agrega viewStudentDetail().
// La API_URL puedes dejarla tal como está si esa es la implementación que ya te funciona.
// Si luego creas otro deployment de Apps Script, solo cambias la URL aquí.

function calculateStudentSummary(studentState) {
  const unlockedByPage = studentState?.unlockedByPage || {};
  const validatedByPage = studentState?.validatedByPage || {};

  let totalUnlocked = 0;
  let totalCards = 0;
  let validatedCount = 0;

  for (const page of PAGES) {
    const pageUnlocked = unlockedByPage[page.key] || [];
    totalUnlocked += pageUnlocked.filter(Boolean).length;
    totalCards += page.cards.length;
    if (validatedByPage[page.key]?.done) validatedCount++;
  }

  return {
    totalUnlocked,
    totalCards,
    validatedCount,
    progressPercent: totalCards > 0 ? Math.round((totalUnlocked / totalCards) * 100) : 0,
  };
}

function renderAllStudents() {
  if (!adminDom.adminContent) return;

  adminDom.adminContent.innerHTML = `
    <div style="text-align:center; padding:40px;">
      <div style="font-size:32px; margin-bottom:16px;">⏳</div>
      <p>Cargando datos de estudiantes...</p>
    </div>
  `;

  loadAllStudentsFromCloud()
    .then((allStudents) => {
      const studentsData = allStudents || {};

      let html = `
        <div style="margin-bottom:16px;">
          <input type="text" id="adminStudentSearch" placeholder="🔍 Buscar estudiante..."
            style="width:100%; padding:12px 16px; border-radius:12px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15); color:var(--text); font-size:1rem;">
        </div>
        <div style="overflow-x:auto;">
          <table class="admin-table" id="studentsTable">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Láminas</th>
                <th>Validadas</th>
                <th>Última actividad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
      `;

      for (const [user, name] of Object.entries(STUDENTS)) {
        const studentState = studentsData[user] || {};
        const summary = calculateStudentSummary(studentState);
        const lastActivity = studentState.updatedAt
          ? new Date(studentState.updatedAt).toLocaleDateString("es-CO")
          : "-";

        html += `
          <tr class="student-row" data-user="${user}" data-name="${name.toLowerCase()}">
            <td><strong>${user}</strong></td>
            <td>${name}</td>
            <td>
              <div class="progress-mini" title="${summary.totalUnlocked}/${summary.totalCards} láminas">
                <span style="width:${summary.progressPercent}%"></span>
              </div>
              <small>${summary.totalUnlocked}/${summary.totalCards}</small>
            </td>
            <td>${summary.validatedCount} / ${PAGES.length}</td>
            <td>${lastActivity}</td>
            <td>
              <button class="btn btn--ghost" style="padding:6px 12px; font-size:.85rem;"
                onclick="viewStudentDetail('${user}')">👁️ Ver</button>
            </td>
          </tr>
        `;
      }

      html += `
            </tbody>
          </table>
        </div>
        <p style="margin-top:16px; color:var(--muted); font-size:.9rem;">
          <em>💡 Doble clic en una fila o usa el botón para ver el detalle completo del estudiante.</em>
        </p>
      `;

      adminDom.adminContent.innerHTML = html;
      if (adminDom.adminTitle) adminDom.adminTitle.textContent = "Todos los Estudiantes";
      if (adminDom.adminMeta) adminDom.adminMeta.textContent = `${Object.keys(STUDENTS).length} estudiantes registrados`;

      setTimeout(() => {
        const searchInput = document.getElementById("adminStudentSearch");
        if (searchInput) {
          searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll(".student-row").forEach((row) => {
              const user = row.dataset.user.toLowerCase();
              const name = row.dataset.name;
              row.style.display = (user.includes(query) || name.includes(query)) ? "" : "none";
            });
          });
        }
      }, 100);
    })
    .catch((err) => {
      adminDom.adminContent.innerHTML = `
        <div style="text-align:center; padding:40px; color:var(--danger);">
          <div style="font-size:32px; margin-bottom:16px;">⚠️</div>
          <p>Error al cargar datos: ${err.message}</p>
          <button class="btn btn--primary" onclick="renderAllStudents()">🔄 Reintentar</button>
        </div>
      `;
    });
}

function viewStudentDetail(username) {
  const name = STUDENTS[username] || username;

  loadAllStudentsFromCloud()
    .then((allStudents) => {
      const studentState = allStudents?.[username] || {};
      const unlockedByPage = studentState.unlockedByPage || {};
      const validatedByPage = studentState.validatedByPage || {};
      const usedCodesByPage = studentState.usedCodesByPage || {};

      let detailHtml = `
        <div style="margin-bottom:24px;">
          <button class="btn btn--ghost" onclick="renderAllStudents()">← Volver a la lista</button>
        </div>
        <div style="background:rgba(255,255,255,.05); padding:20px; border-radius:16px; margin-bottom:24px;">
          <h3 style="margin:0 0 8px 0;">${name}</h3>
          <p style="margin:0; color:var(--muted);">${username}</p>
          <p style="margin:8px 0 0 0; color:var(--muted); font-size:.9rem;">
            Última actividad: ${studentState.updatedAt ? new Date(studentState.updatedAt).toLocaleString("es-CO") : "Sin registro"}
          </p>
        </div>
      `;

      for (const page of PAGES) {
        const pageUnlocked = unlockedByPage[page.key] || [];
        const pageValidated = validatedByPage[page.key] || {};
        const pageCodes = usedCodesByPage[page.key] || [];
        const unlockedCount = pageUnlocked.filter(Boolean).length;
        const totalCards = page.cards.length;
        const isValidated = !!pageValidated.done;
        const progressPercent = totalCards > 0 ? Math.round((unlockedCount / totalCards) * 100) : 0;

        detailHtml += `
          <div style="background:rgba(255,255,255,.03); padding:16px; border-radius:12px; margin-bottom:16px; border-left:4px solid ${isValidated ? 'var(--success)' : 'var(--muted)'}">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px;">
              <h4 style="margin:0;">${page.menuTitle}</h4>
              <span style="background:${isValidated ? 'var(--success)' : 'rgba(255,255,255,.1)'}; padding:4px 12px; border-radius:20px; font-size:.85rem;">
                ${isValidated ? '✅ Validada' : '⏳ En progreso'}
              </span>
            </div>
            <div class="progress-mini" style="margin-bottom:8px;">
              <span style="width:${progressPercent}%"></span>
            </div>
            <p style="margin:0; font-size:.9rem; color:var(--muted);">
              ${unlockedCount} / ${totalCards} láminas desbloqueadas
              ${pageCodes.length > 0 ? ` • ${pageCodes.length} códigos usados` : ''}
              ${pageValidated.date ? ` • Validada el ${pageValidated.date}` : ''}
            </p>
          </div>
        `;
      }

      adminDom.adminContent.innerHTML = detailHtml;
      if (adminDom.adminTitle) adminDom.adminTitle.textContent = `Detalle: ${name}`;
      if (adminDom.adminMeta) adminDom.adminMeta.textContent = "Vista detallada del estudiante";
    })
    .catch((err) => {
      adminDom.adminContent.innerHTML = `
        <div style="text-align:center; padding:40px; color:var(--danger);">
          <div style="font-size:32px; margin-bottom:16px;">⚠️</div>
          <p>Error al cargar detalle: ${err.message}</p>
          <button class="btn btn--primary" onclick="viewStudentDetail('${username}')">🔄 Reintentar</button>
        </div>
      `;
    });
}

window.viewStudentDetail = viewStudentDetail;


function renderGlobalStats() {
  if (!adminDom.adminContent) return;
  
  // Calcular estadísticas simuladas (en producción vendrían de la nube)
  const totalStudents = Object.keys(STUDENTS).length;
  const totalCards = PAGES.reduce((acc, p) => acc + p.cards.length, 0);
  const totalPages = PAGES.length;
  
  let html = `
    <div class="admin-stats-grid">
      <div class="admin-stat-card">
        <div class="stat-number">${totalStudents}</div>
        <div class="stat-label">Estudiantes</div>
      </div>
      <div class="admin-stat-card">
        <div class="stat-number">${totalCards}</div>
        <div class="stat-label">Láminas Total</div>
      </div>
      <div class="admin-stat-card">
        <div class="stat-number">${totalPages}</div>
        <div class="stat-label">Páginas</div>
      </div>
      <div class="admin-stat-card">
        <div class="stat-number">${Object.keys(STUDENTS).length * totalCards}</div>
        <div class="stat-label">Posibles Desbloqueos</div>
      </div>
    </div>
    
    <h3 style="margin-bottom:16px;">Distribución por Página</h3>
    <table class="admin-table">
      <thead>
        <tr>
          <th>Página</th>
          <th>Láminas</th>
          <th>Códigos Únicos</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  for (const page of PAGES) {
    const codeCount = page.cards.reduce((acc, c) => acc + c.unlockCodes.length, 0);
    html += `
      <tr>
        <td><strong>${page.menuTitle}</strong></td>
        <td>${page.cards.length}</td>
        <td>${codeCount}</td>
      </tr>
    `;
  }
  
  html += `</tbody></table>`;
  
  adminDom.adminContent.innerHTML = html;
  if (adminDom.adminTitle) adminDom.adminTitle.textContent = "Estísticas Globales";
  if (adminDom.adminMeta) adminDom.adminMeta.textContent = "Resumen del álbum completo";
}

function renderCodeGenerator() {
  if (!adminDom.adminContent) return;
  
  let html = `
    <div class="admin-code-generator">
      <div class="field">
        <label for="genPageSelect">Seleccionar Página</label>
        <select id="genPageSelect" style="width:100%; padding:14px 16px; border-radius:16px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.08); color:var(--text); font-size:1rem;">
  `;
  
  for (const page of PAGES) {
    html += `<option value="${page.key}">${formatPageLabel(page)}</option>`;
  }
  
  html += `
        </select>
      </div>
      
      <div class="field">
        <label for="genCardSelect">Seleccionar Lámina</label>
        <select id="genCardSelect" style="width:100%; padding:14px 16px; border-radius:16px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.08); color:var(--text); font-size:1rem;">
  `;
  
  const firstPage = PAGES[0];
  for (let i = 0; i < firstPage.cards.length; i++) {
    html += `<option value="${i}">${firstPage.cards[i].title}</option>`;
  }
  
  html += `
        </select>
      </div>
      
      <button id="generateBtn" class="btn btn--primary">🔢 Generar y guardar 5 códigos</button>
      
      <div class="admin-code-list" id="generatedCodes"></div>
    </div>
  `;
  
  adminDom.adminContent.innerHTML = html;
  if (adminDom.adminTitle) adminDom.adminTitle.textContent = "Generador de Códigos";
  if (adminDom.adminMeta) adminDom.adminMeta.textContent = "Crea nuevos códigos para tus estudiantes";
  
  // Event listeners para los selects
  setTimeout(() => {
    const pageSelect = document.getElementById("genPageSelect");
    const cardSelect = document.getElementById("genCardSelect");
    
    if (pageSelect) {
      pageSelect.addEventListener("change", () => {
        const page = PAGES.find(p => p.key === pageSelect.value);
        if (page && cardSelect) {
          cardSelect.innerHTML = "";
          for (let i = 0; i < page.cards.length; i++) {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = page.cards[i].title;
            cardSelect.appendChild(opt);
          }
        }
      });
    }
    
    const genBtn = document.getElementById("generateBtn");
    if (genBtn) {
      genBtn.addEventListener("click", generateNewCodes);
    }
  }, 100);
}

async function generateNewCodes() {
  const pageSelect = document.getElementById("genPageSelect");
  const cardSelect = document.getElementById("genCardSelect");
  const codesContainer = document.getElementById("generatedCodes");
  
  if (!pageSelect || !cardSelect || !codesContainer) return;
  
  const page = PAGES.find(p => p.key === pageSelect.value);
  const cardIndex = parseInt(cardSelect.value);
  
  if (!page || page.cards[cardIndex] === undefined) return;
  
  const card = page.cards[cardIndex];
  codesContainer.innerHTML = "<p style='color:var(--muted);'>Generando códigos...</p>";

  let newCodes = [];
  try {
    const data = await postApi({
      action: "generatecodes",
      adminCode: getAdminCode(),
      pageKey: page.key,
      cardIndex,
      type: "unlock",
      quantity: 5
    });
    if (!data.ok) throw new Error(data.message || "No se pudieron generar los códigos");
    newCodes = data.codes || [];
  } catch (err) {
    codesContainer.innerHTML = `<p style="color:var(--danger);">${err.message || "No se pudieron generar los códigos"}</p>`;
    errorSound();
    return;
  }
  
  let html = "<h4 style='margin-bottom:12px;'>Códigos guardados en Sheets:</h4>";
  for (const code of newCodes) {
    html += `
      <div class="admin-code-item">
        <span class="code">${code}</span>
        <span class="card-title">${card.title}</span>
      </div>
    `;
  }
  
  html += `
    <p style="margin-top:12px; color:var(--muted); font-size:.85rem;">
      Ya quedaron guardados en la pestaña Codes. Puedes entregarlos a tus estudiantes.
    </p>
  `;
  
  codesContainer.innerHTML = html;
  successSound();
}

function renderResetStudent() {
  if (!adminDom.adminContent) return;
  
  // Construir todas las opciones primero
  let optionsHTML = '<option value="">-- Selecciona un estudiante --</option>';
  for (const [user, name] of Object.entries(STUDENTS)) {
    optionsHTML += `<option value="${user}">${name} (${user})</option>`;
  }
  
  // Ahora construir todo el HTML de una sola vez
  adminDom.adminContent.innerHTML = `
    <div class="field">
      <label for="resetStudentSelect">Seleccionar Estudiante</label>
      <select id="resetStudentSelect" style="width:100%; padding:14px 16px; border-radius:16px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.08); color:var(--text); font-size:1rem;">
        ${optionsHTML}
      </select>
    </div>
    
    <div style="margin-top:20px; padding:16px; border-radius:12px; background:rgba(255,107,107,.1); border:1px solid rgba(255,107,107,.3);">
      <p style="color:var(--danger); font-weight:800; margin-bottom:8px;">⚠️ Advertencia</p>
      <p style="color:var(--muted); font-size:.9rem;">
        Esta acción eliminará todo el progreso del estudiante seleccionado incluyendo láminas desbloqueadas y validaciones. Esta acción no se puede deshacer.
      </p>
    </div>
    
    <button id="confirmResetBtn" class="btn btn--danger" style="margin-top:16px;">🔄 Confirmar Reset</button>
  `;
  
  if (adminDom.adminTitle) adminDom.adminTitle.textContent = "Resetear Estudiante";
  if (adminDom.adminMeta) adminDom.adminMeta.textContent = "Borrar todo el progreso de un estudiante";
  
  setTimeout(() => {
    const confirmBtn = document.getElementById("confirmResetBtn");
    const select = document.getElementById("resetStudentSelect");
    
    if (confirmBtn && select) {
      confirmBtn.addEventListener("click", async () => {
        if (!select.value) {
          alert("Selecciona un estudiante primero");
          return;
        }
        if (confirm(`¿Estás seguro de resetear el progreso de ${select.value}?`)) {
          try {
            const res = await fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "text/plain;charset=utf-8" },
              body: JSON.stringify({
                action: "reset",
                username: select.value,
                adminCode: getAdminCode()
              })
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.message || "No se pudo resetear");
            localStorage.removeItem(`albumState_${select.value}`);
            alert(data.message || "Progreso eliminado");
            renderAllStudents();
          } catch (err) {
            alert(err.message || "No se pudo resetear el progreso");
          }
        }
      });
    }
  }, 100);
}

function closeAdminModal() {
  // Placeholder para modales del admin si los hay
}

function adminSearch() {
  const query = normalizeUser(adminDom.adminSearchInput?.value || "");
  
  if (!adminDom.adminSearchResults || query.length < 2) {
    if (adminDom.adminSearchResults) adminDom.adminSearchResults.innerHTML = "";
    return;
  }
  
  let html = "";
  const matches = Object.entries(STUDENTS).filter(([user, name]) => 
    user.toLowerCase().includes(query.toLowerCase()) || 
    name.toLowerCase().includes(query.toLowerCase())
  );
  
  for (const [user, name] of matches.slice(0, 5)) {
    html += `
      <div class="admin-search-item" onclick="alert('Ver detalle de ${user}')">
        <strong>${name}</strong>
        <small>${user}</small>
      </div>
    `;
  }
  
  adminDom.adminSearchResults.innerHTML = html;
}

// Wire Admin events
function wireAdminEvents() {
  if (adminDom.adminBackBtn) {
    adminDom.adminBackBtn.addEventListener("click", () => {
      app.user = null;
      localStorage.removeItem("albumUser");
      setScreen("login");
    });
  }
  
  if (adminDom.viewAllStudentsBtn) {
    adminDom.viewAllStudentsBtn.addEventListener("click", renderAllStudents);
  }
  
  if (adminDom.generateCodesBtn) {
    adminDom.generateCodesBtn.addEventListener("click", renderCodeGenerator);
  }
  
  if (adminDom.viewStatsBtn) {
    adminDom.viewStatsBtn.addEventListener("click", renderGlobalStats);
  }
  
  if (adminDom.resetStudentBtn) {
    adminDom.resetStudentBtn.addEventListener("click", renderResetStudent);
  }
  
  if (adminDom.adminSearchInput) {
    adminDom.adminSearchInput.addEventListener("input", adminSearch);
  }
  
  // Botón secreto para acceder al admin desde login
  const enterBtn = document.getElementById("enterBtn");
  if (enterBtn) {
    enterBtn.addEventListener("dblclick", openAdminLogin);
  }
}

wireEvents();
wireAdminEvents();

window.addEventListener("load", async () => {
  const savedUser = localStorage.getItem("albumUser");

  try {
    if (savedUser) {
      app.user = savedUser;
      setScreen("album");

      app.state = await loadFromCloud(savedUser);
      ensurePageState();
      await renderAll();
    } else {
      setScreen("login");
    }
  } catch (err) {
    console.error(err);
    localStorage.removeItem("albumUser");
    setScreen("login");
  }

  const loading = document.getElementById("loadingScreen");
  if (loading) loading.style.display = "none";
});
