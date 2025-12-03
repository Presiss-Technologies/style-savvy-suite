import { ArrowRight, BookOpen, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

const Workflow = () => {
  const traditionalSteps = [
    { step: "Customer comes", time: "1 min", issue: "Find old notebook" },
    { step: "Search measurements", time: "5-10 min", issue: "Flip through pages" },
    { step: "Write new order", time: "3 min", issue: "Multiple registers" },
    { step: "Calculate bill", time: "2 min", issue: "Manual calculation" },
    { step: "Track delivery", time: "5+ min", issue: "Check all pages" },
  ];

  const softwareSteps = [
    { step: "Enter mobile number", time: "10 sec", benefit: "Instant search" },
    { step: "View all measurements", time: "1 sec", benefit: "Auto-loads" },
    { step: "Create order", time: "30 sec", benefit: "One screen" },
    { step: "Generate bill", time: "5 sec", benefit: "Auto-calculated" },
    { step: "Track status", time: "1 sec", benefit: "Dashboard view" },
  ];

  return (
    <section id="workflow" className="py-20 lg:py-32 warm-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Traditional vs.
            <span className="text-gradient"> Digital Way</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See how much time you can save every single day
          </p>
        </div>

        {/* Comparison */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Traditional Method */}
          <div className="relative">
            <div className="absolute -top-4 left-6 px-4 py-2 rounded-full bg-destructive/10 text-destructive font-bold text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Traditional Method
            </div>
            <div className="bg-card border border-destructive/20 rounded-2xl p-6 pt-10">
              <div className="space-y-4">
                {traditionalSteps.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.step}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-destructive" />
                        {item.issue}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-destructive font-semibold">
                      <Clock className="w-4 h-4" />
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-center">
                  <span className="text-2xl font-bold text-destructive">16-21 min</span>
                  <span className="text-muted-foreground block text-sm">per customer (average)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Software Method */}
          <div className="relative">
            <div className="absolute -top-4 left-6 px-4 py-2 rounded-full bg-accent/20 text-accent font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              With StyleSavvy
            </div>
            <div className="bg-card border border-accent/20 rounded-2xl p-6 pt-10 shadow-glow">
              <div className="space-y-4">
                {softwareSteps.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-accent/5 border border-accent/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.step}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-accent" />
                        {item.benefit}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-accent font-semibold">
                      <Clock className="w-4 h-4" />
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-center">
                  <span className="text-2xl font-bold text-accent">Under 2 min</span>
                  <span className="text-muted-foreground block text-sm">per customer (average)</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Highlight */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-primary text-primary-foreground">
            <div className="text-left">
              <p className="text-sm opacity-80">Save up to</p>
              <p className="text-3xl font-bold">3+ Hours</p>
            </div>
            <ArrowRight className="w-6 h-6" />
            <div className="text-left">
              <p className="text-sm opacity-80">Every day with</p>
              <p className="text-xl font-bold">20 Customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
