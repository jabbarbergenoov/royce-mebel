import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#FAE7C9' }}>
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{ backgroundColor: '#E1C78F', opacity: 0.5, top: '-10%', right: '-5%' }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full"
          style={{ backgroundColor: '#B0926A', opacity: 0.3, bottom: '-10%', left: '-5%' }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            className="mb-6"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: '700',
              color: '#706233',
              lineHeight: '1.1'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            ELEGANCE
            <br />
            <span style={{ color: '#B0926A' }}>& COMFORT</span>
          </motion.h1>

          <motion.p
            className="mb-12 max-w-2xl mx-auto"
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
              color: '#706233',
              opacity: 0.8
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Создаём мебель, которая превращает дом в произведение искусства
          </motion.p>

          <motion.button
            className="px-10 py-4 rounded-full transition-all hover:scale-105"
            style={{
              backgroundColor: '#706233',
              color: '#FAE7C9',
              fontSize: '1.1rem',
              fontWeight: '500'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ backgroundColor: '#B0926A' }}
          >
            Смотреть каталог
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={32} color="#706233" />
      </motion.div>
    </section>
  );
}
