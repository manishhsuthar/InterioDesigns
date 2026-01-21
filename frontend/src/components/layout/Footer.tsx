import heroImage from "@/assets/hero-living-room.jpg";
import InterioLogo from "@/components/ui/InterioLogo";

const Footer = () => {
  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Interior background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <InterioLogo className="justify-center mb-6" />
          
          <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
            Transforming spaces into timeless sanctuaries of elegance and comfort.
          </p>
          
          <div className="flex justify-center gap-8 text-sm text-muted-foreground mb-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          
          <p className="text-muted-foreground text-xs">
            © 2024 INTERIO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
