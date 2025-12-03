import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();
  
  const plans = [
    {
      name: "Free",
      nameGu: "મફત",
      price: "₹0",
      period: "forever",
      description: "Perfect to try before you buy",
      features: [
        "Up to 50 customers",
        "Basic measurements",
        "Local storage only",
        "Single device",
      ],
      cta: "Get Started",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Basic",
      nameGu: "બેસિક",
      price: "₹299",
      period: "/month",
      description: "For growing tailoring shops",
      features: [
        "Unlimited customers",
        "All measurement templates",
        "Cloud backup",
        "WhatsApp integration",
        "2 devices",
        "Email support",
      ],
      cta: "Start Free Trial",
      variant: "gold" as const,
      popular: true,
    },
    {
      name: "Professional",
      nameGu: "પ્રોફેશનલ",
      price: "₹499",
      period: "/month",
      description: "For established businesses",
      features: [
        "Everything in Basic",
        "Multiple workers",
        "SMS notifications",
        "Advanced reports",
        "5 devices",
        "Priority support",
        "Worker wage tracking",
      ],
      cta: "Start Free Trial",
      variant: "default" as const,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent
            <span className="text-gradient"> Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need more. No hidden charges.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-6 lg:p-8 transition-all duration-300 ${
                plan.popular
                  ? "bg-primary scale-105 shadow-dramatic"
                  : "bg-card border border-border hover:border-accent/50 hover:shadow-elevated"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold ${plan.popular ? "text-white" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm font-gujarati ${plan.popular ? "text-white/80" : "text-muted-foreground"}`}>
                  {plan.nameGu}
                </p>
              </div>

              <div className="text-center mb-6">
                <span className={`text-4xl lg:text-5xl font-extrabold ${plan.popular ? "text-white" : "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? "text-white/80" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>

              <p className={`text-center text-sm mb-6 ${plan.popular ? "text-white/90" : "text-muted-foreground"}`}>
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-accent" : "text-accent"}`} />
                    <span className={`text-sm ${plan.popular ? "text-white" : "text-foreground"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "hero" : plan.variant}
                className="w-full"
                size="lg"
                onClick={() => navigate("/dashboard")}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* One-time Purchase */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-secondary rounded-2xl p-6 lg:p-8 text-center border border-border">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <span className="font-bold text-foreground">Prefer One-Time Payment?</span>
            </div>
            <p className="text-foreground mb-4">
              Get lifetime access for just <span className="font-bold text-accent">₹9,999</span> (no monthly fees!)
            </p>
            <Button variant="outline" size="lg">
              Learn More About Lifetime Deal
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
