
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const heroElement = heroRef.current;
    if (heroElement) {
      const animatedElements = heroElement.querySelectorAll(".animate-on-scroll");
      animatedElements.forEach((el) => observer.observe(el));
    }

    return () => {
      if (heroElement) {
        const animatedElements = heroElement.querySelectorAll(".animate-on-scroll");
        animatedElements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);

  return (
    <section ref={heroRef} className="pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-on-scroll opacity-0" style={{ animationDelay: "0.2s" }}>
              <span className="gradient-text">AI-Powered</span> Hiring Management
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl animate-on-scroll opacity-0" style={{ animationDelay: "0.4s" }}>
              Find, screen, and hire the best talent with our intelligent platform that simplifies your entire recruitment process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-on-scroll opacity-0" style={{ animationDelay: "0.6s" }}>
              <Link to="/auth">
                <Button className="bg-hatch-coral hover:bg-hatch-coral/90 text-white px-8 py-6 text-lg transition-all duration-300 hover:scale-105">
                  Get Started Free
                </Button>
              </Link>
              <Button variant="outline" className="border-hatch-blue text-hatch-blue hover:bg-hatch-blue/10 px-8 py-6 text-lg transition-all duration-300 hover:scale-105">
                Book a Demo
              </Button>
            </div>
            <div className="mt-8 text-sm text-gray-500 animate-on-scroll opacity-0" style={{ animationDelay: "0.8s" }}>
              <p>No credit card required • 14-day free trial</p>
            </div>
          </div>
          <div className="md:w-1/2 animate-on-scroll opacity-0" style={{ animationDelay: "0.8s" }}>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-hatch-yellow/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-hatch-lightBlue/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }}></div>
              <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-hatch-coral/20 hover:shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
                  alt="Hatch dashboard"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
