
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo variant="long" className={`text-2xl transition-all duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`} />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-800 hover:text-hatch-coral transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-hatch-coral after:transition-all after:duration-300">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-800 hover:text-hatch-coral transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-hatch-coral after:transition-all after:duration-300">
            How it Works
          </a>
          <a href="#pricing" className="text-gray-800 hover:text-hatch-coral transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-hatch-coral after:transition-all after:duration-300">
            Pricing
          </a>
          <Link to="/auth">
            <Button className="bg-hatch-coral hover:bg-hatch-coral/90 text-white transition-transform duration-300 hover:scale-105">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="transition-all duration-300 hover:bg-hatch-coral/10"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-white/95 backdrop-blur-md absolute top-full left-0 w-full shadow-md py-4 px-4 flex flex-col space-y-4 transition-all duration-300 ease-in-out transform ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
        }`}
      >
        <a 
          href="#features" 
          className="text-gray-800 hover:text-hatch-coral transition-colors py-2 hover:pl-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Features
        </a>
        <a 
          href="#how-it-works" 
          className="text-gray-800 hover:text-hatch-coral transition-colors py-2 hover:pl-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          How it Works
        </a>
        <a 
          href="#pricing" 
          className="text-gray-800 hover:text-hatch-coral transition-colors py-2 hover:pl-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Pricing
        </a>
        <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
          <Button className="bg-hatch-coral hover:bg-hatch-coral/90 text-white w-full transition-all duration-300 hover:scale-105">
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
