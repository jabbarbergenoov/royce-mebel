import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="py-8 px-6" style={{ backgroundColor: '#706233' }}>
      <div className="container mx-auto max-w-7xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ color: '#E1C78F', fontSize: '0.95rem' }}
        >
          © 2026 FURNITURE. Все права защищены.
        </motion.p>
      </div>
    </footer>
  );
}
