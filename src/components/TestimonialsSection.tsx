
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  return (
    <section className="py-20 bg-hatch-lightBlue/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by HR Teams</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Hear what our customers have to say about their experience with Hatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-6">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold">{testimonial.author}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
