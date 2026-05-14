// FurnitureCard.tsx
import { motion } from "motion/react";
import { ImageWithFallback } from "./ImageWithFalback";

interface FurnitureCardProps {
  title: string;
  category: string;
  price: string;
  imageUrl: string;
  description?: string;
  addition?: string;
  delay?: number;
  onOpenDrawer: (product: {
    title: string;
    category: string;
    price: string;
    imageUrl: string;
    description?: string;
    addition?: string;
  }) => void;
}

export function FurnitureCard({ 
  title, 
  category, 
  price, 
  imageUrl, 
  description, 
  addition, 
  delay = 0,
  onOpenDrawer 
}: FurnitureCardProps) {
  const handleOpenDrawer = () => {
    onOpenDrawer({ title, category, price, imageUrl, description, addition });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10 }}
      className="group cursor-pointer"
      onClick={handleOpenDrawer}
    >
      <motion.div
        className="rounded-2xl overflow-hidden mb-4 relative"
        style={{ backgroundColor: '#E1C78F' }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="aspect-square overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: 'rgba(112, 98, 51, 0.85)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDrawer();
            }}
            className="px-8 py-3 rounded-full"
            style={{ backgroundColor: '#FAE7C9', color: '#706233' }}
          >
            Подробнее
          </button>
        </motion.div>
      </motion.div>

      <div className="px-2">
        <p style={{ color: '#B0926A', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
          {category}
        </p>
        <h3 style={{ color: '#706233', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
          {title}
        </h3>
        <p style={{ color: '#706233', fontSize: '1.2rem', fontWeight: '600' }}>
          {price}
        </p>
      </div>
    </motion.div>
  );
}