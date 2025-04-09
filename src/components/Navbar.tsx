
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";

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
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo variant="long" className="text-2xl" />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-800 hover:text-hatch-coral transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-800 hover:text-hatch-coral transition-colors">
            How it Works
          </a>
          <a href="#pricing" className="text-gray-800 hover:text-hatch-coral transition-colors">
            Pricing
          </a>
          <Button className="bg-hatch-coral hover:bg-hatch-coral/90 text-white">Get Started</Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-md py-4 px-4 flex flex-col space-y-4">
          <a 
            href="#features" 
            className="text-gray-800 hover:text-hatch-coral transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="text-gray-800 hover:text-hatch-coral transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            How it Works
          </a>
          <a 
            href="#pricing" 
            className="text-gray-800 hover:text-hatch-coral transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pricing
          </a>
          <Button className="bg-hatch-coral hover:bg-hatch-coral/90 text-white w-full">
            Get Started
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
