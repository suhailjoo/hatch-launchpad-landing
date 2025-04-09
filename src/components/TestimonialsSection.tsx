
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote: "Hatch has completely transformed our recruiting process. We've reduced time-to-hire by 45% while finding better candidates.",
    author: "Sarah Johnson",
    role: "Head of HR, TechCorp",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    initials: "SJ"
  },
  {
    quote: "The AI matching technology is incredible. It surfaces candidates I might have overlooked but who turned out to be perfect for the role.",
    author: "Miguel Rodriguez",
    role: "Talent Acquisition Manager, GrowthStartup",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    initials: "MR"
  },
  {
    quote: "What impressed me most was how quickly we were able to implement Hatch and see results. The team loves using it.",
    author: "Lisa Chen",
    role: "COO, InnovateNow",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    initials: "LC"
  }
];

const TestimonialsSection = () => {
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const testimonialCards = entry.target.querySelectorAll(".testimonial-card");
            testimonialCards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("animate-fade-in");
                card.classList.remove("opacity-0");
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }

    return () => {
      if (testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current);
      }
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-hatch-lightBlue/10 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-hatch-gold to-hatch-coral bg-clip-text text-transparent">
            Loved by HR Teams
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Hear what our customers have to say about their experience with Hatch.
          </p>
        </div>

        <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="testimonial-card opacity-0 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-center mb-6">
                <Avatar className="h-14 w-14 mr-4 border-2 border-hatch-coral/20 shadow-sm">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-hatch-coral to-hatch-blue text-white">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold">{testimonial.author}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
