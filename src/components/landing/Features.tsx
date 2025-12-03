import { 
  Users, Ruler, ClipboardList, Receipt, 
  Smartphone, Wifi, WifiOff, Globe, 
  MessageCircle, Bell, BarChart3, Wallet
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const { t } = useLanguage();
  
  const mainFeatures = [
    {
      icon: Users,
      titleKey: "features.customer",
      descKey: "features.customerDesc",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: Ruler,
      titleKey: "features.measurements",
      descKey: "features.measurementsDesc",
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      icon: ClipboardList,
      titleKey: "features.orders",
      descKey: "features.ordersDesc",
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      icon: Receipt,
      titleKey: "features.billing",
      descKey: "features.billingDesc",
      color: "bg-rose-500/10 text-rose-600",
    },
  ];

  const additionalFeatures = [
    { icon: WifiOff, labelKey: "features.offline" },
    { icon: Globe, labelKey: "features.languages" },
    { icon: MessageCircle, labelKey: "features.whatsapp" },
    { icon: Bell, labelKey: "features.alerts" },
    { icon: BarChart3, labelKey: "features.reports" },
    { icon: Wallet, labelKey: "features.payments" },
    { icon: Smartphone, labelKey: "features.mobile" },
    { icon: Wifi, labelKey: "features.sync" },
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-4">
            {t("features.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("features.title")}
            <span className="text-gradient">{t("features.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-elevated transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {t(feature.titleKey)}
              </h3>
              <p className="text-muted-foreground">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-secondary/50 rounded-3xl p-8 lg:p-12">
          <h3 className="text-xl font-bold text-center text-foreground mb-8">
            {t("features.more")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card hover:shadow-soft transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">
                  {t(feature.labelKey)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
