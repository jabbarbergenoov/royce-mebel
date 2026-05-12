import { motion } from "motion/react";
import { Target, Heart, Lightbulb, Users } from "lucide-react";

export function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Наша миссия",
      description: "Создавать мебель, которая объединяет эстетику, комфорт и функциональность, делая качественный дизайн доступным для каждого дома."
    },
    {
      icon: Heart,
      title: "Наши ценности",
      description: "Качество материалов, внимание к деталям, забота о клиентах и стремление к совершенству в каждом изделии."
    },
    {
      icon: Lightbulb,
      title: "Инновации",
      description: "Мы постоянно исследуем новые материалы и технологии, чтобы создавать мебель будущего уже сегодня."
    },
    {
      icon: Users,
      title: "Команда",
      description: "Более 50 профессионалов: дизайнеры, мастера, технологи — все влюблены в своё дело и работают для вас."
    }
  ];

  const timeline = [
    { year: "2010", event: "Основание компании", description: "Начало пути с небольшой мастерской" },
    { year: "2013", event: "Первая коллекция", description: "Запуск линейки премиальной мебели" },
    { year: "2016", event: "Расширение производства", description: "Открытие собственной фабрики" },
    { year: "2020", event: "Международное признание", description: "Награды на выставках в Милане" },
    { year: "2023", event: "Экологичное производство", description: "Переход на sustainable материалы" },
    { year: "2026", event: "Сегодня", description: "Лидер рынка премиальной мебели" }
  ];

  return (
    <div style={{ backgroundColor: '#FAE7C9' }}>
      <section className="py-32 px-6" style={{ backgroundColor: '#E1C78F' }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 style={{
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: '700',
              color: '#706233',
              marginBottom: '2rem'
            }}>
              О нас
            </h1>
            <p style={{
              fontSize: '1.3rem',
              color: '#706233',
              lineHeight: '1.8',
              opacity: 0.9
            }}>
              Мы — команда профессионалов, объединённых любовью к дизайну и стремлением создавать
              пространства, где каждый чувствует себя как дома.
            </p>
          </motion.div>
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
            Наши принципы
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-3xl"
                style={{ backgroundColor: '#E1C78F' }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: '#706233' }}
                >
                  <value.icon size={36} color="#FAE7C9" />
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  color: '#706233',
                  marginBottom: '1rem'
                }}>
                  {value.title}
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#706233',
                  lineHeight: '1.7',
                  opacity: 0.9
                }}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ backgroundColor: '#B0926A' }}>
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              color: '#FAE7C9'
            }}
          >
            История развития
          </motion.h2>

          <div className="relative">
            <div
              className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2"
              style={{ backgroundColor: '#E1C78F' }}
            />

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative mb-16 ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2'}`}
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:ml-0 md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                  <div
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: '#FAE7C9' }}
                  >
                    <div
                      className="inline-block px-4 py-2 rounded-full mb-3"
                      style={{ backgroundColor: '#706233', color: '#FAE7C9', fontSize: '1.2rem', fontWeight: '700' }}
                    >
                      {item.year}
                    </div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: '#706233',
                      marginBottom: '0.5rem'
                    }}>
                      {item.event}
                    </h3>
                    <p style={{ color: '#706233', opacity: 0.8 }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <div
                  className="absolute left-1/2 top-8 w-6 h-6 rounded-full -translate-x-1/2 hidden md:block"
                  style={{ backgroundColor: '#706233' }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ backgroundColor: '#706233' }}>
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              color: '#FAE7C9',
              marginBottom: '2rem'
            }}>
              Создаём будущее вместе
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#E1C78F',
              lineHeight: '1.8',
              marginBottom: '3rem'
            }}>
              Каждый день мы работаем над тем, чтобы сделать ваш дом уютнее,
              а жизнь — комфортнее. Спасибо, что выбираете нас!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-full"
              style={{
                backgroundColor: '#B0926A',
                color: '#FAE7C9',
                fontSize: '1.1rem',
                fontWeight: '500'
              }}
            >
              Связаться с нами
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
