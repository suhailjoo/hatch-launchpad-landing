
import { Check, Brain, Zap, Users, Star, Clock } from "lucide-react";
import { useEffect, useRef } from "react";

const features = [
  {
    icon: <Brain className="w-12 h-12 text-hatch-coral mb-4" />,
    title: "AI Matching",
    description: "Advanced algorithms match candidates to your job requirements with uncanny accuracy.",
  },
  {
    icon: <Zap className="w-12 h-12 text-hatch-blue mb-4" />,
    title: "Smart Screening",
    description: "Automated pre-screening questions that adapt based on candidates' previous answers.",
  },
  {
    icon: <Users className="w-12 h-12 text-hatch-gold mb-4" />,
    title: "Team Collaboration",
    description: "Simple tools for your entire team to evaluate and discuss potential candidates.",
  },
  {
    icon: <Star className="w-12 h-12 text-hatch-coral mb-4" />,
    title: "Talent Pool",
    description: "Build and maintain a database of qualified candidates for future openings.",
  },
  {
    icon: <Clock className="w-12 h-12 text-hatch-blue mb-4" />,
    title: "Time-Saving Workflows",
    description: "Automate repetitive tasks and focus on what matters - finding great people.",
  },
  {
    icon: <Check className="w-12 h-12 text-hatch-gold mb-4" />,
    title: "Bias Reduction",
    description: "AI tools that help identify and reduce unconscious bias in your hiring process.",
  },
];

const FeaturesSection = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    const featuresElement = featuresRef.current;
    if (featuresElement) {
      const cards = featuresElement.querySelectorAll(".feature-card-animated");
      cards.forEach((card, index) => {
        // Add progressive delay
        (card as HTMLElement).style.animationDelay = `${0.1 + index * 0.1}s`;
        observer.observe(card);
      });
    }

    return () => {
      if (featuresElement) {
        const cards = featuresElement.querySelectorAll(".feature-card-animated");
        cards.forEach((card) => observer.unobserve(card));
      }
    };
  }, []);

  return (
    <section ref={featuresRef} id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-hatch-coral via-hatch-blue to-hatch-gold bg-clip-text text-transparent">
            Powerful Features to Transform Your Hiring
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our platform combines AI technology with human-centered design to make recruiting easier, faster, and more effective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card-animated feature-card opacity-0 backdrop-blur-sm bg-white/90 hover:bg-white/100 transition-all duration-300 border border-gray-200/50"
            >
              <div className="flex items-center justify-center transition-transform duration-300 hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
