import { motion } from "framer-motion";
import { Settings, Waves, Sparkles, Gem } from "lucide-react";
import philosophyImage from "@/assets/philosophy-room.jpg";

const values = [
  {
    title: "Timeless Elegance",
    description: "Creating personalized elegance that transcends passing trends and remains relevant for years",
    icon: Gem,
  },
  {
    title: "Thoughtful Functionality",
    description: "Blending contemporary aesthetics with practical utility to enhance every aspect of your daily life.",
    icon: Settings,
  },
  {
    title: "Curated Tranquility",
    description: "Designing light-filled, luxurious sanctuaries that serve as a calming retreat from the world.",
    icon: Waves,
  },
  {
    title: "Modern Innovation",
    description: "Redefining the modern home by unlocking its true potential through fresh design and high-quality craftsmanship.",
    icon: Sparkles,
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="scroll-mt-32 py-16 md:py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            About <span className="text-primary">INTERIO</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Crafting sophisticated interior spaces where contemporary aesthetics meet thoughtful functionality.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-6">Our Philosophy</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At INTERIO, we believe that great design transforms not just spaces, but lives. Every project begins
              with a deep understanding of our clients' needs, aspirations, and lifestyle.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We combine timeless elegance with modern innovation to create environments that are both beautiful and
              functional.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl overflow-hidden"
          >
            <img src={philosophyImage} alt="Interior philosophy" className="w-full h-80 object-cover" />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-3xl p-6 md:p-8 text-center shadow-md hover-scale"
            >
              <div className="flex justify-center mb-4">
                <value.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
              <h4 className="font-serif text-sm md:text-base font-semibold text-primary mb-3">{value.title}</h4>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
