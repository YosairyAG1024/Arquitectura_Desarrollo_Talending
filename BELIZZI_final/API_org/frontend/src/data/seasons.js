export const SEASONS = {
  primavera: {
    id: 'primavera',
    name: 'Primavera',
    headline: 'Todo florece contigo',
    text: 'Linos ligeros, estampados florales y vestidos que se mueven con la brisa.',
    promo: 'Envío gratis en la colección floral',
    marquee: ['Nueva colección floral', 'Tonos suaves', 'Linos y sedas ligeras', 'Envío gratis desde RD$ 5,000'],
    particle: 'petal',
    collections: [
      { title: 'Jardín en flor', blurb: 'Vestidos y blusas con aire fresco.', cat: 'vestidos', kind: 'dress' },
      { title: 'Blazer de abril', blurb: 'Capas ligeras para días templados.', cat: 'chaquetas', kind: 'jacket' },
      { title: 'Paseo en sandalia', blurb: 'Calzado cómodo para caminar la ciudad.', cat: 'calzados', kind: 'shoes' }
    ]
  },
  verano: {
    id: 'verano',
    name: 'Verano',
    headline: 'Sol, mar y mucho color',
    text: 'Prendas luminosas y ligeras, pensadas para la costa y las tardes largas.',
    promo: '2x1 en gafas y accesorios de playa',
    marquee: ['Colección tropical', 'Prendas ligeras', 'Colores vivos', 'Envío gratis desde RD$ 5,000'],
    particle: 'sun',
    collections: [
      { title: 'Costa Amalfitana', blurb: 'Lino y algodón para el calor.', cat: 'camisas', kind: 'shirt' },
      { title: 'Vestidos de playa', blurb: 'Colores vivos que se notan.', cat: 'vestidos', kind: 'dress' },
      { title: 'Dolce vita', blurb: 'Gafas, paja y accesorios.', cat: 'accesorios', kind: 'glasses' }
    ]
  },
  otoño: {
    id: 'otoño',
    name: 'Otoño',
    headline: 'Tonos de tierra, capas con carácter',
    text: 'Marrones, beige y burdeos en prendas que abrigan sin perder la elegancia.',
    promo: '15% en chaquetas y bolsos de otoño',
    marquee: ['Colección tierra', 'Chaquetas y capas', 'Cuero y lana', 'Envío gratis desde RD$ 5,000'],
    particle: 'leaf',
    collections: [
      { title: 'Sartoria', blurb: 'Pantalones y faldas de corte clásico.', cat: 'pantalones', kind: 'pants' },
      { title: 'Capas de otoño', blurb: 'Bomber, blazer y denim.', cat: 'chaquetas', kind: 'jacket' },
      { title: 'Cuero y camel', blurb: 'Bolsos que combinan con todo.', cat: 'bolsos', kind: 'bag' }
    ]
  },
  invierno: {
    id: 'invierno',
    name: 'Invierno',
    headline: 'Elegancia que abriga',
    text: 'Lana, cachemira y azules profundos para los días más fríos del año.',
    promo: 'Bufandas de cachemira con 20% de descuento',
    marquee: ['Colección lana y cachemira', 'Abrigos de invierno', 'Botas y cuero', 'Envío gratis desde RD$ 5,000'],
    particle: 'snow',
    collections: [
      { title: 'Abrigos Firenze', blurb: 'Lana pesada, corte largo.', cat: 'chaquetas', kind: 'jacket' },
      { title: 'Noche en Milán', blurb: 'Vestidos de gala y cachemira.', cat: 'vestidos', kind: 'dress' },
      { title: 'Botas y bufandas', blurb: 'Los detalles que abrigan.', cat: 'calzados', kind: 'shoes' }
    ]
  }
};

export function seasonByDate(date = new Date()) {
  const m = date.getMonth(); // 0 = enero
  if (m >= 2 && m <= 4) return 'primavera';
  if (m >= 5 && m <= 7) return 'verano';
  if (m >= 8 && m <= 10) return 'otoño';
  return 'invierno';
}

{/*CAMBIAR ESO */}