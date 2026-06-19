import { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Truck, 
  RotateCcw,
  Star,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
type Category = 'All' | 'Silk' | 'Cotton' | 'Party Wear' | 'Wedding Collection';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: Category;
  description: string;
  details: string[];
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Classic Pink Silk Saree",
    price: 4999,
    originalPrice: 7142,
    image: "/images/product_silk.jpg",
    category: "Silk",
    description: "Elegant Banarasi silk saree with intricate gold zari work, perfect for festive occasions.",
    details: ["Pure Silk", "Gold Zari Border", "Length: 6.3m (with blouse)", "Dry Clean Only"]
  },
  {
    id: 2,
    name: "Pastel Block Print Cotton",
    price: 2499,
    originalPrice: 3570,
    image: "/images/product_cotton.jpg",
    category: "Cotton",
    description: "Soft organic cotton saree with traditional hand-block prints in soothing pastel shades.",
    details: ["100% Organic Cotton", "Breathable Fabric", "Day Wear", "Hand Wash Recommended"]
  },
  {
    id: 3,
    name: "Midnight Sequin Party Saree",
    price: 3999,
    originalPrice: 5712,
    image: "/images/product_party.jpg",
    category: "Party Wear",
    description: "Glamorous party wear saree with silver sequins and delicate embroidery work.",
    details: ["Chiffon Blend", "Hand-sequined Work", "Modern Aesthetic", "Dry Clean"]
  },
  {
    id: 4,
    name: "Royal Red Wedding Silk",
    price: 12999,
    originalPrice: 18570,
    image: "/images/product_wedding.jpg",
    category: "Wedding Collection",
    description: "A grand Kanchipuram silk saree in deep red, heavily embroidered with bridal motifs.",
    details: ["Heavy Kanchipuram Silk", "Bridal Specialty", "Gold Threading", "Lifetime Heritage Piece"]
  },
  {
    id: 5,
    name: "Golden Bloom Silk Saree",
    price: 5499,
    originalPrice: 7855,
    image: "/images/product_silk.jpg", // Reusing for variety in demo
    category: "Silk",
    description: "Sun-kissed golden silk saree with floral zardosi patterns.",
    details: ["Raw Silk", "Zardosi Work", "Rich Texture", "Dry Clean Only"]
  },
  {
    id: 6,
    name: "Breezy Azure Cotton",
    price: 1899,
    originalPrice: 2712,
    image: "/images/product_cotton.jpg", // Reusing for variety
    category: "Cotton",
    description: "Lightweight cotton saree for a comfortable and stylish daily look.",
    details: ["Mulmul Cotton", "Eco-friendly Dyes", "Floral Borders", "Gentle Wash"]
  }
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<{ name: string } | null>(null);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    setToast({ name: product.name });
    setTimeout(() => setToast(null), 3000);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark overflow-x-hidden">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <button 
            className="md:hidden p-2 hover:bg-brand-pink rounded-full transition-colors"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6 text-brand-accent" />
          </button>

          <div className="hidden md:flex items-center space-x-10 text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-gray">
            <a href="#home" className="hover:text-brand-accent transition-colors">Home</a>
            <a href="#shop" className="hover:text-brand-accent transition-colors">Shop</a>
            <a href="#featured" className="hover:text-brand-accent transition-colors">Collections</a>
          </div>

          <a href="#" className="flex flex-col items-center">
            <span className="font-serif text-3xl font-black tracking-tighter text-brand-accent italic">Royal Drapes</span>
          </a>

          <div className="flex items-center space-x-6 text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-gray">
            <a href="#contact" className="hidden sm:block hover:text-brand-accent transition-colors">Contact</a>
            <button 
              className="relative p-2 hover:bg-brand-pink rounded-full transition-colors group"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5 text-brand-gray group-hover:text-brand-accent transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-gold text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-white z-50 p-8 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-serif text-2xl font-bold text-brand-gold">Royal Drapes</span>
                <button onClick={() => setIsMenuOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              <div className="flex flex-col space-y-6 text-lg font-medium">
                <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
                <a href="#shop" onClick={() => setIsMenuOpen(false)}>Shop</a>
                <a href="#about" onClick={() => setIsMenuOpen(false)}>Our Story</a>
                <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
              </div>
              <div className="mt-auto pt-8 border-t border-pink-100 italic text-sm text-pink-400">
                Crafting elegance for the modern woman.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative h-[70vh] bg-white overflow-hidden flex items-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/hero_banner.jpg" 
              alt="Elegance in a Saree" 
              className="w-full h-full object-cover grayscale-[0.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
          </div>
          
          <div className="container mx-auto px-10 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <span className="text-brand-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">
                Handcrafted Elegance
              </span>
              <h1 className="font-serif text-5xl md:text-7xl text-brand-dark mb-6 leading-none">
                The Monsoon <br />
                <span className="text-brand-accent italic font-black">Wedding <br /> Collection</span>
              </h1>
              <p className="text-brand-gray text-sm mb-10 max-w-sm leading-loose uppercase tracking-[0.05em]">
                Discover our curated collection of artisanal sarees, weaving together centuries of Indian heritage.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#shop" 
                  className="bg-brand-accent text-white px-10 py-4 font-bold text-[10px] uppercase tracking-widest hover:bg-brand-accent/90 transition-all shadow-xl shadow-brand-accent/20"
                >
                  Discover Now
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Brand Promises */}
        <section className="bg-brand-pink py-16 border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-10 grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="flex flex-col items-center text-center">
              <Truck className="w-6 h-6 text-brand-accent mb-4" />
              <h3 className="font-bold text-[10px] uppercase tracking-widest text-brand-accent">Free Shipping</h3>
              <p className="text-[9px] text-brand-gray uppercase tracking-tighter mt-1">Across all of India</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Star className="w-6 h-6 text-brand-accent mb-4" />
              <h3 className="font-bold text-[10px] uppercase tracking-widest text-brand-accent">Pure Quality</h3>
              <p className="text-[9px] text-brand-gray uppercase tracking-tighter mt-1">Hand-picked by experts</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw className="w-6 h-6 text-brand-accent mb-4" />
              <h3 className="font-bold text-[10px] uppercase tracking-widest text-brand-accent">Easy Returns</h3>
              <p className="text-[9px] text-brand-gray uppercase tracking-tighter mt-1">7-day doorstep pickup</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Phone className="w-6 h-6 text-brand-accent mb-4" />
              <h3 className="font-bold text-[10px] uppercase tracking-widest text-brand-accent">Stylist Support</h3>
              <p className="text-[9px] text-brand-gray uppercase tracking-tighter mt-1">Personal consultations</p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section id="shop" className="py-24 pb-12 bg-white">
          <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="flex flex-col items-start">
              <span className="text-brand-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-2">Heritage Drapes</span>
              <h2 className="font-serif text-3xl md:text-5xl italic font-bold">The Royal Edit</h2>
            </div>
            
            <div className="flex flex-wrap gap-6 text-[10px] uppercase font-bold tracking-widest text-brand-gray">
              {['All', 'Silk', 'Cotton', 'Party Wear', 'Wedding Collection'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as Category)}
                  className={`pb-1 transition-all border-b-2 ${
                    selectedCategory === cat 
                      ? 'text-brand-accent border-brand-accent' 
                      : 'border-transparent hover:text-brand-accent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="pb-32 bg-white">
          <div className="max-w-7xl mx-auto px-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={product.id}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden border border-brand-border bg-brand-pink mb-4 cursor-pointer" 
                       onClick={() => setSelectedProduct(product)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    {product.id % 3 === 0 && (
                      <div className="absolute top-3 left-3 bg-brand-accent text-white text-[8px] px-2 py-1 uppercase font-bold tracking-widest">
                        Best Value
                      </div>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      className="absolute bottom-0 w-full py-4 bg-brand-accent/90 text-white text-[10px] uppercase font-bold tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      Quick Add to Bag
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-brand-dark mb-1">{product.name}</h3>
                      <p className="text-[10px] text-brand-gray italic font-serif leading-none">{product.category} • Hand-picked</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold">₹{product.price.toLocaleString()}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-[9px] text-brand-accent line-through">₹{product.originalPrice.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-gray-400 italic">No products found in this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Section */}
        <section id="featured" className="py-24 bg-brand-dark text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -ml-48 -mb-48" />
          
          <div className="max-w-7xl mx-auto px-10 relative z-10 flex flex-col md:flex-row items-center gap-20">
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <span className="text-brand-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">Artisanal Heritage</span>
                <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8 leading-tight">Heritage in <br /><span className="text-brand-accent italic font-black text-6xl md:text-8xl">Every Thread</span></h2>
                <p className="text-gray-400 text-sm mb-12 leading-loose max-w-md uppercase tracking-wider">
                  Our wedding collection is crafted by eighth-generation weavers from across India. Each piece tells a story of royalty, patience, and unparalleled craftsmanship.
                </p>
                <div className="space-y-6 mb-12">
                  <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-brand-gold/80"><Star className="w-4 h-4 text-brand-gold mr-4" /> Authentic Handloom Fabrics</div>
                  <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-brand-gold/80"><Star className="w-4 h-4 text-brand-gold mr-4" /> Real Gold Zari Options</div>
                  <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-brand-gold/80"><Star className="w-4 h-4 text-brand-gold mr-4" /> Custom Styling Support</div>
                </div>
                <a href="#shop" className="inline-block bg-white text-brand-dark px-12 py-5 font-bold hover:bg-brand-accent hover:text-white transition-all uppercase tracking-widest text-[10px]">
                  View Bridal Collection
                </a>
              </motion.div>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-6 relative">
              <div className="space-y-6">
                <div className="border border-white/10 p-2 bg-white/5 transform rotate-2">
                  <img src="/images/product_wedding.jpg" alt="Bridal 1" className="grayscale-[0.3] hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="border border-white/10 p-2 bg-white/5 transform -rotate-2">
                  <img src="/images/product_silk.jpg" alt="Bridal 2" className="grayscale-[0.3] hover:grayscale-0 transition-all duration-500" />
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="border border-white/10 p-2 bg-white/5 transform -rotate-3">
                  <img src="/images/product_party.jpg" alt="Bridal 3" className="grayscale-[0.3] hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="border border-white/10 p-2 bg-white/5 transform rotate-3">
                  <img src="/images/product_cotton.jpg" alt="Bridal 4" className="grayscale-[0.3] hover:grayscale-0 transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl font-bold mb-8">Our Story</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-8 italic">
            "Royal Drapes was born out of a passion for preserving the timeless beauty of Indian handlooms. We believe that a saree is more than just six yards of fabric; it's a legacy wrapped around a woman's strength and elegance."
          </p>
          <p className="text-gray-500 mb-12">
            Starting as a small boutique in the heart of Banaras, Royal Drapes has now become synonymous with premium quality and authentic designs. Every saree in our collection is curated to ensure that when you wear it, you feel nothing less than royalty.
          </p>
          <div className="flex justify-center space-x-8 italic font-serif text-brand-gold text-xl">
            <span>Authentic</span>
            <span className="text-pink-200">|</span>
            <span>Ethical</span>
            <span className="text-pink-200">|</span>
            <span>Timeless</span>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-brand-pink/30 border-t border-pink-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="font-serif text-4xl font-bold mb-6">Let's connect</h2>
                <p className="text-gray-600 mb-10">We would love to help you find your perfect drape. Visit our studio or reach out to us online.</p>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-6 shrink-0">
                      <Phone className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div>
                      <h4 className="font-bold">Call Us</h4>
                      <p className="text-gray-500">+91 98765 43210</p>
                      <p className="text-gray-500">Mon - Sat, 10am - 7pm</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-6 shrink-0">
                      <Mail className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div>
                      <h4 className="font-bold">Email Us</h4>
                      <p className="text-gray-500">care@royaldrapes.in</p>
                      <p className="text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start underline decoration-gold/20">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-6 shrink-0">
                      <MessageCircle className="w-6 h-6 text-[#25D366]" />
                    </div>
                    <div>
                      <h4 className="font-bold">WhatsApp Concierge</h4>
                      <button className="text-brand-gold font-bold hover:underline">Chat with our stylist</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-pink-50">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">FullName</label>
                      <input type="text" className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-gold outline-none" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                      <input type="email" className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-gold outline-none" placeholder="Enter your email" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Message</label>
                    <textarea rows={4} className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-gold outline-none" placeholder="How can we help you?"></textarea>
                  </div>
                  <button className="w-full bg-brand-gold text-white py-4 rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-lg shadow-gold/20">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-brand-border px-10 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex gap-12 items-center">
            <div className="text-[10px] leading-tight">
              <p className="font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">Contact Us</p>
              <p className="text-brand-gray">+91 98765 43210 • care@royaldrapes.com</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 border border-[#25D366] text-[#25D366] rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          </div>
          
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gray">
            <a href="#" className="hover:text-brand-accent transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-accent transition-colors">Pinterest</a>
            <a href="#" className="hover:text-brand-accent transition-colors">Facebook</a>
          </div>

          <div className="text-right">
            <div className="font-serif text-xl font-black italic text-brand-accent mb-1 leading-none">Royal Drapes</div>
            <div className="text-[9px] text-gray-400 leading-tight uppercase tracking-tighter">
              © 2026 Royal Drapes Luxury Sarees Pvt Ltd.<br/>Designed for the Modern Queen.
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag className="w-5 h-5 text-brand-accent mr-3" />
                  <h2 className="font-serif text-3xl font-bold italic">Your Bag ({cartCount})</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-brand-pink rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mb-6">
                      <ShoppingBag className="w-8 h-8 text-brand-accent/20" />
                    </div>
                    <h3 className="font-serif text-xl italic font-bold mb-2">The bag is empty</h3>
                    <p className="text-brand-gray text-[10px] uppercase tracking-widest mb-8">Start adding some elegance to your wardrobe.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="bg-brand-accent text-white px-10 py-4 font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-brand-accent/20 hover:bg-brand-accent/90"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-6">
                        <div className="w-20 h-28 border border-brand-border overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-brand-dark">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.id)} className="text-brand-gray hover:text-brand-accent transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[10px] text-brand-gold font-bold mb-4 uppercase tracking-[0.2em]">{item.category}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-brand-border h-8">
                              <button onClick={() => updateQuantity(item.id, -1)} className="px-3 hover:bg-brand-pink h-full text-xs">-</button>
                              <span className="px-3 font-bold text-[10px] tracking-widest">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="px-3 hover:bg-brand-pink h-full text-xs">+</button>
                            </div>
                            <span className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-brand-border bg-white">
                  <div className="flex justify-between mb-2 text-[10px] uppercase tracking-widest font-bold text-brand-gray">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-8 text-[10px] uppercase tracking-widest font-bold text-brand-gray">
                    <span>Shipping</span>
                    <span className="text-brand-gold">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-end mb-8 pt-6 border-t border-brand-border">
                    <span className="font-serif text-2xl font-bold italic">Total</span>
                    <span className="font-serif text-3xl font-black text-brand-accent">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <button className="w-full bg-brand-accent text-white py-5 font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-accent/90 transition-all shadow-xl shadow-brand-accent/20 flex items-center justify-center group">
                    Secure Checkout
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-center text-[8px] text-brand-gray mt-6 uppercase tracking-[0.3em] font-bold">
                    Global Express Delivery Available
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[80]"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[95vw] md:max-w-5xl md:h-[85vh] bg-white z-[90] shadow-2xl flex flex-col md:flex-row overflow-hidden"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/90 border border-brand-border rounded-full hover:bg-brand-pink transition-colors"
              >
                <X className="w-5 h-5 text-brand-accent" />
              </button>

              <div className="w-full md:w-1/2 h-80 md:h-full bg-brand-pink relative overflow-hidden">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                />
              </div>

              <div className="w-full md:w-1/2 p-10 md:p-16 overflow-y-auto bg-white flex flex-col border-l border-brand-border">
                <div className="mb-10">
                  <span className="text-brand-gold uppercase tracking-[0.4em] text-[10px] font-black mb-4 block">
                    {selectedProduct.category}
                  </span>
                  <h2 className="font-serif text-5xl font-bold text-brand-dark mb-6 leading-tight max-w-sm italic">{selectedProduct.name}</h2>
                  <div className="flex items-center space-x-6 mb-10">
                    <span className="text-4xl font-black text-brand-accent font-serif tracking-tighter italic">₹{selectedProduct.price.toLocaleString()}</span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-xl text-brand-gray line-through decoration-brand-accent/30 font-light">₹{selectedProduct.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  
                  <div className="w-12 h-0.5 bg-brand-gold mb-10" />
                  
                  <p className="text-brand-gray text-sm leading-relaxed mb-12 uppercase tracking-wide font-medium">
                    {selectedProduct.description}
                  </p>
                  
                  <div className="space-y-4 mb-12">
                    {selectedProduct.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center text-[10px] font-bold uppercase tracking-widest text-brand-gray/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mr-4" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-4">
                  <button 
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                    className="w-full bg-brand-accent text-white py-5 font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-accent/90 transition-all shadow-xl shadow-brand-accent/20"
                  >
                    Add to Bag
                  </button>
                  <div className="flex justify-center items-center gap-8 text-[9px] text-brand-gray font-bold uppercase tracking-[0.2em] mt-6">
                    <span className="flex items-center"><Truck className="w-4 h-4 mr-2 text-brand-accent" /> Complimentary Shipping</span>
                    <span className="flex items-center"><RotateCcw className="w-4 h-4 mr-2 text-brand-accent" /> Certificate of Quality</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Added to Bag Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[100] bg-brand-dark text-white px-8 py-4 shadow-2xl border border-white/10 flex items-center gap-4 min-w-[320px]"
          >
            <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-0.5">Item Added to Bag</p>
              <p className="font-serif italic text-sm truncate max-w-[200px]">{toast.name}</p>
            </div>
            <button 
              onClick={() => { setIsCartOpen(true); setToast(null); }}
              className="text-[10px] uppercase tracking-widest font-black text-brand-accent hover:text-white transition-colors underline decoration-brand-accent/30 underline-offset-4"
            >
              View Bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
