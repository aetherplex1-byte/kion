
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface Venue {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  address: string;
  diners: string;
  receiptType: 'Boleta' | 'Factura';
  dietaryRestrictions: string;
}
