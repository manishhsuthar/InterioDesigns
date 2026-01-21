import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import exploreHero from "@/assets/explore-hero.jpg";
import categoryResidential from "@/assets/category-residential.jpg";
import categoryCommercial from "@/assets/category-commercial.jpg";
import categoryOffice from "@/assets/category-office.jpg";
import categoryOutdoor from "@/assets/category-outdoor.jpg";
import featured1 from "@/assets/featured-1.jpg";
import featured2 from "@/assets/featured-2.jpg";
import { Link } from "react-router-dom";

const categories = [
  { name: "Residential", image: categoryResidential, path: "/explore/residential" },
  { name: "Commercial", image: categoryCommercial, path: "/explore/commercial" },
  { name: "Office", image: categoryOffice, path: "/explore/office" },
];

const Explore = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh]">
        <img
          src={exploreHero}
          alt="Luxury interior design"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-20 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-card mb-4">
              Explore
            </h1>
            <p className="text-card/90 text-lg md:text-xl font-light max-w-md font-serif">
              Explore our curated collection of residential and commercial designs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-12 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {/* Top Row - 3 Categories */}
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
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-card mb-4">
                    {category.name}
                  </h3>
                  <Link
                    to={category.path}
                    className="px-6 py-2 rounded-full bg-card/20 backdrop-blur-sm text-card text-sm font-medium border border-card/30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 hover:bg-card/30"
                  >
                    View Projects
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Row - Featured + Outdoor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Featured Section */}
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
                  <img
                    src={featured1}
                    alt="Featured project"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden hover-scale">
                  <img
                    src={featured2}
                    alt="Featured project"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Outdoor Category */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative aspect-auto md:aspect-auto min-h-[300px] rounded-3xl overflow-hidden hover-scale"
            >
              <img
                src={categoryOutdoor}
                alt="Outdoor designs"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="category-overlay absolute inset-0" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-card mb-4">
                  Outdoor
                </h3>
                <Link
                  to="/explore/outdoor"
                  className="px-6 py-2 rounded-full bg-card/20 backdrop-blur-sm text-card text-sm font-medium border border-card/30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 hover:bg-card/30"
                >
                  View Projects
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Explore;
