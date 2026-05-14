import { motion } from "motion/react";
import { Phone, Mail, MapPin, Instagram, Facebook,  } from "lucide-react";

export function Contact() {
  const contactInfo = [
    { icon: Phone, text: "+998 91 267 47 73", label: "Телефон" },
    { icon: Phone, text: "+998 91 383 16 98", label: "Телефон" },
    { icon: Mail, text: "samandarurinbaev1@gmail.com", label: "Email" },
    { icon: MapPin, text: "Кунград район улица Улы туран 6-ой дом", label: "Адрес" }
  ];

  const socials = [
    { icon: Instagram, label: "Instagram", link: "https://www.instagram.com/royce_mebe1?igsh=N2lreXRvbmxoY2lk" },
    { icon: Facebook, label: "Telegram", link: "https://t.me/roycemebel" }
  ];

  

  return (
    <section className="py-24 px-6" style={{ backgroundColor: '#706233' }}>
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
            color: '#FAE7C9',
            marginBottom: '1rem'
          }}>
            Свяжитесь с нами
          </h2>
          <p style={{ color: '#E1C78F', fontSize: '1.2rem' }}>
            Мы готовы ответить на все ваши вопросы
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#B0926A' }}
                >
                  <item.icon size={24} color="#FAE7C9" />
                </div>
                <div>
                  <p style={{ color: '#E1C78F', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    {item.label}
                  </p>
                  {item.label === "Email" ? (
                    <a href={`mailto:${item.text}`} style={{ color: '#FAE7C9', fontSize: '1.1rem', textDecoration: 'none' }}>
                      {item.text}
                    </a>
                  ) : item.label === "Телефон" ? (
                    <a href={`tel:${item.text.replace(/\s/g, '')}`} style={{ color: '#FAE7C9', fontSize: '1.1rem', textDecoration: 'none' }}>
                      {item.text}
                    </a>
                  ) : (
                    <p style={{ color: '#FAE7C9', fontSize: '1.1rem' }}>
                      {item.text}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

            <div className="pt-6 flex gap-4">
              {socials.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, backgroundColor: '#FAE7C9' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  style={{ backgroundColor: '#B0926A' }}
                >
                  <social.icon size={20} color="#706233" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form
              className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                required
                className="w-full px-6 py-4 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#B0926A]"
                style={{
                  backgroundColor: '#E1C78F',
                  color: '#706233',
                  border: 'none'
                }}
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full px-6 py-4 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#B0926A]"
                style={{
                  backgroundColor: '#E1C78F',
                  color: '#706233',
                  border: 'none'
                }}
              />
              <textarea
                placeholder="Ваше сообщение"
                rows={5}
                required
                className="w-full px-6 py-4 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#B0926A] resize-none"
                style={{
                  backgroundColor: '#E1C78F',
                  color: '#706233',
                  border: 'none'
                }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl transition-all cursor-pointer"
                style={{
                  backgroundColor: '#B0926A',
                  color: '#FAE7C9',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}
              >
                Отправить сообщение
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}