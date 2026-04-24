import { motion } from 'framer-motion';
import { Plus, Flame, Leaf, Star } from 'lucide-react';
import { MenuItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface Props {
  item: MenuItem;
}

export default function MenuCard({ item }: Props) {
  const { addToCart, showToast, cart } = useApp();
  const inCart = cart.find(c => c.menuItem.id === item.id);

  const handleAdd = () => {
    addToCart(item);
    showToast('success', `${item.name} added to cart!`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {item.popular && (
            <span className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              <Star className="w-3 h-3" /> Popular
            </span>
          )}
          {item.spicy && (
            <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              <Flame className="w-3 h-3" /> Spicy
            </span>
          )}
          {item.vegan && (
            <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              <Leaf className="w-3 h-3" /> Vegan
            </span>
          )}
        </div>
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-bold px-4 py-2 rounded-full text-sm">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{item.name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-extrabold text-gray-900">${item.price.toFixed(2)}</span>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleAdd}
            disabled={!item.available}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
              item.available
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            {inCart ? `Add More` : 'Add'}
          </motion.button>
        </div>
        {inCart && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 text-xs text-orange-600 font-medium"
          >
            ✓ {inCart.quantity}× in cart
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
