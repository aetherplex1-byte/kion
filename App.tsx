
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { CONFIG } from './constants';
import { MenuItem, Category, Venue, CartItem, CheckoutFormData } from './types';

export default function App() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CONFIG.menu[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    address: '',
    diners: '1',
    receiptType: 'Boleta',
    dietaryRestrictions: 'Ninguna'
  });

  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const scrollToCategory = (id: string) => {
    const element = categoryRefs.current[id];
    if (element) {
      const offset = 260; // Adjusted for the expanded header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveCategory(id);
    }
  };

  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return CONFIG.menu;
    const query = searchQuery.toLowerCase();
    return CONFIG.menu.map(category => ({
      ...category,
      items: category.items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description?.toLowerCase().includes(query)
      )
    })).filter(category => category.items.length > 0);
  }, [searchQuery]);

  const handleSendOrder = () => {
    if (!selectedVenue) return;
    if (!formData.fullName || !formData.address) {
      alert("Por favor completa los campos obligatorios (Nombre y Dirección)");
      return;
    }

    const itemsText = cart.map(item => `- (${item.quantity})x ${item.name}... S/ ${item.price * item.quantity}`).join('\n');
    
    const message = `¡Hola KION ${selectedVenue.name}! 🏮 Quiero realizar un pedido:
--------------------------
${itemsText}
--------------------------
Total: S/ ${cartTotal.toFixed(2)}

Nombre: ${formData.fullName}
Dirección: ${formData.address}
Comensales: ${formData.diners}
Comprobante: ${formData.receiptType}
Restricciones: ${formData.dietaryRestrictions}
--------------------------
*Entiendo que el pago es previo mediante link.*`;

    const whatsappUrl = `https://wa.me/${selectedVenue.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!selectedVenue) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F2E8D5]">
        <div className="text-6xl mb-4 animate-bounce">{CONFIG.business.logo}</div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#8B0000] text-center mb-2">BIENVENIDOS A KION</h1>
        <p className="text-lg text-gray-700 mb-8 text-center italic">Peruvian Chinese Heritage</p>
        
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#8B0000]/10">
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Selecciona tu sede para pedir</h2>
          <div className="space-y-4">
            {CONFIG.venues.map(venue => (
              <button
                key={venue.id}
                onClick={() => setSelectedVenue(venue)}
                className="w-full py-4 px-6 rounded-2xl border-2 border-[#8B0000] text-[#8B0000] font-bold text-lg hover:bg-[#8B0000] hover:text-white transition-all duration-300 flex items-center justify-between group"
              >
                <span>{venue.name}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">⛩️</span>
              </button>
            ))}
          </div>
        </div>
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2024 KION Peruvian Chinese</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F2E8D5]">
      {/* Header Container */}
      <header className="sticky top-0 z-40 bg-[#F2E8D5]/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="bg-[#8B0000] text-white py-1.5 text-center text-[10px] font-bold tracking-widest uppercase">
          Todos nuestros platos son libres de MSG
        </div>
        
        {/* Brand Row */}
        <div className="px-4 py-3 flex items-center justify-between max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{CONFIG.business.logo}</span>
            <div>
              <h1 className="text-xl font-bold text-[#8B0000] leading-none">KION</h1>
              <p className="text-[10px] uppercase tracking-tighter text-gray-600">Peruvian Chinese</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[8px] block text-gray-400 font-bold tracking-widest uppercase">PEDIR EN</span>
            <button 
              onClick={() => setSelectedVenue(null)}
              className="text-[#8B0000] font-extrabold text-sm underline underline-offset-4 flex items-center gap-1"
            >
              {selectedVenue.name} 🔄
            </button>
          </div>
        </div>

        {/* Dedicated Search Row */}
        <div className="px-4 pb-4 max-w-5xl mx-auto w-full">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Busca tu plato favorito (ej. Ja Kao, Chaufa...)" 
              className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/10 focus:border-[#8B0000] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B0000]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B0000]"
              >
                <span className="text-lg">&times;</span>
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Slider */}
        {!searchQuery && (
          <div className="bg-white/50 border-t border-gray-50">
            <div className="flex overflow-x-auto px-4 py-3 gap-2 no-scrollbar custom-scroll max-w-5xl mx-auto">
              {CONFIG.menu.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 uppercase tracking-wider ${
                    activeCategory === cat.id 
                      ? 'bg-[#8B0000] text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pt-8 pb-32">
        {filteredMenu.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-6">🥟</div>
            <h3 className="text-2xl font-bold text-gray-800">No encontramos resultados</h3>
            <p className="text-gray-500 mt-2 max-w-xs">Intenta buscando ingredientes como "pollo", "cerdo" o el nombre de una categoría.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-8 bg-[#8B0000] text-white px-8 py-3 rounded-full font-bold shadow-lg"
            >
              Ver menú completo
            </button>
          </div>
        ) : (
          filteredMenu.map((category) => (
            <div 
              key={category.id} 
              ref={el => categoryRefs.current[category.id] = el}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold text-[#8B0000] tracking-tight">{category.name}</h2>
                <div className="h-[1px] flex-1 bg-[#8B0000]/20"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map(item => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-[#8B0000] transition-colors">{item.name}</h3>
                        <span className="text-[#8B0000] font-black text-lg whitespace-nowrap bg-[#8B0000]/5 px-3 py-1 rounded-xl">
                          S/ {item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 flex-1 mb-6 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-full bg-[#F2E8D5] text-[#8B0000] py-4 rounded-2xl font-extrabold hover:bg-[#8B0000] hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Sticky Cart Button */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-30">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="max-w-md mx-auto w-full bg-[#8B0000] text-white py-5 px-8 rounded-full shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-10 ring-4 ring-white/20"
          >
            <div className="flex items-center gap-4">
              <span className="bg-white text-[#8B0000] w-9 h-9 rounded-full flex items-center justify-center font-black text-lg shadow-inner">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
              <span className="font-extrabold text-lg uppercase tracking-wider">Mi Pedido</span>
            </div>
            <span className="text-xl font-black">S/ {cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart Drawer - Remains largely the same but matches new design tweaks */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-[#F2E8D5] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-6 bg-[#8B0000] text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🥟</span>
                  <h2 className="text-2xl font-bold">Tu Pedido</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-white/80 hover:text-white p-2 text-3xl font-light">&times;</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4 grayscale opacity-50">🥡</div>
                      <p className="text-gray-500 italic">Tu carrito está vacío</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover" />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 leading-tight">{item.name}</h4>
                          <p className="text-sm text-[#8B0000] font-black">S/ {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-100">
                          <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-[#8B0000] transition-colors font-bold">-</button>
                          <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-[#8B0000] transition-colors font-bold">+</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Total */}
                <div className="pt-6 border-t-2 border-[#8B0000]/10 flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">Total</span>
                  <span className="text-3xl font-black text-[#8B0000]">S/ {cartTotal.toFixed(2)}</span>
                </div>

                {/* Checkout Form */}
                <div className="space-y-5 pt-4">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-6 h-px bg-gray-300"></span>
                    Datos de Entrega
                  </h3>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Nombre Completo *</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Juan Pérez"
                      className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B0000]/10 focus:border-[#8B0000] outline-none transition-all text-sm font-medium"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Dirección Exacta *</label>
                    <input 
                      type="text" 
                      placeholder="Calle, Número, Distrito"
                      className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B0000]/10 focus:border-[#8B0000] outline-none transition-all text-sm font-medium"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Comensales</label>
                      <input 
                        type="number" 
                        min="1"
                        className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B0000]/10 focus:border-[#8B0000] outline-none transition-all text-sm font-medium"
                        value={formData.diners}
                        onChange={(e) => setFormData({...formData, diners: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Comprobante</label>
                      <select 
                        className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B0000]/10 focus:border-[#8B0000] outline-none transition-all text-sm font-medium bg-white appearance-none"
                        value={formData.receiptType}
                        onChange={(e) => setFormData({...formData, receiptType: e.target.value as any})}
                      >
                        <option value="Boleta">Boleta</option>
                        <option value="Factura">Factura</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Restricciones</label>
                    <textarea 
                      placeholder="Indícanos si tienes alguna alergia..."
                      className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B0000]/10 focus:border-[#8B0000] outline-none transition-all text-sm font-medium h-24 resize-none"
                      value={formData.dietaryRestrictions}
                      onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-gray-100">
                <button 
                  disabled={cart.length === 0}
                  onClick={handleSendOrder}
                  className="w-full bg-[#00A86B] text-white py-5 rounded-2xl font-black text-lg hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 shadow-xl disabled:grayscale disabled:opacity-50 active:scale-95"
                >
                  Confirmar Pedido 📱
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-tighter">
                  Serás redirigido a WhatsApp para finalizar.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-20 pt-16 pb-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h4 className="text-[#8B0000] font-black text-2xl serif tracking-tighter">KION</h4>
            <p className="text-gray-500 text-sm leading-relaxed italic">
              "Fieles al sabor auténtico del Chifa, libres de MSG y con ingredientes de la más alta calidad."
            </p>
            <div className="flex gap-4 text-3xl grayscale hover:grayscale-0 transition-all cursor-default">
              🏮 ⛩️ 🐉
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-gray-900 font-black text-xs uppercase tracking-[0.2em]">Horarios</h4>
            <div className="space-y-3">
              {[
                { label: 'Lun - Jue', val: CONFIG.hours.mon_thu },
                { label: 'Vie - Sáb', val: CONFIG.hours.fri_sat },
                { label: 'Domingo', val: CONFIG.hours.sun }
              ].map(h => (
                <div key={h.label} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-400 font-bold">{h.label}</span>
                  <span className="text-gray-700 font-black">{h.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-gray-900 font-black text-xs uppercase tracking-[0.2em]">Nuestras Sedes</h4>
            <div className="space-y-4">
              {CONFIG.venues.map(v => (
                <div key={v.id} className="text-xs">
                  <p className="font-black text-gray-800 uppercase tracking-wide">{v.name}</p>
                  <p className="text-gray-500 mt-1">{v.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-16 pt-8 border-t border-gray-50 text-center">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">
            © 2024 KION Peruvian Chinese · Hecho con 🏮 para ti
          </p>
        </div>
      </footer>
    </div>
  );
}
