import { motion } from "motion/react";
import { 
  Menu, 
  User, 
  LogOut, 
  ShoppingBag, 
  Package, 
  Heart, 
  File, 
  ShoppingBasket, 
  Bot,
  Home,
  Info,
  Trophy,
  LayoutGrid,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const checkAuth = () => {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole") || localStorage.getItem("role");
    setIsAuthenticated(!!accessToken);
    setUserRole(role);
  };

  useEffect(() => {
    checkAuth();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserRole(null);
    window.dispatchEvent(new Event("authChange"));
    window.location.href = "/";
  };

  // Базовые пункты меню
  const baseMenuItems = [
    { label: "Главная", path: "/", icon: Home },
    { label: "О нас", path: "/about", icon: Info },
    { label: "Достижения", path: "/achievements", icon: Trophy }
  ];

  // Пункты для авторизованных
  const authMenuItems = [
    { label: "Каталог", path: "/catalog", icon: LayoutGrid },
    { label: "Товары", path: "/products", icon: Package },
    { label: "Документы", path: "/documents", icon: File },
    { label: "Заказы", path: "/orders", icon: ShoppingBasket }
  ];

  const getMenuItems = () => {
    if (!isAuthenticated) {
      return baseMenuItems;
    }

    let items = [...baseMenuItems, ...authMenuItems];

    if (userRole === 'superAdmin' || userRole === 'superadmin' || userRole === 'user') {
      items = [...items, { 
        label: "Chat-bot", 
        path: "/chat-bot", 
        icon: Bot 
      }];
    }

    return items;
  };

  const menuItems = getMenuItems();
  const isSuperAdmin = userRole === 'superAdmin' || userRole === 'superadmin';

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'py-3 shadow-lg' 
            : 'py-5'
        }`}
        style={{
          backgroundColor: scrolled 
            ? 'rgba(250, 231, 201, 0.97)' 
            : 'rgba(250, 231, 201, 0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled 
            ? '1px solid rgba(112, 98, 51, 0.15)' 
            : '1px solid transparent'
        }}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between">
          {/* Логотип */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col leading-none cursor-pointer select-none"
            >
              <span 
                style={{ 
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                  fontWeight: '800',
                  color: '#706233',
                  letterSpacing: '-0.02em'
                }}
              >
                Royce
              </span>
              <span 
                style={{ 
                  fontSize: 'clamp(0.55rem, 0.8vw, 0.7rem)',
                  fontWeight: '500',
                  color: '#8B7A5A',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  marginTop: '-2px'
                }}
              >
                Mebel
              </span>
            </motion.div>
          </Link>

          {/* Десктоп навигация */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      active 
                        ? 'bg-[#706233] text-[#FAE7C9] shadow-md' 
                        : 'text-[#706233] hover:bg-[#706233]/10'
                    }`}
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: active ? '600' : '500',
                    }}
                  >
                    <Icon size={18} className={active ? 'text-[#FAE7C9]' : 'text-[#706233]'} />
                    {item.label}
                    {item.label === "Chat-bot" && (
                      <span className="ml-1 text-xs">🤖</span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Правая часть */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div 
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ 
                    backgroundColor: isSuperAdmin 
                      ? 'rgba(112, 98, 51, 0.15)' 
                      : 'rgba(112, 98, 51, 0.08)'
                  }}
                >
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: isSuperAdmin ? '#706233' : '#8B7A5A',
                      color: '#FAE7C9'
                    }}
                  >
                    {isSuperAdmin ? 'SA' : 'U'}
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: '#706233' }}
                  >
                    {isSuperAdmin ? 'Super Admin' : 'Пользователь'}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: '#706233',
                    color: '#FAE7C9'
                  }}
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline text-sm font-medium">Выйти</span>
                </motion.button>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-xl font-medium transition-all duration-200"
                  style={{
                    backgroundColor: '#706233',
                    color: '#FAE7C9'
                  }}
                >
                  Войти
                </motion.button>
              </Link>
            )}

            {/* Бургер меню */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2 rounded-xl hover:bg-[#706233]/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X size={28} color="#706233" />
              ) : (
                <Menu size={28} color="#706233" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Мобильное меню */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
        className={`lg:hidden fixed top-[72px] left-0 right-0 z-40 overflow-hidden ${
          isMenuOpen ? 'border-b' : ''
        }`}
        style={{
          backgroundColor: 'rgba(250, 231, 201, 0.98)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(112, 98, 51, 0.1)'
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={item.path} onClick={() => setIsMenuOpen(false)}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        active 
                          ? 'bg-[#706233] text-[#FAE7C9]' 
                          : 'text-[#706233] hover:bg-[#706233]/5'
                      }`}
                    >
                      <Icon size={20} className={active ? 'text-[#FAE7C9]' : 'text-[#706233]'} />
                      <span className="font-medium text-base">{item.label}</span>
                      {item.label === "Chat-bot" && (
                        <span className="ml-auto text-sm">🤖</span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {/* Мобильный профиль */}
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 pt-4 border-t"
                style={{ borderColor: 'rgba(112, 98, 51, 0.1)' }}
              >
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: isSuperAdmin ? '#706233' : '#8B7A5A',
                      color: '#FAE7C9'
                    }}
                  >
                    {isSuperAdmin ? 'SA' : 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-[#706233]">
                      {isSuperAdmin ? 'Super Admin' : 'Пользователь'}
                    </div>
                    <div className="text-xs text-[#8B7A5A]">
                      {isSuperAdmin ? '👑 Полный доступ' : '🔐 Авторизован'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 rounded-xl font-medium transition-all duration-200"
                  style={{
                    backgroundColor: '#706233',
                    color: '#FAE7C9'
                  }}
                >
                  <LogOut size={18} />
                  Выйти
                </button>
              </motion.div>
            )}

            {/* Кнопка входа для мобильных */}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 pt-4 border-t"
                style={{ borderColor: 'rgba(112, 98, 51, 0.1)' }}
              >
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200"
                    style={{
                      backgroundColor: '#706233',
                      color: '#FAE7C9'
                    }}
                  >
                    <User size={18} />
                    Войти
                  </button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}