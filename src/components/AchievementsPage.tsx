import { motion } from "motion/react";
import { TrendingUp, Users, Star, Phone, Mail, MapPin, Navigation } from "lucide-react";

export function Achievements() {
  const stats = [
    { number: "20+", label: "Лет на рынке", icon: TrendingUp },
    { number: "10,000+", label: "Довольных клиентов", icon: Users },
    { number: "95%", label: "Положительных отзывов", icon: Star }
  ];

  const lat = 43.063086;
  const lng = 58.852289;

  return (
    <div style={{ backgroundColor: '#FAE7C9' }}>
      <section className="py-32 px-6" style={{ backgroundColor: '#706233' }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 style={{
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: '700',
              color: '#FAE7C9',
              marginBottom: '2rem'
            }}>
              Наши достижения
            </h1>
            <p style={{
              fontSize: '1.3rem',
              color: '#E1C78F',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.7'
            }}>
              22 лет упорного труда, инноваций и стремления к совершенству.
              Каждая награда — это признание нашей работы и доверие наших клиентов.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Статистика */}
      <section className="py-24 px-6" style={{ backgroundColor: '#FAE7C9' }}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center p-8 rounded-3xl"
                style={{ backgroundColor: '#E1C78F' }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#706233' }}
                >
                  <stat.icon size={32} color="#FAE7C9" />
                </div>
                <div style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: '700',
                  color: '#706233',
                  marginBottom: '0.5rem'
                }}>
                  {stat.number}
                </div>
                <div style={{ color: '#706233', fontSize: '1rem', opacity: 0.8 }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Контакты и карта */}
      <section className="py-24 px-6" style={{ backgroundColor: '#706233' }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '700',
              color: '#FAE7C9',
              marginBottom: '1rem'
            }}>
              Связаться с нами
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#E1C78F',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Мы всегда рады ответить на ваши вопросы и помочь с выбором
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Контактная информация */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ backgroundColor: '#E1C78F' }}>
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#706233' }}>
                  <Phone size={24} color="#FAE7C9" />
                </div>
                <div>
                  <h3 style={{ color: '#706233', fontWeight: '600', marginBottom: '0.25rem' }}>Телефон</h3>
                  <a href="tel:+998912674773" style={{ color: '#706233', opacity: 0.8, textDecoration: 'none' }}>
                     +998 91 267 47 73
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ backgroundColor: '#E1C78F' }}>
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#706233' }}>
                  <Mail size={24} color="#FAE7C9" />
                </div>
                <div>
                  <h3 style={{ color: '#706233', fontWeight: '600', marginBottom: '0.25rem' }}>Email</h3>
                  <a href="mailto:samandarurinbaev1@gmail.com" style={{ color: '#706233', opacity: 0.8, textDecoration: 'none' }}>
                    "samandarurinbaev1@gmail.com"
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl" style={{ backgroundColor: '#E1C78F' }}>
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#706233' }}>
                  <MapPin size={24} color="#FAE7C9" />
                </div>
                <div>
                  <h3 style={{ color: '#706233', fontWeight: '600', marginBottom: '0.25rem' }}>Адрес</h3>
                  <p style={{ color: '#706233', opacity: 0.8 }}>
                    43°03'47.1"N 58°51'08.2"E
                  </p>
                  <p style={{ color: '#706233', opacity: 0.7, fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Республика Каракалпакстан, г. Кунград
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Карта с маркером */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  src={`https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Карта с расположением офиса"
                ></iframe>
              </div>
              <div className="p-4 text-center" style={{ backgroundColor: '#E1C78F' }}>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#ef4444' }}></div>
                  <p style={{ color: '#706233', fontWeight: '500', fontSize: '0.9rem' }}>
                    📍 Мы находимся здесь (красная метка)
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Кнопка открыть карту */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <a
              href={`https://www.google.com/maps/place/${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: '#E1C78F', color: '#706233' }}
            >
              <Navigation size={20} />
              Построить маршрут
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}