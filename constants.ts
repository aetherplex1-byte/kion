import { Category, Venue } from './types';

export const CONFIG = {
  business: {
    name: "KION Peruvian Chinese",
    logo: "🏮",
    tagline: "Peruvian Chinese Heritage",
    colors: {
      background: "#FDF5E6",
      accent: "#8B0000",
      gold: "#D4AF37",
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
        { id: 'ja-kao', name: 'Ja Kao', price: 25, description: 'Suaves empanaditas de harina de trigo al vapor, rellenas de langostino y espárragos (3un)', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800' },
        { id: 'siu-mai', name: 'Siu Mai', price: 23, description: 'Famoso dim sum relleno de pollo, cerdo, langostino y hongo tonku (3un)', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&q=80&w=800' },
        { id: 'wantan-tradicional', name: 'Wantán Tradicional', price: 28, description: 'Rellenos de pollo, cebolla china y kion, servidos con salsa de tamarindo (6un)', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800' },
        { id: 'chun-kun', name: 'Chun Kun', price: 23, description: 'Rollitos primavera fritos rellenos de cerdo, pollo y vegetales salteados (3un)', image: 'https://images.unsplash.com/photo-1544333346-64e4fe18204e?auto=format&fit=crop&q=80&w=800' }
      ]
    },
    {
      id: 'especiales',
      name: 'Especiales',
      items: [
        { id: 'kam-lu', name: 'Kam Lu Wantán', price: 71, description: 'Saltado de cerdo, pollo, langostino, con salsa de tamarindo y wantanes especiales', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800' },
        { id: 'taypa', name: 'Taypa a la Plancha', price: 64, description: 'Pollo, langostinos, cerdo, hongo wanyi, col china y huevito de codorniz', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?auto=format&fit=crop&q=80&w=800' },
        { id: 'platon-asados', name: 'Platón de Asados', price: 86, description: 'Cerdo, pato especiado y pollo asado en nuestro horno chino con panqueques y salsas', image: 'https://images.unsplash.com/photo-1529566186088-7570499d63c4?auto=format&fit=crop&q=80&w=800' }
      ]
    },
    {
      id: 'arroces',
      name: 'Arroces',
      items: [
        { id: 'chaufa-pollo', name: 'Chaufa Pollo', price: 29, description: 'Salteado al wok con huevo, cebolla china, kion y un toque de sillao', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800' },
        { id: 'aeropuerto-kion', name: 'Aeropuerto KION', price: 41, description: 'Chaufa de char siu, pollo y fideos montado por una tortilla de langostinos', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800' },
        { id: 'chaufa-samsi', name: 'Chaufa Sam Si', price: 37, description: 'Con pollo, char siu (cerdo) y langostinos', image: 'https://images.unsplash.com/photo-1512058461358-d383a59d0486?auto=format&fit=crop&q=80&w=800' }
      ]
    },
    {
      id: 'sopas',
      name: 'Sopas',
      items: [
        { id: 'wantan-especial-sopa', name: 'Wantán Especial', price: 46, description: 'Pollo, cerdo, langostino, champiñón, huevito de codorniz y wantanes especiales', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800' },
        { id: 'fuchifu', name: 'Fuchifú', price: 26, description: 'Pollo, verduras chinas, kion y clara de huevo', image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=800' }
      ]
    },
    {
      id: 'bebidas',
      name: 'Bebidas',
      items: [
        { id: 'gaseosa-500', name: 'Gaseosas 500ml', price: 6, description: 'Inka Kola o Coca Cola (regular o sin azúcar)', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800' }
      ]
    }
  ] as Category[],
  hours: {
    mon_thu: "12:00 pm a 11:00 pm",
    fri_sat: "12:00 pm a 12:00 am",
    sun: "12:00 pm a 10:00 pm"
  }
};