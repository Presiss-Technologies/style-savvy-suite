import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-tailor.jpg";

const Hero = () => {
  const navigate = useNavigate();
  
  const stats = [
    { icon: Users, value: "5,000+", label: "Tailors Trust Us" },
    { icon: Clock, value: "2 Min", label: "Per Order" },
    { icon: Shield, value: "100%", label: "Offline Ready" },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden">
      {/* Background with darker overlay for better text readability */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl float" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl float-delayed" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
              <span className="text-sm font-semibold text-white">
                Built for Surat's Tailoring Industry
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-in-up animation-delay-100 drop-shadow-lg">
              Manage Your
              <br />
              <span className="text-gradient drop-shadow-none">Tailoring Business</span>
              <br />
              Like Never Before
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-white mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200 drop-shadow-md">
              The complete software solution for modern tailors. Customer management, 
              measurements, orders, and billing — all in one place.
              <span className="block mt-2 font-gujarati text-white/90">
                ગુજરાતી, हिंदी & English में उपलब्ध
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-300">
              <Button variant="hero" size="xl" className="group" onClick={() => navigate("/dashboard")}>
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="heroOutline" size="xl" className="group">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20 animate-fade-in-up animation-delay-400">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-accent" />
                    <span className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-sm text-white/90 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-scale-in animation-delay-200">
            <div className="relative rounded-2xl overflow-hidden shadow-dramatic">
              <img
                src={heroImage}
                alt="Professional tailor at work"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-elevated animate-fade-in-up animation-delay-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Works Offline</p>
                  <p className="text-sm text-muted-foreground">No internet needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
