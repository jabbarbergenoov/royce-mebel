import { motion } from "motion/react";
import { Menu, User, LogOut, ShoppingBag, Package, Heart, File, ShoppingBasket } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  const checkAuth = () => {
    const accessToken = localStorage.getItem("accessToken");
    setIsAuthenticated(!!accessToken);
  };

  useEffect(() => {
    checkAuth();

    // Слушаем изменения в localStorage (для других вкладок)
    window.addEventListener("storage", checkAuth);

    // Слушаем кастомное событие для обновления в том же окне
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  // Обновляем состояние при изменении маршрута (если нужно)
  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    
    // Диспатчим событие для обновления других компонентов
    window.dispatchEvent(new Event("authChange"));
    
    window.location.href = "/";
  };

  const baseMenuItems = [
    { label: "Главная", path: "/" },
    { label: "О нас", path: "/about" },
    { label: "Достижения", path: "/achievements" }
  ];

  const authMenuItems = [
    { label: "Каталог", path: "/catalog", icon: ShoppingBag },
    { label: "Товары", path: "/products", icon: Package },
    { label: "Документы", path: "/documents", icon: File },
    { label: "Заказы", path: "/orders", icon: ShoppingBasket }
  ];

  const getMenuItems = () => {
    if (isAuthenticated) {
      return [...baseMenuItems, ...authMenuItems];
    }
    return baseMenuItems;
  };

  const menuItems = getMenuItems();

  const renderAuthButton = () => {
    if (isAuthenticated) {
      return (
        <motion.div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(112, 98, 51, 0.1)' }}>
            <User size={18} color="#706233" />
            <span style={{ color: '#706233', fontSize: '0.9rem' }}>
              Аккаунт
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{ backgroundColor: '#706233', color: '#FAE7C9' }}
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Выйти</span>
          </motion.button>
        </motion.div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: '#706233', color: '#FAE7C9' }}
          >
            Войти
          </motion.button>
        </Link>
      </div>
    );
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      style={{ backgroundColor: 'rgba(250, 231, 201, 0.95)', backdropFilter: 'blur(10px)' }}
    >
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#706233',
              cursor: 'pointer'
            }}
          >
            Royce Mebel
          </motion.div>
        </Link>

        <nav className="hidden md:flex gap-8">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path}>
              <motion.div
                whileHover={{ y: -2 }}
                style={{
                  color: '#706233',
                  fontSize: '1rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  borderBottom: location.pathname === item.path ? '2px solid #706233' : 'none',
                  paddingBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                className="transition-colors hover:opacity-70"
              >
                {
                //@ts-ignore
                item.icon && <item.icon size={16} />}
                {item.label}
              </motion.div>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {renderAuthButton()}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={28} color="#706233" />
          </motion.button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-4 py-4 border-t"
          style={{ borderColor: 'rgba(112, 98, 51, 0.2)' }}
        >
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path} onClick={() => setIsMenuOpen(false)}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="block py-3 flex items-center gap-2"
                style={{
                  color: '#706233',
                  fontSize: '1rem',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                {
                //@ts-ignore
                item.icon && <item.icon size={18} />}
                {item.label}
              </motion.div>
            </Link>
          ))}
          
          {isAuthenticated && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(112, 98, 51, 0.2)' }}>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg w-full"
                style={{ backgroundColor: '#706233', color: '#FAE7C9' }}
              >
                <LogOut size={18} />
                Выйти из аккаунта
              </button>
            </div>
          )}
        </motion.div>
      )}
    </motion.header>
  );
}