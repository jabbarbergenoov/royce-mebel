import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  X,
  Send,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const navigate = useNavigate();
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Таймер для повторной отправки кода
  useEffect(() => {
    if (timer > 0) {
      timerInterval.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    }
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Удаляем все не цифры, но сохраняем +
      const cleanValue = value.replace(/[^0-9+]/g, "");
      // Если есть +, оставляем его только в начале
      let formattedValue = cleanValue;
      if (formattedValue.startsWith('+')) {
        formattedValue = '+' + formattedValue.replace(/\+/g, '');
      } else {
        formattedValue = formattedValue.replace(/\+/g, '');
      }
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name === "otp") {
      const cleanValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  // Функция для форматирования телефона с +
  const formatPhoneWithPlus = (phone: string): string => {
    if (!phone) return "";
    // Если уже есть +, возвращаем как есть
    if (phone.startsWith('+')) return phone;
    // Если номер начинается с 998, добавляем +
    if (phone.startsWith('998')) return `+${phone}`;
    // Иначе просто добавляем +
    return `+${phone}`;
  };

  // Отправка OTP на номер телефона
  const handleSendOtp = async () => {
    // Удаляем все не цифры для валидации
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    const phoneRegex = /^[0-9]{9,13}$/;
    
    if (!cleanPhone) {
      setError("Телефон номерингизни киритинг");
      return;
    }
    if (!phoneRegex.test(cleanPhone)) {
      setError("Телефон номерини тўғри киритинг (масалан: 998901234567)");
      return;
    }

    setIsSendingOtp(true);
    setError("");

    // Форматируем телефон с +
    const phoneWithPlus = formatPhoneWithPlus(cleanPhone);
    console.log("📱 Отправка OTP на номер:", phoneWithPlus);

    try {
      await axios.post(
        `${API_URL}/auth/send-otp`,
        {
          phone: phoneWithPlus,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setTimer(60);
      setIsResendDisabled(true);
      setError("");
      
    } catch (error: any) {
      console.error("❌ Ошибка отправки OTP:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || "Код юборишда хатолик юз берди";
      setError(errorMessage);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Вход с OTP кодом
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Удаляем все не цифры для валидации
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    const phoneRegex = /^[0-9]{9,13}$/;
    
    if (!cleanPhone) {
      setError("Телефон номерингизни киритинг");
      return;
    }
    if (!phoneRegex.test(cleanPhone)) {
      setError("Телефон номерини тўғри киритинг");
      return;
    }

    if (!formData.otp.trim()) {
      setError("Кодни киритинг");
      return;
    }
    if (formData.otp.trim().length < 4) {
      setError("Код 4 ёки 6 рақамдан иборат бўлиши керак");
      return;
    }

    setIsLoading(true);
    setError("");

    // Форматируем телефон с +
    const phoneWithPlus = formatPhoneWithPlus(cleanPhone);
    console.log("🔑 Вход с номером:", phoneWithPlus, "и кодом:", formData.otp);

    try {
      const { data } = await axios.post(
        `${API_URL}/auth/login`,
        {
          phone: phoneWithPlus,
          otp: formData.otp.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("✅ Успешный вход:", data);
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refres_token);
      localStorage.setItem("userRole", data.role || "user");

      const userData = {
        phone: phoneWithPlus,
        role: data.role || "user"
      };
      localStorage.setItem("user", JSON.stringify(userData));

      window.dispatchEvent(new Event("authChange"));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'accessToken',
        newValue: data.access_token,
      }));

      setShowSuccess(true);
      setTimeout(() => {
        navigate({ to: "/catalog" });
      }, 1500);
    } catch (error: any) {
      console.error("❌ Ошибка входа:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || "Код нотўғри ёки эскирган";
      setError(errorMessage);

      const formElement = document.querySelector("form");
      if (formElement) {
        formElement.style.animation = "shake 0.5s ease-in-out";
        setTimeout(() => {
          if (formElement) formElement.style.animation = "";
        }, 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Повторная отправка OTP
  const handleResendOtp = async () => {
    if (isResendDisabled) return;
    
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      setError("Телефон номерингизни киритинг");
      return;
    }
    
    setIsSendingOtp(true);
    setError("");
    
    const phoneWithPlus = formatPhoneWithPlus(cleanPhone);
    
    try {
      await axios.post(
        `${API_URL}/auth/send-otp`,
        {
          phone: phoneWithPlus,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setTimer(60);
      setIsResendDisabled(true);
      setError("");
      
    } catch (error: any) {
      console.error("❌ Ошибка повторной отправки OTP:", error);
      setError(error.response?.data?.message || error.response?.data?.detail || "Код қайта юборишда хатолик");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Переход на страницу регистрации
  const goToRegister = () => {
    navigate({ to: '/register' });
  };

  // Открыть Telegram бота
  const openTelegramBot = () => {
    window.open('https://t.me/medicine_reminderx_bot', '_blank');
  };

  return (
    <div
      style={{ backgroundColor: "#FAE7C9" }}
      className="min-h-screen relative"
    >
      <style
        //@ts-ignore
        jsx
      >{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>

      {/* Уведомление об успехе */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50"
          >
            <div
              className="flex items-center gap-3 px-6 py-3 rounded-full shadow-lg"
              style={{ backgroundColor: "#4caf50", color: "white" }}
            >
              <CheckCircle size={20} />
              <span>Успешный вход! Перенаправление...</span>
              <button onClick={() => setShowSuccess(false)} className="ml-2">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero секция */}
      <section
        className="relative overflow-hidden py-20 px-6"
        style={{ backgroundColor: "#E1C78F" }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-64 h-64 rounded-full"
            style={{ backgroundColor: "#706233" }}
          />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
            style={{ backgroundColor: "#706233" }}
          />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
                style={{ backgroundColor: "#706233" }}
              >
                <Lock size={36} color="#FAE7C9" />
              </div>
            </motion.div>

            <h1
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: "700",
                color: "#706233",
                marginBottom: "1rem",
              }}
            >
              Добро пожаловать
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#706233",
                lineHeight: "1.6",
                opacity: 0.9,
              }}
            >
              Телефон рақамингизга код юборамиз
            </p>
          </motion.div>
        </div>
      </section>

      {/* Форма логина */}
      <section className="py-16 px-6" style={{ backgroundColor: "#FAE7C9" }}>
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl p-8 shadow-xl"
            style={{ backgroundColor: "#E1C78F" }}
          >
            <form onSubmit={handleSubmit}>
              {/* Телефон номер */}
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  style={{ color: "#706233" }}
                  className="block text-sm font-semibold mb-2"
                >
                  Телефон рақам
                </label>
                <div className="relative group">
                  <Phone
                    size={20}
                    style={{ color: "#706233" }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 group-focus-within:opacity-100 transition-opacity"
                  />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+998901234567"
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "#FAE7C9",
                      color: "#706233",
                      border: error && !formData.phone
                        ? "2px solid #c62828"
                        : "2px solid transparent",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#B0926A";
                    }}
                    onBlur={(e) => {
                      if (!error) e.target.style.borderColor = "transparent";
                    }}
                  />
                </div>
              </div>

              {/* OTP код */}
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  style={{ color: "#706233" }}
                  className="block text-sm font-semibold mb-2 flex items-center justify-between"
                >
                  <span>Код</span>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isResendDisabled || isSendingOtp || !formData.phone}
                    className="flex items-center gap-1 text-xs font-medium hover:underline transition-all"
                    style={{ 
                      color: isResendDisabled || !formData.phone ? "#706233" : "#706233",
                      opacity: isResendDisabled || !formData.phone ? 0.4 : 0.8,
                      cursor: isResendDisabled || !formData.phone ? "not-allowed" : "pointer",
                    }}
                  >
                    <Send size={14} />
                    {isResendDisabled ? `${timer}с` : isSendingOtp ? "Юбориляпти..." : "Код олиш"}
                  </button>
                </label>
                <div className="relative group">
                  <Lock
                    size={20}
                    style={{ color: "#706233" }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 group-focus-within:opacity-100 transition-opacity"
                  />
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Кодни киритинг"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-200 text-center tracking-[0.3rem] text-lg"
                    style={{
                      backgroundColor: "#FAE7C9",
                      color: "#706233",
                      border: error && !formData.otp
                        ? "2px solid #c62828"
                        : "2px solid transparent",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#B0926A";
                    }}
                    onBlur={(e) => {
                      if (!error) e.target.style.borderColor = "transparent";
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={openTelegramBot}
                    className="flex items-center gap-1 text-xs hover:underline transition-all"
                    style={{ color: "#706233", opacity: 0.6 }}
                  >
                    <MessageCircle size={14} />
                    @medicine_reminderx_bot
                  </button>
                  <span style={{ color: "#706233", opacity: 0.3 }}>|</span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendDisabled || isSendingOtp}
                    className="flex items-center gap-1 text-xs hover:underline transition-all"
                    style={{ 
                      color: isResendDisabled ? "#706233" : "#706233",
                      opacity: isResendDisabled ? 0.3 : 0.6,
                      cursor: isResendDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    <RefreshCw size={12} className={isSendingOtp ? "animate-spin" : ""} />
                    {isResendDisabled ? `Қайта юбориш (${timer}с)` : "Қайта юбориш"}
                  </button>
                </div>
              </div>

              {/* Ошибка */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mb-6 p-3 rounded-xl flex items-center gap-2"
                    style={{
                      backgroundColor: "#ffebee",
                      border: "1px solid #ef9a9a",
                    }}
                  >
                    <AlertCircle size={18} style={{ color: "#c62828" }} />
                    <p className="text-sm" style={{ color: "#c62828" }}>
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Кнопка входа */}
              <motion.button
                type="submit"
                disabled={isLoading || isSendingOtp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden group"
                style={{
                  backgroundColor: "#706233",
                  color: "#FAE7C9",
                  opacity: (isLoading || isSendingOtp) ? 0.7 : 1,
                  cursor: (isLoading || isSendingOtp) ? "not-allowed" : "pointer",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 rounded-full animate-spin border-2 border-white border-t-transparent" />
                      Текшириляпти...
                    </>
                  ) : (
                    <>
                      Кириш
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>

              {/* Переход на регистрацию */}
              <div className="mt-4 text-center">
                <p className="text-sm" style={{ color: "#706233", opacity: 0.7 }}>
                  Аккаунтингиз йўқми?
                </p>
                <button
                  type="button"
                  onClick={goToRegister}
                  className="mt-1 text-sm font-semibold hover:underline transition-all"
                  style={{ color: "#706233" }}
                >
                  Рўйхатдан ўтиш →
                </button>
              </div>
            </form>
          </motion.div>

          {/* Декоративные элементы */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="flex justify-center gap-4">
              <div
                className="w-12 h-1 rounded-full"
                style={{ backgroundColor: "#E1C78F" }}
              />
              <div
                className="w-12 h-1 rounded-full"
                style={{ backgroundColor: "#B0926A" }}
              />
              <div
                className="w-12 h-1 rounded-full"
                style={{ backgroundColor: "#E1C78F" }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}