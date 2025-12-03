import { 
  Users, Ruler, ClipboardList, Receipt, 
  Smartphone, Wifi, WifiOff, Globe, 
  MessageCircle, Bell, BarChart3, Wallet
} from "lucide-react";

const Features = () => {
  const mainFeatures = [
    {
      icon: Users,
      title: "Customer Management",
      titleGu: "ગ્રાહક વ્યવસ્થાપન",
      description: "Search customers instantly by mobile number. Complete history at your fingertips.",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: Ruler,
      title: "Smart Measurements",
      titleGu: "સ્માર્ટ માપ",
      description: "Pre-built templates for Shirt, Pant, Kurta, Koti & more. Never lose measurements again.",
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      icon: ClipboardList,
      title: "Order Tracking",
      titleGu: "ઓર્ડર ટ્રેકિંગ",
      description: "Track every order from cutting to delivery. Know what's pending at a glance.",
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      icon: Receipt,
      title: "Instant Billing",
      titleGu: "તાત્કાલિક બિલિંગ",
      description: "Generate professional bills in seconds. Print or share via WhatsApp.",
      color: "bg-rose-500/10 text-rose-600",
    },
  ];

  const additionalFeatures = [
    { icon: WifiOff, label: "Works Offline", labelGu: "ઑફલાઇન કામ" },
    { icon: Globe, label: "3 Languages", labelGu: "3 ભાષાઓ" },
    { icon: MessageCircle, label: "WhatsApp Bills", labelGu: "વૉટ્સએપ બિલ" },
    { icon: Bell, label: "Delivery Alerts", labelGu: "ડિલિવરી એલર્ટ" },
    { icon: BarChart3, label: "Daily Reports", labelGu: "દૈનિક રિપોર્ટ" },
    { icon: Wallet, label: "Payment Tracking", labelGu: "ચુકવણી ટ્રેકિંગ" },
    { icon: Smartphone, label: "Mobile Friendly", labelGu: "મોબાઇલ ફ્રેંડલી" },
    { icon: Wifi, label: "Auto Sync", labelGu: "ઑટો સિંક" },
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need to
            <span className="text-gradient"> Grow Your Business</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Replace notebooks and registers with powerful digital tools designed 
            specifically for tailors in Gujarat.
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
              <h3 className="text-xl font-bold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-accent font-gujarati mb-3">
                {feature.titleGu}
              </p>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-secondary/50 rounded-3xl p-8 lg:p-12">
          <h3 className="text-xl font-bold text-center text-foreground mb-8">
            And Much More...
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
                  {feature.label}
                </span>
                <span className="text-xs text-muted-foreground font-gujarati text-center">
                  {feature.labelGu}
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
