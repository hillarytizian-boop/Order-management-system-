import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  tableId?: number;
}

export default function CartDrawer({ open, onClose, tableId }: Props) {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, showToast } = useApp();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) { showToast('warning', 'Your cart is empty!'); return; }
    onClose();
    navigate('/table/' + (tableId || 1), { state: { checkout: true } });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                <h2 className="font-bold text-gray-900 text-lg">Your Cart</h2>
                {cart.length > 0 && (
                  <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {cart.reduce((s, c) => s + c.quantity, 0)} items
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-3 px-4 space-y-3">
              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium">Your cart is empty</p>
                    <p className="text-gray-300 text-sm mt-1">Add items from the menu</p>
                  </motion.div>
                ) : (
                  cart.map(item => (
                    <motion.div
                      key={item.menuItem.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="flex gap-3 bg-gray-50 rounded-xl p-3"
                    >
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-16 h-16 object-cover rounded-xl shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{item.menuItem.name}</p>
                        <p className="text-orange-500 font-bold text-sm mt-0.5">${item.menuItem.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-white" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.menuItem.id)}
                            className="ml-auto p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-extrabold text-gray-900 text-lg">${cartTotal.toFixed(2)}</span>
                </div>
                {tableId && (
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl">
                    <span className="text-blue-600 text-sm">🪑</span>
                    <span className="text-blue-700 text-sm font-medium">Table {tableId} selected</span>
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-200"
                >
                  Proceed to Checkout
                </button>
                <button onClick={clearCart} className="w-full text-gray-400 text-sm hover:text-red-500 transition-colors">
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
