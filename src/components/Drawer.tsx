
import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { ImageWithFallback } from "./Cards/ImageWithFalback";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    title: string;
    category: string;
    price: string;
    imageUrl: string;
    description?: string;
    addition?: string;
  } | null;
}

export function Drawer({ isOpen, onClose, product }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto"
            style={{ backgroundColor: '#FAE7C9' }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-black/10 transition-colors"
              style={{ color: '#706233' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 md:p-8">
              {/* Image */}
              <div className="rounded-2xl overflow-hidden mb-6">
                <div className="aspect-video overflow-hidden rounded-2xl">
                  <ImageWithFallback
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Category */}
              <p className="text-sm mb-2" style={{ color: '#B0926A' }}>
                {product.category}
              </p>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#706233' }}>
                {product.title}
              </h2>

              {/* Price */}
              <p className="text-2xl font-semibold mb-6" style={{ color: '#706233' }}>
                {product.price}
              </p>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#706233' }}>
                    Описание
                  </h3>
                  <p className="leading-relaxed" style={{ color: '#8B7355' }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* Addition */}
              {product.addition && (
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#706233' }}>
                    Дополнительная информация
                  </h3>
                  <p className="leading-relaxed" style={{ color: '#8B7355' }}>
                    {product.addition}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: '#E1C78F' }}>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-full font-medium transition-transform hover:scale-105"
                  style={{ backgroundColor: '#706233', color: '#FAE7C9' }}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}