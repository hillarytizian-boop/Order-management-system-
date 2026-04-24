import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, ChefHat, QrCode, LayoutDashboard, Utensils } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';
import MenuCard from '../components/menu/MenuCard';
import CartDrawer from '../components/cart/CartDrawer';
import { SkeletonCard } from '../components/ui/LoadingSkeleton';
import { Link } from 'react-router-dom';

const CATEGORIES: { id: Category | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'All Items', emoji: '🍽️' },
  { id: 'burgers', label: 'Burgers', emoji: '🍔' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'pasta', label: 'Pasta', emoji: '🍝' },
  { id: 'salads', label: 'Salads', emoji: '🥗' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰' },
  { id: 'drinks', label: 'Drinks', emoji: '🍹' },
];

export default function CustomerMenu() {
  const { menuItems, cartCount, cartTotal } = useApp();
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    let items = menuItems.filter(m => m.available);
    if (category !== 'all') items = items.filter(m => m.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(m =>
        m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [menuItems, category, search]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-black text-gray-900 text-lg tracking-tight">TableBite</span>
                <span className="hidden sm:block text-xs text-gray-400">Fine dining, simplified</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/login" className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <LayoutDashboard className="w-3.5 h-3.5" /> Staff
              </Link>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-orange-200"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="w-5 h-5 opacity-80" />
              <span className="text-sm font-medium opacity-80">Restaurant Menu</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight">
              Taste the <span className="text-yellow-300">Difference</span>
            </h1>
            <p className="text-white/80 text-lg mb-6 max-w-lg">
              Fresh ingredients, bold flavors — order from your table or scan the QR code.
            </p>
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search dishes..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-gray-900 bg-white shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-300 font-medium placeholder:text-gray-400"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cart Floating Bar */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-sm"
          >
            <button
              onClick={() => setCartOpen(true)}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-between px-5 py-4 rounded-2xl shadow-2xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="bg-orange-500 text-white w-7 h-7 rounded-xl flex items-center justify-center text-sm font-bold">{cartCount}</span>
                <span className="font-semibold">View Cart</span>
              </div>
              <span className="font-black text-orange-400">${cartTotal.toFixed(2)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                category === cat.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200 scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* QR Code promo */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-blue-900 font-semibold text-sm">Scan a table QR code</p>
            <p className="text-blue-600 text-xs">Your order will be automatically linked to your table</p>
          </div>
          <Link to="/admin/qr-codes" className="ml-auto text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-blue-100 whitespace-nowrap">
            View QR Codes
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-6xl mb-4">🍽️</p>
            <p className="text-gray-500 font-medium">No dishes found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search or category</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map(item => <MenuCard key={item.id} item={item} />)}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
