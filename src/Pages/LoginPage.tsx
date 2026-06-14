import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, CheckCircle, X } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    const payload = {
      login: formData.login,
      password: formData.password,
    };

    if (!payload.login || !payload.password) {
      setError("Заполните все поля");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, payload);

      console.log("Успешный вход:", data);
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refres_token);
      
      setShowSuccess(true);
      setTimeout(() => {
        // Перенаправление после успешного входа
        // window.location.href = "/dashboard";
      }, 1500);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Неверный логин или пароль";
      setError(errorMessage);
      
      // Анимация встряхивания формы при ошибке
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          if (formElement) formElement.style.animation = '';
        }, 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#FAE7C9" }} className="min-h-screen relative">
      {/* Анимация встряхивания */}
      <style jsx>{`
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
            <div className="flex items-center gap-3 px-6 py-3 rounded-full shadow-lg" style={{ backgroundColor: "#4caf50", color: "white" }}>
              <CheckCircle size={20} />
              <span>Успешный вход! Перенаправление...</span>
              <button onClick={() => setShowSuccess(false)} className="ml-2">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero секция с градиентом */}
      <section className="relative overflow-hidden py-20 px-6" style={{ backgroundColor: "#E1C78F" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full" style={{ backgroundColor: "#706233" }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full" style={{ backgroundColor: "#706233" }} />
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
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto" style={{ backgroundColor: "#706233" }}>
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
              Добро пожаловать назад
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#706233",
                lineHeight: "1.6",
                opacity: 0.9,
              }}
            >
              Войдите в свой аккаунт, чтобы продолжить
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
              <div className="mb-6">
                <label
                  htmlFor="login"
                  style={{ color: "#706233" }}
                  className="block text-sm font-semibold mb-2"
                >
                  Логин или Email
                </label>
                <div className="relative group">
                  <Mail
                    size={20}
                    style={{ color: "#706233" }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 group-focus-within:opacity-100 transition-opacity"
                  />
                  <input
                    type="text"
                    id="login"
                    name="login"
                    value={formData.login}
                    onChange={handleChange}
                    placeholder="Введите ваш логин"
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "#FAE7C9",
                      color: "#706233",
                      border: error && !formData.login ? "2px solid #c62828" : "2px solid transparent",
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

              <div className="mb-4">
                <label
                  htmlFor="password"
                  style={{ color: "#706233" }}
                  className="block text-sm font-semibold mb-2"
                >
                  Пароль
                </label>
                <div className="relative group">
                  <Lock
                    size={20}
                    style={{ color: "#706233" }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 group-focus-within:opacity-100 transition-opacity"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Введите ваш пароль"
                    className="w-full pl-10 pr-12 py-3 rounded-xl outline-none transition-all duration-200"
                    style={{
                      backgroundColor: "#FAE7C9",
                      color: "#706233",
                      border: error && !formData.password ? "2px solid #c62828" : "2px solid transparent",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#B0926A";
                    }}
                    onBlur={(e) => {
                      if (!error) e.target.style.borderColor = "transparent";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  >
                    {showPassword ? (
                      <EyeOff size={20} style={{ color: "#706233" }} />
                    ) : (
                      <Eye size={20} style={{ color: "#706233" }} />
                    )}
                  </button>
                </div>
              </div>

             

              {/* Ошибка с иконкой */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mb-6 p-3 rounded-xl flex items-center gap-2"
                    style={{ backgroundColor: "#ffebee", border: "1px solid #ef9a9a" }}
                  >
                    <AlertCircle size={18} style={{ color: "#c62828" }} />
                    <p className="text-sm" style={{ color: "#c62828" }}>
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden group"
                style={{
                  backgroundColor: "#706233",
                  color: "#FAE7C9",
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 rounded-full animate-spin border-2 border-white border-t-transparent" />
                      Вход...
                    </>
                  ) : (
                    <>
                      Войти
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
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
              <div className="w-12 h-1 rounded-full" style={{ backgroundColor: "#E1C78F" }} />
              <div className="w-12 h-1 rounded-full" style={{ backgroundColor: "#B0926A" }} />
              <div className="w-12 h-1 rounded-full" style={{ backgroundColor: "#E1C78F" }} />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}