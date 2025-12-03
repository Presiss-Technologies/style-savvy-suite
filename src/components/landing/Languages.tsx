import { Globe, Check } from "lucide-react";

const Languages = () => {
  const languages = [
    {
      name: "ગુજરાતી",
      englishName: "Gujarati",
      flag: "🇮🇳",
      primary: true,
      sample: "તમારા ગ્રાહકોની માપ અને ઓર્ડર સરળતાથી મેનેજ કરો",
    },
    {
      name: "हिंदी",
      englishName: "Hindi",
      flag: "🇮🇳",
      primary: false,
      sample: "अपने ग्राहकों की नाप और ऑर्डर आसानी से प्रबंधित करें",
    },
    {
      name: "English",
      englishName: "English",
      flag: "🌐",
      primary: false,
      sample: "Easily manage your customers' measurements and orders",
    },
  ];

  const features = [
    "Complete UI in all 3 languages",
    "Measurement labels translated",
    "Help & tutorials available",
    "Customer support in Gujarati",
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
              <span className="text-sm font-semibold text-white">Multi-Language Support</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Use in Your Own
              <span className="text-gradient block">Language</span>
            </h2>

            <p className="text-lg text-white mb-8 drop-shadow-md">
              We understand that comfort comes from using software in your mother tongue. 
              That's why StyleSavvy is fully available in Gujarati, Hindi, and English.
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
                    Primary
                  </span>
                )}
                
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">{lang.flag}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{lang.name}</h3>
                    <p className="text-sm text-white/80">{lang.englishName}</p>
                  </div>
                </div>
                
                <p className={`text-white/90 ${lang.englishName === 'Gujarati' ? 'font-gujarati' : lang.englishName === 'Hindi' ? 'font-hindi' : ''}`}>
                  "{lang.sample}"
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
