const COL = {
  blanco: ['Blanco', '#f4f1ec'], negro: ['Negro', '#1e1c20'], rosa: ['Rosa', '#e8a2b7'],
  salvia: ['Salvia', '#9db59a'], celeste: ['Celeste', '#9cc3e0'], arena: ['Arena', '#d9c3a0'],
  gris: ['Gris', '#8d9199'], camel: ['Camel', '#b98550'], terracota: ['Terracota', '#b8573a'],
  coral: ['Coral', '#ff7a59'], turquesa: ['Turquesa', '#1bb5b0'], burdeos: ['Burdeos', '#6e1f36'],
  oliva: ['Oliva', '#6b7044'], marino: ['Marino', '#1f2f55'], marron: ['Marrón', '#5a3a26'],
  limon: ['Limón', '#f0dc6a'], marfil: ['Marfil', '#eee6d4'], azul: ['Azul', '#3f6aa6'],
  dorado: ['Dorado', '#c9a24b']
};
const col = (...k) => k.map((x) => ({ name: COL[x][0], hex: COL[x][1] }));

const CLOTH = ['XS', 'S', 'M', 'L', 'XL'];
const SHOE = ['36', '38', '40', '42', '44'];
const ONE = ['Única'];
const ALL = ['primavera', 'verano', 'otoño', 'invierno'];

const KIND = {
  'Camisas y blusas': 'shirt', Pantalones: 'pants', Vestidos: 'dress', Faldas: 'skirt',
  Chaquetas: 'jacket', Calzados: 'shoes', Bolsos: 'bag', Accesorios: 'glasses'
};

// Para usar fotos reales, agrega `image: '/ruta/foto.jpg'` a un producto
// y ProductCard / ProductDetail la mostrarán en lugar de la ilustración.
const mk = (id, name, type, gender, price, colors, seasons, popularity, description, extra = {}) => ({
  id, name, type, gender, price,
  colors: col(...colors),
  sizes: type === 'Calzados' ? SHOE : type === 'Bolsos' || type === 'Accesorios' ? ONE : CLOTH,
  seasons, popularity, description,
  kind: name.startsWith('Bufanda') ? 'scarf' : KIND[type],
  isNew: false, stock: 12,
  ...extra
});

export const PRODUCTS = [
  mk(1, 'Blusa Fiore', 'Camisas y blusas', 'mujer', 1890, ['rosa', 'blanco', 'salvia'], ['primavera', 'verano'], 92, 'Blusa de tejido fluido con cuello suave y mangas amplias. Ligera, fresca y fácil de combinar.', { isNew: true }),
  mk(2, 'Camisa de Lino Amalfi', 'Camisas y blusas', 'hombre', 2250, ['blanco', 'celeste', 'arena'], ['verano', 'primavera'], 88, 'Lino lavado de corte relajado. Se arruga con gracia y respira en los días de calor.'),
  mk(3, 'Camisa Oxford Lombardía', 'Camisas y blusas', 'hombre', 2090, ['celeste', 'blanco'], ['otoño', 'primavera'], 66, 'Oxford de algodón grueso con cuello abotonado. Un básico que funciona todo el año.'),
  mk(4, 'Blusa de Seda Venezia', 'Camisas y blusas', 'mujer', 2790, ['marfil', 'negro'], ['invierno', 'otoño'], 71, 'Seda lavable con caída suave y botones forrados. Perfecta bajo un blazer o abrigo.'),
  mk(5, 'Pantalón Sartoria', 'Pantalones', 'hombre', 2890, ['negro', 'gris', 'camel'], ['otoño', 'invierno'], 75, 'Corte sastre con pinzas y tiro medio. Lana mezclada con forro interior.'),
  mk(6, 'Pantalón Palazzo', 'Pantalones', 'mujer', 2490, ['arena', 'negro', 'terracota'], ALL, 70, 'Pierna ancha de tiro alto y caída fluida. Cómodo y elegante a la vez.'),
  mk(7, 'Vestido Portofino', 'Vestidos', 'mujer', 3490, ['coral', 'turquesa', 'blanco'], ['verano'], 97, 'Vestido midi con falda amplia y espalda abierta. Pensado para la costa.', { isNew: true }),
  mk(8, 'Vestido Capri Floral', 'Vestidos', 'mujer', 3190, ['rosa', 'salvia'], ['primavera'], 85, 'Estampado floral sobre fondo suave, escote cruzado y falda con vuelo.'),
  mk(9, 'Vestido Milano de Cachemira', 'Vestidos', 'mujer', 4290, ['burdeos', 'negro'], ['invierno', 'otoño'], 80, 'Punto fino de cachemira mezclada, cuello alto y largo hasta la rodilla.', { isNew: true }),
  mk(10, 'Falda Plisada Verona', 'Faldas', 'mujer', 1990, ['camel', 'burdeos', 'negro'], ['otoño', 'invierno'], 68, 'Plisado permanente con cintura elástica. Se mueve con cada paso.'),
  mk(11, 'Falda Midi Sorrento', 'Faldas', 'mujer', 1790, ['limon', 'blanco'], ['verano', 'primavera'], 73, 'Falda midi de algodón con cintura marcada y bolsillos laterales.'),
  mk(12, 'Bomber Torino', 'Chaquetas', 'hombre', 4590, ['negro', 'oliva'], ['otoño', 'invierno'], 90, 'Bomber de acabado mate con puños de canalé y forro acolchado.'),
  mk(13, 'Abrigo de Lana Firenze', 'Chaquetas', 'mujer', 6990, ['camel', 'gris'], ['invierno'], 93, 'Abrigo largo de lana pesada, solapa ancha y cierre cruzado.', { isNew: true }),
  mk(14, 'Blazer Roma', 'Chaquetas', 'mujer', 4190, ['arena', 'negro', 'marino'], ['primavera', 'otoño'], 78, 'Blazer estructurado de un solo botón, hombros definidos y forro de satén.'),
  mk(15, 'Chaqueta Denim Bari', 'Chaquetas', 'hombre', 3290, ['celeste', 'azul'], ['primavera', 'otoño'], 64, 'Denim lavado a la piedra, corte recto y botones metálicos.', { stock: 0 }),
  mk(16, 'Mocasín Siena', 'Calzados', 'hombre', 3890, ['marron', 'negro'], ALL, 72, 'Piel flor con suela flexible y plantilla acolchada.'),
  mk(17, 'Sandalia Positano', 'Calzados', 'mujer', 2590, ['blanco', 'coral', 'dorado'], ['verano', 'primavera'], 89, 'Tiras finas ajustables, suela ligera y tacón bajo.'),
  mk(18, 'Bota Chelsea Bologna', 'Calzados', 'mujer', 5290, ['negro', 'marron'], ['invierno', 'otoño'], 82, 'Piel con elásticos laterales y suela de goma antideslizante.', { isNew: true }),
  mk(19, 'Zapatilla Lido', 'Calzados', 'unisex', 3190, ['blanco', 'negro'], ALL, 86, 'Zapatilla minimalista de piel con suela vulcanizada.'),
  mk(20, 'Bolso Milano', 'Bolsos', 'mujer', 4890, ['negro', 'camel', 'burdeos'], ALL, 91, 'Bolso estructurado con asa corta, correa desmontable y cierre magnético.'),
  mk(21, 'Bolso de Paja Capri', 'Bolsos', 'mujer', 2190, ['arena', 'blanco'], ['verano'], 74, 'Paja trenzada a mano con forro de algodón y asas de cuero.'),
  mk(22, 'Bandolera Venezia', 'Bolsos', 'unisex', 2790, ['marron', 'negro'], ['otoño', 'invierno'], 69, 'Bandolera compacta con varios compartimentos y correa regulable.'),
  mk(23, 'Gafas Dolce Vita', 'Accesorios', 'unisex', 1490, ['negro', 'dorado', 'marron'], ['verano', 'primavera'], 83, 'Montura ligera con protección UV400 y estuche incluido.'),
  mk(24, 'Bufanda de Cachemira Como', 'Accesorios', 'unisex', 1890, ['gris', 'burdeos', 'camel'], ['invierno', 'otoño'], 77, 'Cachemira suave de 180 cm con flecos finos.', { isNew: true })
];

export const CATEGORIES = [
  { id: 'todo', label: 'Todo el catálogo' },
  { id: 'mujer', label: 'Ropa de mujer' },
  { id: 'hombre', label: 'Ropa de hombre' },
  { id: 'camisas', label: 'Camisas y blusas', type: 'Camisas y blusas', kind: 'shirt' },
  { id: 'pantalones', label: 'Pantalones', type: 'Pantalones', kind: 'pants' },
  { id: 'vestidos', label: 'Vestidos', type: 'Vestidos', kind: 'dress' },
  { id: 'faldas', label: 'Faldas', type: 'Faldas', kind: 'skirt' },
  { id: 'chaquetas', label: 'Chaquetas', type: 'Chaquetas', kind: 'jacket' },
  { id: 'calzados', label: 'Calzados', type: 'Calzados', kind: 'shoes' },
  { id: 'bolsos', label: 'Bolsos', type: 'Bolsos', kind: 'bag' },
  { id: 'accesorios', label: 'Accesorios', type: 'Accesorios', kind: 'glasses' },
  { id: 'novedades', label: 'Novedades' },
  { id: 'temporada', label: 'Colecciones de temporada' }
];

export const TYPES = Object.keys(KIND);
export const MAX_PRICE = 7000;

export function matchCat(p, cat, seasonId) {
  if (cat === 'todo') return true;
  if (cat === 'mujer') return p.gender === 'mujer' || p.gender === 'unisex';
  if (cat === 'hombre') return p.gender === 'hombre' || p.gender === 'unisex';
  if (cat === 'novedades') return p.isNew;
  if (cat === 'temporada') return p.seasons.includes(seasonId) && p.seasons.length < 4;
  const c = CATEGORIES.find((x) => x.id === cat);
  return c?.type ? p.type === c.type : true;
}
{/* CAMBIAR ESO */}