import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Button } from "@/components/ui/button";
import diningRetreat from "@/assets/dining-retreat.jpg";
import cardStack2 from "@/assets/card-stack-2.jpg";
import cardStack3 from "@/assets/card-stack-3.jpg";

const projects = [
  {
    id: 1,
    title: "Tranquil Modern",
    subtitle: "Dining Retreat",
    description:
      "A sleek, light-filled dining area with floor-to-ceiling windows and views of lush greenery. Soft wood floors, minimal furnishings, and muted tones create a calming, elegant atmosphere.",
    image: diningRetreat,
  },
  {
    id: 2,
    title: "Contemporary",
    subtitle: "Kitchen Haven",
    description:
      "An open-concept kitchen featuring marble countertops, brass fixtures, and abundant natural light. Clean lines and warm wood tones create an inviting culinary space.",
    image: cardStack2,
  },
  {
    id: 3,
    title: "Urban Luxury",
    subtitle: "Master Suite",
    description:
      "A sophisticated bedroom retreat with panoramic city views. Plush textures, neutral palette, and ambient lighting create the perfect sanctuary for rest.",
    image: cardStack3,
  },
];

const ProjectCardStack = () => {
  const [cards, setCards] = useState(projects);
  const [exitDirection, setExitDirection] = useState(0);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (Math.abs(info.offset.x) > 100) {
      setExitDirection(info.offset.x > 0 ? 1 : -1);
      cycleCards();
    }
  };

  const cycleCards = () => {
    setTimeout(() => {
      setCards((prev) => {
        const newCards = [...prev];
        const first = newCards.shift();
        if (first) newCards.push(first);
        return newCards;
      });
      setExitDirection(0);
    }, 300);
  };

  const handlePortfolioClick = () => {
    setExitDirection(-1);
    cycleCards();
  };

  return (
    <section className="py-8 md:py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="relative h-[450px] md:h-[400px]">
          <AnimatePresence mode="popLayout">
            {cards.map((project, index) => {
              const isTop = index === 0;
              const stackOffset = index * 8;
              const stackScale = 1 - index * 0.05;
              const stackRotate = index * 1.5;

              return (
                <motion.div
                  key={project.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{
                    scale: stackScale,
                    y: stackOffset,
                    rotate: stackRotate,
                    opacity: 1,
                    zIndex: cards.length - index,
                  }}
                  exit={{
                    x: exitDirection * 400,
                    opacity: 0,
                    rotate: exitDirection * 20,
                    transition: { duration: 0.3 },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  drag={isTop ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  onDragEnd={isTop ? handleDragEnd : undefined}
                  className={`absolute inset-0 glass rounded-3xl overflow-hidden cursor-${
                    isTop ? "grab active:cursor-grabbing" : "default"
                  }`}
                  style={{
                    transformOrigin: "bottom center",
                  }}
                >
                  <div className="grid md:grid-cols-2 h-full">
                    {/* Text Content */}
                    <div className="p-8 md:p-12 flex flex-col justify-center relative z-10">
                      <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-tight">
                        {project.title}
                        <br />
                        <span className="font-normal">{project.subtitle}</span>
                      </h2>

                      <p className="text-primary text-sm md:text-base leading-relaxed mt-6 max-w-sm">
                        {project.description}
                      </p>

                      <div className="mt-8">
                        <Button
                          variant="outline"
                          onClick={handlePortfolioClick}
                          className="rounded-3xl px-8 py-5 text-sm font-medium border-primary/30 hover:bg-primary/10 hover-scale"
                        >
                          Portfolio
                        </Button>
                      </div>
                    </div>

                    {/* Image with Semi-circle Mask */}
                    <div className="relative h-full flex items-center justify-end overflow-hidden">
                      {/* Decorative glass circles */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-white/40" />
                        <div className="w-2 h-2 rounded-full bg-white/60" />
                        <div className="w-2 h-2 rounded-full bg-white/40" />
                      </div>

                      {/* Semi-circle masked image */}
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-[90%] h-[85%] overflow-hidden"
                        style={{
                          borderRadius: "50% 0 0 50% / 50% 0 0 50%",
                        }}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Diagonal glass overlay */}
                      <div
                        className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-white/20 to-transparent"
                        style={{
                          clipPath: "polygon(0 0, 60% 0, 30% 100%, 0 100%)",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Swipe hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground text-xs flex items-center gap-2"
          >
            <span>←</span>
            <span>Swipe or click Portfolio</span>
            <span>→</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCardStack;
