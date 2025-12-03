import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const plans = [
    {
      nameKey: "pricing.free",
      price: "₹0",
      periodKey: "pricing.forever",
      descKey: "pricing.freeDesc",
      features: [
        "pricing.freeF1",
        "pricing.freeF2",
        "pricing.freeF3",
        "pricing.freeF4",
      ],
      ctaKey: "pricing.getStarted",
      variant: "outline" as const,
      popular: false,
    },
    {
      nameKey: "pricing.basic",
      price: "₹299",
      periodKey: "pricing.month",
      descKey: "pricing.basicDesc",
      features: [
        "pricing.basicF1",
        "pricing.basicF2",
        "pricing.basicF3",
        "pricing.basicF4",
        "pricing.basicF5",
        "pricing.basicF6",
      ],
      ctaKey: "pricing.startTrial",
      variant: "gold" as const,
      popular: true,
    },
    {
      nameKey: "pricing.professional",
      price: "₹499",
      periodKey: "pricing.month",
      descKey: "pricing.proDesc",
      features: [
        "pricing.proF1",
        "pricing.proF2",
        "pricing.proF3",
        "pricing.proF4",
        "pricing.proF5",
        "pricing.proF6",
        "pricing.proF7",
      ],
      ctaKey: "pricing.startTrial",
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
            {t("pricing.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("pricing.title")}
            <span className="text-gradient">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("pricing.subtitle")}
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
                  {t("pricing.mostPopular")}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold ${plan.popular ? "text-white" : "text-foreground"}`}>
                  {t(plan.nameKey)}
                </h3>
              </div>

              <div className="text-center mb-6">
                <span className={`text-4xl lg:text-5xl font-extrabold ${plan.popular ? "text-white" : "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? "text-white/80" : "text-muted-foreground"}`}>
                  {t(plan.periodKey)}
                </span>
              </div>

              <p className={`text-center text-sm mb-6 ${plan.popular ? "text-white/90" : "text-muted-foreground"}`}>
                {t(plan.descKey)}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((featureKey, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-accent" : "text-accent"}`} />
                    <span className={`text-sm ${plan.popular ? "text-white" : "text-foreground"}`}>
                      {t(featureKey)}
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
                {t(plan.ctaKey)}
              </Button>
            </div>
          ))}
        </div>

        {/* One-time Purchase */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-secondary rounded-2xl p-6 lg:p-8 text-center border border-border">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <span className="font-bold text-foreground">{t("pricing.oneTime")}</span>
            </div>
            <p className="text-foreground mb-4">
              {t("pricing.lifetime")} <span className="font-bold text-accent">{t("pricing.lifetimePrice")}</span> {t("pricing.noMonthly")}
            </p>
            <Button variant="outline" size="lg">
              {t("pricing.learnMore")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
