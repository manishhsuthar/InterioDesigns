import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import InterioLogo from "@/components/ui/InterioLogo";
import signupBg from "@/assets/signup-bg.jpg";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image with Logo */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={signupBg}
          alt="Bright modern interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/10" />
        
        {/* Glass circle decoration */}
        <div className="absolute top-1/3 right-1/4 w-72 h-72 border-2 border-card/20 rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-hero rounded-3xl p-8 md:p-12 text-center"
          >
            <InterioLogo variant="light" className="text-3xl mb-6 justify-center" />
            <p className="text-card text-xl md:text-2xl font-light tracking-wide font-serif">
              Elevate your everyday<br />Join Interio.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
        <img
          src={signupBg}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover lg:hidden"
        />
        <div className="absolute inset-0 bg-background/80 lg:bg-transparent" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 glass-form rounded-3xl p-8 md:p-10 w-full max-w-md"
        >
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-8 relative">
              <Link
                to="/login"
                className="pb-2 font-medium text-foreground/50 hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <button className="pb-2 font-medium text-foreground transition-colors">
                Sign Up
              </button>
              <div className="absolute bottom-0 right-0 h-0.5 bg-terracotta w-14" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Get Started
            </h1>
            <p className="text-foreground/70">Design your space with Interio</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-cream w-full"
              required
            />
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-cream w-full"
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-cream w-full"
              required
            />

            <label className="flex items-center gap-2 cursor-pointer">
              <button
                type="button"
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  agreeTerms
                    ? "bg-terracotta border-terracotta"
                    : "border-foreground/30 bg-transparent"
                }`}
              >
                {agreeTerms && <Check className="h-3 w-3 text-card" />}
              </button>
              <span className="text-sm text-foreground/80">
                I Agree to the Terms & Conditions
              </span>
            </label>

            <Button
              type="submit"
              className="w-full rounded-3xl py-6 text-base font-medium bg-terracotta hover:bg-terracotta/90 text-terracotta-foreground hover-scale"
            >
              Sign Up
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-foreground/70">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground font-semibold hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
