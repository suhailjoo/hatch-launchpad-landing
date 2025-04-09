
import { Check, Brain, Zap, Users, Star, Clock } from "lucide-react";

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
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
              className="feature-card"
            >
              {feature.icon}
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
