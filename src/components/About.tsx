import { motion } from "motion/react";
import { Award, Users, Sparkles } from "lucide-react";

export function About() {
  const features = [
    {
      icon: Award,
      title: "Качество",
      description: "Используем только премиальные материалы европейских производителей"
    },
    {
      icon: Users,
      title: "Опыт",
      description: "Более 15 лет создаём мебель мечты для тысяч семей"
    },
    {
      icon: Sparkles,
      title: "Индивидуальность",
      description: "Каждое изделие создаётся с учётом ваших пожеланий"
    }
  ];

  return (
    <section className="py-24 px-6" style={{ backgroundColor: '#E1C78F' }}>
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              color: '#706233',
              marginBottom: '1.5rem'
            }}>
              О нашей компании
            </h2>
            <p style={{
              color: '#706233',
              fontSize: '1.1rem',
              lineHeight: '1.8',
              marginBottom: '2rem',
              opacity: 0.9
            }}>
              Мы создаём не просто мебель – мы создаём атмосферу уюта и комфорта в вашем доме.
              Каждая деталь продумана до мелочей, каждая линия стремится к совершенству.
            </p>
            <p style={{
              color: '#706233',
              fontSize: '1.1rem',
              lineHeight: '1.8',
              opacity: 0.9
            }}>
              Наша миссия – сделать качественную дизайнерскую мебель доступной для каждого,
              кто ценит красоту и функциональность.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                className="flex gap-6 p-6 rounded-2xl transition-colors"
                style={{ backgroundColor: '#FAE7C9' }}
              >
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#B0926A' }}
                >
                  <feature.icon size={32} color="#FAE7C9" />
                </div>
                <div>
                  <h3 style={{
                    color: '#706233',
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: '#706233', opacity: 0.8 }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
