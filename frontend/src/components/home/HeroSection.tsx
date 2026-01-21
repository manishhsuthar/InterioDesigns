import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-living-room.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Elegant modern living room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent" />
      </div>

      {/* Glass Card */}
      <div className="relative z-10 min-h-[90vh] flex items-center px-6 md:px-12 lg:px-20 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-hero rounded-3xl p-8 md:p-12 max-w-lg relative"
        >
          {/* Decorative curve */}
          <div className="absolute -top-8 -right-8 w-40 h-40 border-2 border-foreground/10 rounded-full pointer-events-none" />
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 tracking-tight"
          >
            REDEFINE
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-foreground/80 text-lg md:text-xl font-light mb-8 leading-relaxed"
          >
            Your Home With Modern Design<br />
            And Timeless Furniture
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/explore">
              <Button
                variant="default"
                size="lg"
                className="rounded-3xl px-8 py-6 text-base font-medium hover-scale"
              >
                Get Started
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
