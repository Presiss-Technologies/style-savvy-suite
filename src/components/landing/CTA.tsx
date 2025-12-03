import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const CTA = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 lg:p-16">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          {/* Darker overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/20 rounded-3xl" />
          
          <div className="relative text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              {t("cta.title")}
              <span className="text-accent block drop-shadow-none">{t("cta.titleHighlight")}</span>
            </h2>
            
            <p className="text-lg text-white mb-8 drop-shadow-md">
              {t("cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="hero" size="xl" className="group" onClick={() => navigate("/dashboard")}>
                {t("cta.trial")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="heroOutline" size="xl">
                <MessageCircle className="w-5 h-5" />
                {t("cta.contact")}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2 font-medium">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-white/50" />
              <div className="flex items-center gap-2 font-medium">
                <MessageCircle className="w-4 h-4" />
                <span>{t("cta.whatsapp")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
