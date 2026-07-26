import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ImageWithFallback } from "./Cards/ImageWithFalback";
import { axiosInstance } from "#/lib/api";
import axios from "axios";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    title: string;
    category: string;
    price: string;
    imageUrl: string;
    description?: string;
    addition?: string;
  } | null;
}

interface OrderFormData {
  phone: string;
  full_name: string;
  description: string;
}

export function Drawer({ isOpen, onClose, product }: DrawerProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    phone: "",
    full_name: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSuccess(false);

    // Валидация
    if (!formData.phone.trim() || !formData.full_name.trim()) {
      setError("Пожалуйста, заполните телефон и ФИО");
      return;
    }

    if (!product) {
      setError("Товар не найден");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
        phone: formData.phone,
        full_name: formData.full_name,
        description: formData.description || "",
        product_id: product.id
      });

      setIsSuccess(true);
      setFormData({
        phone: "",
        full_name: "",
        description: ""
      });

      // Закрыть drawer через 2 секунды после успешного заказа
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 2000);

    } catch (error) {
      console.error("Ошибка создания заказа:", error);
      //@ts-ignore
      setError(error.response?.data?.message || "Ошибка при оформлении заказа. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Сброс состояния при закрытии
  const handleClose = () => {
    setFormData({
      phone: "",
      full_name: "",
      description: ""
    });
    setError("");
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-black/10 transition-colors"
              style={{ color: '#706233' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 md:p-8">
              {/* Success message */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-green-100 border border-green-400 text-green-700"
                >
                  ✅ Заказ успешно оформлен!
                </motion.div>
              )}

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-100 border border-red-400 text-red-700"
                >
                  ❌ {error}
                </motion.div>
              )}

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
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#706233' }}>
                    Дополнительная информация
                  </h3>
                  <p className="leading-relaxed" style={{ color: '#8B7355' }}>
                    {product.addition}
                  </p>
                </div>
              )}

              {/* Order Form */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: '#E1C78F' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#706233' }}>
                  Оформить заказ
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#706233' }}>
                      ФИО <span style={{ color: '#c62828' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Введите ваше полное имя"
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{
                        backgroundColor: '#E1C78F',
                        color: '#706233',
                        border: '1px solid transparent'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#B0926A')}
                      onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#706233' }}>
                      Телефон <span style={{ color: '#c62828' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+998 (XXX) XX-XX"
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{
                        backgroundColor: '#E1C78F',
                        color: '#706233',
                        border: '1px solid transparent'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#B0926A')}
                      onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#706233' }}>
                      Комментарий к заказу
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Дополнительные пожелания..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                      style={{
                        backgroundColor: '#E1C78F',
                        color: '#706233',
                        border: '1px solid transparent'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#B0926A')}
                      onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 py-3 rounded-xl font-medium"
                      style={{ backgroundColor: '#E1C78F', color: '#706233' }}
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl font-medium transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#706233', color: '#FAE7C9' }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Оформление...
                        </span>
                      ) : (
                        'Оформить заказ'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}