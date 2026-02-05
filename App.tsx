import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    dietaryRestrictions: ''
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
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToCategory = (id: string) => {
    const element = categoryRefs.current[id];
    if (element) {
      // Ajuste de offset para el buscador sticky (aprox 130px)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 130;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveCategory(id);
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -70% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    Object.values(categoryRefs.current).forEach(ref => {
      if (ref) observer.observe(ref as Element);
    });

    return () => observer.disconnect();
  }, [selectedVenue]);

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
      alert("Por favor completa los campos obligatorios");
      return;
    }

    const itemsText = cart.map(item => `🥢 (${item.quantity}x) ${item.name} - S/ ${item.price * item.quantity}`).join('\n');
    const message = `🏮 ¡Hola KION ${selectedVenue.name.toUpperCase()}!\n\nDeseo realizar un pedido:\n\n${itemsText}\n\n✨ TOTAL: S/ ${cartTotal.toFixed(2)}\n\n👤 Nombre: ${formData.fullName}\n📍 Dirección: ${formData.address}\n👥 Comensales: ${formData.diners}\n🧾 Comprobante: ${formData.receiptType}\n⚠️ Notas: ${formData.dietaryRestrictions || 'Ninguna'}`;

    window.open(`https://wa.me/${selectedVenue.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!selectedVenue) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FDF5E6] paper-bg">
        <div className="text-7xl mb-6 drop-shadow-lg">🏮</div>
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-[#8B0000] tracking-tighter serif mb-2">KION</h1>
          <p className="text-sm uppercase tracking-[0.5em] text-[#D4AF37] font-bold">Peruvian Chinese Heritage</p>
        </div>
        
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl border border-[#D4AF37]/20">
          <h2 className="text-xl font-bold mb-8 text-center text-gray-800 serif italic">Selecciona tu sede</h2>
          <div className="space-y-4">
            {CONFIG.venues.map(venue => (
              <button
                key={venue.id}
                onClick={() => setSelectedVenue(venue)}
                className="w-full py-5 px-8 rounded-2xl border border-[#8B0000]/10 text-[#8B0000] font-bold text-lg hover:bg-[#8B0000] hover:text-white transition-all duration-300 flex items-center justify-between group bg-white"
              >
                <span className="serif">{venue.name}</span>
                <span className="text-2xl">⛩️</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col paper-bg">
      {/* Sección Superior (Desaparece al hacer scroll) */}
      <div className="bg-[#FDF5E6] border-b border-[#D4AF37]/10">
        <div className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3">
             <h1 className="text-2xl font-bold text-[#8B0000] leading-none serif tracking-tighter">KION</h1>
             <div className="h-4 w-px bg-[#D4AF37]/30"></div>
             <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">{selectedVenue.name}</p>
          </div>
          <button 
            onClick={() => setSelectedVenue(null)}
            className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#8B0000] transition-colors"
          >
            Cambiar Sede ▾
          </button>
        </div>
      </div>

      {/* Buscador y Categorías Sticky (Se queda fijo al hacer scroll) */}
      <header className="sticky top-0 z-40 bg-[#FDF5E6]/95 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-sm">
        <div className="px-6 py-4 max-w-6xl mx-auto w-full space-y-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Busca tus platos favoritos..." 
              className="w-full bg-white border border-[#D4AF37]/20 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#8B0000]/10 outline-none shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {!searchQuery && (
            <div className="flex overflow-x-auto gap-2 no-scrollbar items-center">
              {CONFIG.menu.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-[9px] font-black transition-all uppercase tracking-widest border ${
                    activeCategory === cat.id 
                      ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-md' 
                      : 'bg-white text-gray-500 border-gray-100 hover:border-[#D4AF37]/30'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Listado de Platos */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-10 pb-40">
        {filteredMenu.map((category) => (
          <section 
            key={category.id} 
            id={category.id}
            ref={el => categoryRefs.current[category.id] = el}
            className="mb-16 scroll-mt-36"
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-[#8B0000] serif italic whitespace-nowrap">{category.name}</h2>
              <div className="h-px w-full bg-gradient-to-r from-[#D4AF37]/30 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items.map(item => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-baseline gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 serif leading-tight">
                        {item.name}
                      </h3>
                      <span className="text-[#8B0000] font-black text-sm whitespace-nowrap">
                        S/ {item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 flex-1 mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-full bg-[#FDF5E6] text-[#8B0000] py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#8B0000] hover:text-white transition-all active:scale-95"
                    >
                      Añadir al Pedido
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Botón de Carrito */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-40 animate-fade-in">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="max-w-md mx-auto w-full bg-[#8B0000] text-white py-4 px-6 rounded-2xl flex items-center justify-between shadow-2xl hover:brightness-110 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="bg-white text-[#8B0000] w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">
                {cartCount}
              </span>
              <span className="font-bold text-xs uppercase tracking-widest">Ver mi selección</span>
            </div>
            <span className="text-lg font-black serif italic">S/ {cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Modal de Pedido */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-[#FDF5E6] shadow-2xl flex flex-col animate-in slide-in-from-right">
              <div className="p-6 bg-[#8B0000] text-white flex items-center justify-between">
                <h2 className="text-xl font-bold serif italic">Tu Selección</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-2xl">&times;</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
                      <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-sm serif truncate pr-2">{item.name}</h4>
                          <span className="text-[#8B0000] font-black text-xs">S/ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded-lg border border-gray-100 flex items-center justify-center text-xs font-bold">-</button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="w-6 h-6 rounded-lg border border-gray-100 flex items-center justify-center text-xs font-bold">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Datos de entrega</h3>
                  <input 
                    type="text" 
                    placeholder="Tu nombre completo"
                    className="w-full bg-white px-4 py-3 rounded-xl border border-gray-100 text-sm outline-none"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Dirección exacta y referencia"
                    className="w-full bg-white px-4 py-3 rounded-xl border border-gray-100 text-sm outline-none"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select 
                      className="bg-white px-4 py-3 rounded-xl border border-gray-100 text-xs font-bold appearance-none"
                      value={formData.diners}
                      onChange={(e) => setFormData({...formData, diners: e.target.value})}
                    >
                      {[1,2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n} {n===1?'Persona':'Personas'}</option>)}
                    </select>
                    <select 
                      className="bg-white px-4 py-3 rounded-xl border border-gray-100 text-xs font-bold appearance-none"
                      value={formData.receiptType}
                      onChange={(e) => setFormData({...formData, receiptType: e.target.value as any})}
                    >
                      <option value="Boleta">Boleta</option>
                      <option value="Factura">Factura</option>
                    </select>
                  </div>
                  <textarea 
                    placeholder="Notas (ej. sin cebollita china, alergia al maní...)"
                    className="w-full bg-white px-4 py-3 rounded-xl border border-gray-100 text-sm h-20 outline-none resize-none"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-6 bg-white border-t border-gray-100">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Estimado</span>
                  <span className="text-3xl font-black text-[#8B0000] serif italic">S/ {cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleSendOrder}
                  disabled={cart.length === 0}
                  className="w-full bg-[#00A86B] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  Confirmar vía WhatsApp 💬
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}