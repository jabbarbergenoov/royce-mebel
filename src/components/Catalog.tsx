import { motion } from "motion/react";
import { FurnitureCard } from "./Cards/FurnitureCard";

export function Catalog() {
  const products = [
    {
      title: "Диван Скандинавия",
      category: "Мягкая мебель",
      price: "89 900 ₽",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop"
    },
    {
      title: "Кресло Комфорт",
      category: "Кресла",
      price: "34 500 ₽",
      imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=600&fit=crop"
    },
    {
      title: "Стол Минимализм",
      category: "Столы",
      price: "42 000 ₽",
      imageUrl: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=600&fit=crop"
    },
    {
      title: "Шкаф Элегант",
      category: "Шкафы",
      price: "67 800 ₽",
      imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=600&fit=crop"
    },
    {
      title: "Кровать Люкс",
      category: "Спальня",
      price: "95 000 ₽",
      imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=600&fit=crop"
    },
    {
      title: "Тумба Прованс",
      category: "Аксессуары",
      price: "18 900 ₽",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop"
    }
  ];

  return (
    <section className="py-24 px-6" style={{ backgroundColor: '#FAE7C9' }}>
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '700',
            color: '#706233',
            marginBottom: '1rem'
          }}>
            Наша коллекция
          </h2>
          <p style={{ color: '#B0926A', fontSize: '1.2rem' }}>
            Эксклюзивные решения для вашего дома
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <FurnitureCard
              key={index}
              {...product}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
