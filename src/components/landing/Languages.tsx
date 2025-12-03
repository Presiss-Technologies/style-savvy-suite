import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Languages = () => {
  const { t } = useLanguage();

  const languages = [
    {
      nameKey: "lang.gujarati",
      englishName: "Gujarati",
      flag: "🇮🇳",
      primary: true,
      sampleKey: "lang.sampleGu",
      fontClass: "font-gujarati",
    },
    {
      nameKey: "lang.hindi",
      englishName: "Hindi",
      flag: "🇮🇳",
      primary: false,
      sampleKey: "lang.sampleHi",
      fontClass: "font-hindi",
    },
    {
      nameKey: "lang.english",
      englishName: "English",
      flag: "🌐",
      primary: false,
      sampleKey: "lang.sampleEn",
      fontClass: "",
    },
  ];

  const features = [
    t("lang.feature1"),
    t("lang.feature2"),
    t("lang.feature3"),
    t("lang.feature4"),
  ];

  return (
    <section id="languages" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background with better contrast */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
              <Globe className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-white">{t("lang.badge")}</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              {t("lang.title")}
              <span className="text-gradient block">{t("lang.titleHighlight")}</span>
            </h2>

            <p className="text-lg text-white mb-8 drop-shadow-md">
              {t("lang.subtitle")}
            </p>

            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/30 flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-white font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Language Cards */}
          <div className="space-y-4">
            {languages.map((lang, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                  lang.primary
                    ? "bg-white/25 border-2 border-accent shadow-glow"
                    : "bg-white/15 border border-white/30"
                }`}
              >
                {lang.primary && (
                  <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {t("lang.primary")}
                  </span>
                )}
                
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">{lang.flag}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t(lang.nameKey)}</h3>
                    <p className="text-sm text-white/80">{lang.englishName}</p>
                  </div>
                </div>
                
                <p className={`text-white/90 ${lang.fontClass}`}>
                  "{t(lang.sampleKey)}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Languages;
