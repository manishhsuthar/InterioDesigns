import { motion } from "framer-motion";

const estimates = [
  {
    title: "Full Home Interior",
    description: "Know the estimate price for your full home interiors",
  },
  {
    title: "Kitchen",
    description: "Get an approximate costing for your kitchen interior.",
  },
  {
    title: "Wardrobe",
    description: "Our estimate for your dream wardrobe",
  },
];

const EstimateSection = () => {
  return (
    <section className="py-12 md:py-16 px-6 md:px-12 lg:px-20 bg-card/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-muted-foreground text-lg md:text-xl mb-2">Get the estimate for your</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {estimates.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-3xl border border-border bg-background p-6 md:p-7 shadow-sm"
            >
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground mb-6 min-h-[48px]">{item.description}</p>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition-opacity"
              >
                Calculate Estimate
              </button>
              
            </motion.div>
            
          ))}
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto  mt-8 ">
            Calculate the approximate cost of doing up your home interiors
          </p>
        </div>
      </div>
    </section>
  );
};

export default EstimateSection;
