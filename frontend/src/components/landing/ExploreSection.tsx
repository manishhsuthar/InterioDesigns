import { motion } from "framer-motion";
import categoryResidential from "@/assets/category-residential.jpg";
import categoryCommercial from "@/assets/category-commercial.jpg";
import categoryOffice from "@/assets/category-office.jpg";
import categoryOutdoor from "@/assets/category-outdoor.jpg";
import featured1 from "@/assets/featured-1.jpg";
import featured2 from "@/assets/featured-2.jpg";

const categories = [
  { name: "Residential", image: categoryResidential },
  { name: "Commercial", image: categoryCommercial },
  { name: "Office", image: categoryOffice },
];

const ExploreSection = () => {
  return (
    <section id="explore" className="scroll-mt-32 py-12 md:py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">Explore</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse curated interior styles across residential, commercial, office, and outdoor spaces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden hover-scale"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="category-overlay absolute inset-0" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-card mb-4">{category.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-3xl p-6 md:p-8"
          >
            <h3 className="font-serif text-lg font-semibold text-primary mb-4">Featured</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden hover-scale">
                <img src={featured1} alt="Featured project one" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden hover-scale">
                <img src={featured2} alt="Featured project two" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative min-h-[300px] rounded-3xl overflow-hidden hover-scale"
          >
            <img
              src={categoryOutdoor}
              alt="Outdoor designs"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="category-overlay absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-card">Outdoor</h3>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
