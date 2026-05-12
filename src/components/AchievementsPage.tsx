import { motion } from "motion/react";
import { Award, TrendingUp, Users, Star, Globe, Leaf } from "lucide-react";

export function Achievements() {
  const stats = [
    { number: "15+", label: "Лет на рынке", icon: TrendingUp },
    { number: "10,000+", label: "Довольных клиентов", icon: Users },
    { number: "50+", label: "Наград и премий", icon: Award },
    { number: "95%", label: "Положительных отзывов", icon: Star }
  ];

  const awards = [
    {
      year: "2025",
      title: "Best Furniture Design Award",
      organization: "Milan Design Week",
      description: "Гран-при за инновационный подход к дизайну мебели"
    },
    {
      year: "2024",
      title: "Eco-Friendly Production",
      organization: "Green Business Awards",
      description: "Награда за переход на экологичное производство"
    },
    {
      year: "2023",
      title: "Customer Choice Award",
      organization: "Interior Design Magazine",
      description: "Выбор покупателей в категории премиальная мебель"
    },
    {
      year: "2022",
      title: "Innovation in Manufacturing",
      organization: "Industry Tech Summit",
      description: "За внедрение современных технологий производства"
    },
    {
      year: "2021",
      title: "Best Furniture Brand",
      organization: "Design Excellence Awards",
      description: "Лучший бренд года в категории мебель для дома"
    },
    {
      year: "2020",
      title: "Quality & Craftsmanship",
      organization: "Master Artisans Guild",
      description: "За высочайшее качество исполнения и мастерство"
    }
  ];

  const certifications = [
    {
      icon: Leaf,
      title: "FSC Сертификация",
      description: "Использование древесины из ответственных источников"
    },
    {
      icon: Globe,
      title: "ISO 9001",
      description: "Международный стандарт системы менеджмента качества"
    },
    {
      icon: Star,
      title: "European Quality",
      description: "Соответствие европейским стандартам качества"
    }
  ];

  const achievements = [
    {
      title: "Первый завод в России",
      description: "Запустили первое полностью автоматизированное производство мебели премиум-класса"
    },
    {
      title: "Экспорт в 15 стран",
      description: "Наша мебель украшает дома по всему миру — от Европы до Азии"
    },
    {
      title: "Собственная лаборатория",
      description: "Разработка инновационных материалов и технологий производства"
    },
    {
      title: "Zero Waste к 2028",
      description: "Стремимся к полному отказу от отходов в производстве"
    }
  ];

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
              15 лет упорного труда, инноваций и стремления к совершенству.
              Каждая награда — это признание нашей работы и доверие наших клиентов.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ backgroundColor: '#FAE7C9' }}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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

      <section className="py-24 px-6" style={{ backgroundColor: '#B0926A' }}>
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              color: '#FAE7C9'
            }}
          >
            Награды и признание
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="p-8 rounded-3xl"
                style={{ backgroundColor: '#FAE7C9' }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#706233' }}
                  >
                    <Award size={24} color="#FAE7C9" />
                  </div>
                  <div
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#E1C78F', color: '#706233', fontSize: '0.9rem', fontWeight: '600' }}
                  >
                    {award.year}
                  </div>
                </div>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  color: '#706233',
                  marginBottom: '0.5rem'
                }}>
                  {award.title}
                </h3>
                <p style={{
                  color: '#B0926A',
                  fontSize: '0.95rem',
                  marginBottom: '0.75rem',
                  fontWeight: '500'
                }}>
                  {award.organization}
                </p>
                <p style={{ color: '#706233', fontSize: '1rem', opacity: 0.8, lineHeight: '1.6' }}>
                  {award.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ backgroundColor: '#E1C78F' }}>
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              color: '#706233'
            }}
          >
            Сертификаты качества
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-8 rounded-3xl"
                style={{ backgroundColor: '#FAE7C9' }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#706233' }}
                >
                  <cert.icon size={36} color="#FAE7C9" />
                </div>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  color: '#706233',
                  marginBottom: '0.75rem'
                }}>
                  {cert.title}
                </h3>
                <p style={{ color: '#706233', opacity: 0.8, lineHeight: '1.6' }}>
                  {cert.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ backgroundColor: '#FAE7C9' }}>
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              color: '#706233'
            }}
          >
            Ключевые вехи
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-3xl"
                style={{ backgroundColor: '#E1C78F' }}
              >
                <div
                  className="w-3 h-3 rounded-full mb-4"
                  style={{ backgroundColor: '#706233' }}
                />
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#706233',
                  marginBottom: '0.75rem'
                }}>
                  {achievement.title}
                </h3>
                <p style={{
                  color: '#706233',
                  opacity: 0.8,
                  fontSize: '1.05rem',
                  lineHeight: '1.6'
                }}>
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
