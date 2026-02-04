
import { Category, Venue } from './types';

export const CONFIG = {
  business: {
    name: "KION Peruvian Chinese",
    logo: "🏮⛩️🐉",
    colors: {
      background: "#F2E8D5",
      accent: "#8B0000",
      jade: "#00A86B"
    }
  },
  venues: [
    { id: 'balboa', name: 'Balboa', phone: '51933440161', address: 'Av. Vasco Nuñez de Balboa 737, Miraflores' },
    { id: 'lamar', name: 'La Mar', phone: '51908907427', address: 'Av. Mariscal La Mar 901, Miraflores' },
    { id: 'elpolo', name: 'El Polo', phone: '51981159316', address: 'El Polo 765, Santiago de Surco' }
  ] as Venue[],
  menu: [
    {
      id: 'dim-sum',
      name: 'Dim Sum',
      items: [
        { id: 'ja-kao', name: 'Ja Kao', price: 25, description: 'Suaves empanaditas de harina de trigo al vapor, rellenas de langostino y espárragos (3un)', image: 'https://picsum.photos/400/300?random=1' },
        { id: 'siu-mai', name: 'Siu Mai', price: 23, description: 'Famoso dim sum relleno de pollo, cerdo, langostino y hongo tonku (3un)', image: 'https://picsum.photos/400/300?random=2' },
        { id: 'wantan-tradicional', name: 'Wantán Tradicional', price: 28, description: 'Rellenos de pollo, cebolla china y kion, servidos con salsa de tamarindo (6un)', image: 'https://picsum.photos/400/300?random=3' },
        { id: 'chun-kun', name: 'Chun Kun', price: 23, description: 'Rollitos primavera fritos rellenos de cerdo, pollo y vegetales salteados (3un)', image: 'https://picsum.photos/400/300?random=4' }
      ]
    },
    {
      id: 'especiales',
      name: 'Especiales',
      items: [
        { id: 'kam-lu', name: 'Kam Lu Wantán', price: 71, description: 'Saltado de cerdo, pollo, langostino, con salsa de tamarindo y wantanes especiales', image: 'https://picsum.photos/400/300?random=5' },
        { id: 'taypa', name: 'Taypa a la Plancha', price: 64, description: 'Pollo, langostinos, cerdo, hongo wanyi, col china y huevito de codorniz', image: 'https://picsum.photos/400/300?random=6' },
        { id: 'platon-asados', name: 'Platón de Asados', price: 86, description: 'Cerdo, pato especiado y pollo asado en nuestro horno chino con panqueques y salsas', image: 'https://picsum.photos/400/300?random=7' }
      ]
    },
    {
      id: 'arroces',
      name: 'Arroces',
      items: [
        { id: 'chaufa-pollo', name: 'Chaufa Pollo', price: 29, description: 'Salteado al wok con huevo, cebolla china, kion y un toque de sillao', image: 'https://picsum.photos/400/300?random=8' },
        { id: 'aeropuerto-kion', name: 'Aeropuerto KION', price: 41, description: 'Chaufa de char siu, pollo y fideos montado por una tortilla de langostinos', image: 'https://picsum.photos/400/300?random=9' },
        { id: 'chaufa-samsi', name: 'Chaufa Sam Si', price: 37, description: 'Con pollo, char siu (cerdo) y langostinos', image: 'https://picsum.photos/400/300?random=10' }
      ]
    },
    {
      id: 'sopas',
      name: 'Sopas',
      items: [
        { id: 'wantan-especial-sopa', name: 'Wantán Especial', price: 46, description: 'Pollo, cerdo, langostino, champiñón, huevito de codorniz y wantanes especiales', image: 'https://picsum.photos/400/300?random=11' },
        { id: 'fuchifu', name: 'Fuchifú', price: 26, description: 'Pollo, verduras chinas, kion y clara de huevo', image: 'https://picsum.photos/400/300?random=12' }
      ]
    },
    {
      id: 'bebidas',
      name: 'Bebidas',
      items: [
        { id: 'gaseosa-500', name: 'Gaseosas 500ml', price: 6, description: 'Inka Kola o Coca Cola (regular o sin azúcar)', image: 'https://picsum.photos/400/300?random=13' }
      ]
    }
  ] as Category[],
  hours: {
    mon_thu: "12:00 pm a 11:00 pm",
    fri_sat: "12:00 pm a 12:00 am",
    sun: "12:00 pm a 10:00 pm"
  }
};
