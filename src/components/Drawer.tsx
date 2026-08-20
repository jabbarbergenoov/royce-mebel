// Drawer.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Loader2, Check } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    title: string;
    category: string;
    price: string;
    imageUrl: string;
    description: string;
    addition?: string;
  } | null;
  onOrder?: (orderData: {
    full_name: string;
    phone: string;
    description?: string;
    product_id: number;
  }) => Promise<void>;
  isOrdering?: boolean;
  orderError?: string | null;
}

export function Drawer({ 
  isOpen, 
  onClose, 
  product, 
  onOrder,
  isOrdering = false,
  orderError = null
}: DrawerProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !onOrder) return;
    
    if (!fullName.trim()) {
      alert("Пожалуйста, введите ваше имя и фамилию");
      return;
    }
    
    if (!phone.trim()) {
      alert("Пожалуйста, введите ваш номер телефона");
      return;
    }
    
    if (phone.trim().length < 9) {
      alert("Введите полный номер телефона (например: +998901234567)");
      return;
    }

    try {
      await onOrder({
        full_name: fullName.trim(),
        phone: phone.trim(),
        description: description.trim() || undefined,
        product_id: product.id,
      });
      
      setOrderSuccess(true);
      
      // Сброс формы через 2 секунды
      setTimeout(() => {
        setOrderSuccess(false);
        setFullName("");
        setPhone("");
        setDescription("");
      }, 2000);
      
    } catch (error) {
      console.error("Ошибка заказа:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#FAE7C9] shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 md:p-8">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors"
              >
                <X size={24} className="text-[#706233]" />
              </button>

              {/* Product image */}
              <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
                <img
                  src={product.imageUrl || "/placeholder.jpg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product info */}
              <div className="mb-6">
                <span className="text-sm text-[#B0926A] font-medium">
                  {product.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-[#706233] mt-1">
                  {product.title}
                </h2>
                <p className="text-xl font-semibold text-[#706233] mt-2">
                  {product.price}
                </p>
                <p className="text-[#8B7A6A] mt-3 leading-relaxed">
                  {product.description}
                </p>
                {product.addition && (
                  <p className="text-sm text-[#B0926A] mt-2 italic">
                    {product.addition}
                  </p>
                )}
              </div>

              {/* Order form */}
              <div className="border-t border-[#D4C5A0] pt-6">
                {orderSuccess ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Check size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-[#706233]">
                      Заказ успешно оформлен!
                    </h3>
                    <p className="text-[#8B7A6A] mt-2">
                      Мы свяжемся с вами в ближайшее время
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 className="text-lg font-semibold text-[#706233] mb-4">
                      Оформить заказ
                    </h3>
                    
                    {orderError && (
                      <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-600">{orderError}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#706233] mb-1">
                          Имя и фамилия *
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Алишер Каримов"
                          className="w-full px-4 py-2 rounded-lg border border-[#D4C5A0] focus:outline-none focus:ring-2 focus:ring-[#706233] bg-white/80"
                          disabled={isOrdering}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#706233] mb-1">
                          Номер телефона *
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+998 90 123 45 67"
                          className="w-full px-4 py-2 rounded-lg border border-[#D4C5A0] focus:outline-none focus:ring-2 focus:ring-[#706233] bg-white/80"
                          disabled={isOrdering}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#706233] mb-1">
                          Комментарий (необязательно)
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Дополнительная информация..."
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg border border-[#D4C5A0] focus:outline-none focus:ring-2 focus:ring-[#706233] bg-white/80 resize-none"
                          disabled={isOrdering}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isOrdering}
                        className="w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: "#706233",
                          color: "#FAE7C9",
                          opacity: isOrdering ? 0.7 : 1,
                          cursor: isOrdering ? "not-allowed" : "pointer",
                        }}
                      >
                        {isOrdering ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Оформление...
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={20} />
                            Заказать
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}