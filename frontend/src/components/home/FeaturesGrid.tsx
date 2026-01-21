import { motion } from "framer-motion";
import whoWeAreImage1 from "@/assets/who-we-are-1.jpg";
import whoWeAreImage2 from "@/assets/who-we-are-2.jpg";

const FeaturesGrid = () => {
  return (
    <section className="py-8 md:py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Left Card - Stats with Gradient */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-[hsl(35,45%,78%)] to-[hsl(32,35%,55%)] rounded-3xl p-8 relative overflow-hidden min-h-[280px] flex flex-col justify-between"
          >
            {/* Decorative wave icon */}
            <div className="absolute top-6 right-6">
              <svg 
                viewBox="0 0 80 80" 
                className="w-20 h-20 text-foreground/40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10,30 Q20,20 30,30 T50,30 T70,30" />
                <path d="M10,40 Q20,30 30,40 T50,40 T70,40" />
                <path d="M10,50 Q20,40 30,50 T50,50 T70,50" />
                <path d="M10,60 Q20,50 30,60 T50,60 T70,60" />
                <circle cx="40" cy="45" r="25" strokeWidth="2" />
              </svg>
            </div>
            
            <p className="text-foreground text-sm font-medium leading-relaxed max-w-[140px]">
              Explore Every Style.<br />
              Discover Every Space
            </p>
            
            <div className="flex gap-10 mt-6">
              <div>
                <p className="font-serif text-4xl md:text-5xl font-bold text-foreground">500+</p>
                <p className="text-foreground/80 text-sm mt-1">Furniture<br />Pamphlets</p>
              </div>
              <div>
                <p className="font-serif text-4xl md:text-5xl font-bold text-foreground">50+</p>
                <p className="text-foreground/80 text-sm mt-1">Categories</p>
              </div>
            </div>
          </motion.div>

          {/* Right Card - Who We Are with Blob Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-r from-amber-50/90 to-amber-100/60 rounded-3xl p-8 flex gap-6 items-center min-h-[280px]"
          >
            {/* Text Content */}
            <div className="flex-1">
              <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
                Who <span className="text-green-600">We Are</span>
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We craft sophisticated interior spaces where contemporary aesthetics meet thoughtful functionality.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                Let us transform your home into a luxurious sanctuary—where style, comfort, and personalized elegance harmoniously coexist.
              </p>
            </div>

            {/* Blob-masked Images */}
            <div className="flex-shrink-0 relative w-40 h-full flex flex-col gap-3 justify-center">
              {/* Top blob image */}
              <div 
                className="w-32 h-24 relative overflow-hidden"
                style={{
                  borderRadius: "60% 40% 55% 45% / 55% 60% 40% 45%",
                }}
              >
                <img
                  src={whoWeAreImage1}
                  alt="Interior design showcase"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Bottom blob image */}
              <div 
                className="w-36 h-28 relative overflow-hidden ml-2"
                style={{
                  borderRadius: "45% 55% 40% 60% / 50% 45% 55% 50%",
                }}
              >
                <img
                  src={whoWeAreImage2}
                  alt="Living room design"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
