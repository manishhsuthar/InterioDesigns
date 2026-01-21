import { Lamp } from "lucide-react";

interface InterioLogoProps {
  className?: string;
  variant?: "dark" | "light";
}

const InterioLogo = ({ className = "", variant = "dark" }: InterioLogoProps) => {
  const textColor = variant === "dark" ? "text-foreground" : "text-card";
  
  return (
    <div className={`flex items-center gap-0.5 font-serif font-semibold text-xl tracking-wider ${textColor} ${className}`}>
      <span>IN</span>
      <Lamp className="h-5 w-5 text-primary -mx-0.5" strokeWidth={2.5} />
      <span>ERIO</span>
    </div>
  );
};

export default InterioLogo;
