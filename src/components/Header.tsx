import { motion } from "motion/react";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: "Главная", path: "/" },
    { label: "О нас", path: "/about" },
    { label: "Достижений и Связаться", path: "/achievements" }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      style={{ backgroundColor: 'rgba(250, 231, 201, 0.95)', backdropFilter: 'blur(10px)' }}
    >
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#706233'
          }}
        >
          Royce Mebel
        </motion.div>

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
                  paddingBottom: '4px'
                }}
                className="transition-colors hover:opacity-70"
              >
                {item.label}
              </motion.div>
            </Link>
          ))}
        </nav>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={28} color="#706233" />
        </motion.button>
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
                className="block py-3"
                style={{
                  color: '#706233',
                  fontSize: '1rem',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                {item.label}
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
