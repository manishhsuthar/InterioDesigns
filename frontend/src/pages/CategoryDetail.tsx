import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import categoryResidential from "@/assets/category-residential.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const categoryInfo: Record<string, { title: string; description: string }> = {
  residential: {
    title: "Residential",
    description: "We design residential spaces that blend comfort, style, and personality. From modern minimalism to timeless elegance, we bring your vision to life with care and detail.",
  },
  commercial: {
    title: "Commercial",
    description: "Creating inspiring commercial spaces that balance functionality with aesthetic appeal. From restaurants to retail, we design environments that enhance brand identity.",
  },
  office: {
    title: "Office",
    description: "Designing productive office environments that inspire creativity and collaboration. We create workspaces that reflect your company culture and boost employee wellbeing.",
  },
  outdoor: {
    title: "Outdoor",
    description: "Transform your outdoor spaces into luxurious retreats. From patios to gardens, we create serene environments that extend your living space into nature.",
  },
};

const galleryImages = [
  { src: gallery1, alt: "Modern living room with grey sofa" },
  { src: gallery2, alt: "Open kitchen and dining area" },
  { src: gallery3, alt: "Living room with yellow accent chairs" },
  { src: gallery4, alt: "Scandinavian bedroom" },
  { src: gallery5, alt: "Luxury living room with ambient lighting" },
  { src: gallery6, alt: "Contemporary dining room with staircase" },
];

const CategoryDetail = () => {
  const { category } = useParams<{ category: string }>();
  const info = categoryInfo[category || "residential"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-28 pb-8 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[1fr_2fr] gap-6 items-start">
            {/* Category Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden aspect-[3/4]"
            >
              <img
                src={categoryResidential}
                alt={info.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="glass-light px-4 py-2 rounded-full text-card font-medium text-sm">
                  {info.title}
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pt-4"
            >
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-4">
                Transform Your Home
              </h1>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-serif">
                {info.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="py-8 md:py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative rounded-3xl overflow-hidden hover-scale ${
                  index === 3 ? "md:col-span-2 md:row-span-2" : ""
                } ${index === 0 || index === 3 ? "aspect-[4/5]" : "aspect-square"}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="category-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <button className="px-5 py-2 rounded-full bg-card/20 backdrop-blur-sm text-card text-sm font-medium border border-card/30 hover:bg-card/30 transition-colors">
                    View Projects
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryDetail;
