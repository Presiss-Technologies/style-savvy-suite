import { ArrowRight, BookOpen, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Workflow = () => {
  const { t } = useLanguage();

  const traditionalSteps = [
    { stepKey: "workflow.t1Step", time: "1 min", issueKey: "workflow.t1Issue" },
    { stepKey: "workflow.t2Step", time: "5-10 min", issueKey: "workflow.t2Issue" },
    { stepKey: "workflow.t3Step", time: "3 min", issueKey: "workflow.t3Issue" },
    { stepKey: "workflow.t4Step", time: "2 min", issueKey: "workflow.t4Issue" },
    { stepKey: "workflow.t5Step", time: "5+ min", issueKey: "workflow.t5Issue" },
  ];

  const softwareSteps = [
    { stepKey: "workflow.s1Step", time: "10 sec", benefitKey: "workflow.s1Benefit" },
    { stepKey: "workflow.s2Step", time: "1 sec", benefitKey: "workflow.s2Benefit" },
    { stepKey: "workflow.s3Step", time: "30 sec", benefitKey: "workflow.s3Benefit" },
    { stepKey: "workflow.s4Step", time: "5 sec", benefitKey: "workflow.s4Benefit" },
    { stepKey: "workflow.s5Step", time: "1 sec", benefitKey: "workflow.s5Benefit" },
  ];

  return (
    <section id="workflow" className="py-20 lg:py-32 warm-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            {t("workflow.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("workflow.title")}
            <span className="text-gradient">{t("workflow.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("workflow.subtitle")}
          </p>
        </div>

        {/* Comparison */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Traditional Method */}
          <div className="relative">
            <div className="absolute -top-4 left-6 px-4 py-2 rounded-full bg-destructive/10 text-destructive font-bold text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {t("workflow.traditional")}
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
                      <p className="font-medium text-foreground">{t(item.stepKey)}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-destructive" />
                        {t(item.issueKey)}
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
                  <span className="text-2xl font-bold text-destructive">{t("workflow.traditionalTime")}</span>
                  <span className="text-muted-foreground block text-sm">{t("workflow.perCustomer")}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Software Method */}
          <div className="relative">
            <div className="absolute -top-4 left-6 px-4 py-2 rounded-full bg-accent/20 text-accent font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {t("workflow.software")}
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
                      <p className="font-medium text-foreground">{t(item.stepKey)}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-accent" />
                        {t(item.benefitKey)}
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
                  <span className="text-2xl font-bold text-accent">{t("workflow.softwareTime")}</span>
                  <span className="text-muted-foreground block text-sm">{t("workflow.perCustomer")}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Highlight */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-primary text-primary-foreground">
            <div className="text-left">
              <p className="text-sm opacity-80">{t("workflow.saveUp")}</p>
              <p className="text-3xl font-bold">{t("workflow.saveHours")}</p>
            </div>
            <ArrowRight className="w-6 h-6" />
            <div className="text-left">
              <p className="text-sm opacity-80">{t("workflow.everyDay")}</p>
              <p className="text-xl font-bold">{t("workflow.customers")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
