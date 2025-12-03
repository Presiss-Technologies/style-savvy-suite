import { Scissors } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = {
    product: {
      titleKey: "footer.product",
      links: [
        { nameKey: "footer.features", href: "#features" },
        { nameKey: "footer.pricing", href: "#pricing" },
        { nameKey: "footer.howItWorks", href: "#workflow" },
        { nameKey: "footer.downloadApp", href: "#" },
      ],
    },
    support: {
      titleKey: "footer.support",
      links: [
        { nameKey: "footer.helpCenter", href: "#" },
        { nameKey: "footer.videoTutorials", href: "#" },
        { nameKey: "footer.contactUs", href: "#" },
        { nameKey: "footer.whatsappSupport", href: "#" },
      ],
    },
    company: {
      titleKey: "footer.company",
      links: [
        { nameKey: "footer.aboutUs", href: "#" },
        { nameKey: "footer.careers", href: "#" },
        { nameKey: "footer.privacy", href: "#" },
        { nameKey: "footer.terms", href: "#" },
      ],
    },
  };

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Scissors className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-white">
                Style<span className="text-accent">Savvy</span>
              </span>
            </a>
            <p className="text-white/80 mb-4 max-w-sm">
              {t("footer.tagline")}
            </p>
            <p className="text-sm text-white/70 font-gujarati">
              {t("footer.taglineGu")}
            </p>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section, index) => (
            <div key={index}>
              <h4 className="font-bold text-white mb-4">
                {t(section.titleKey)}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-white/80 hover:text-accent transition-colors"
                    >
                      {t(link.nameKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/70">
            {t("footer.rights")}
          </p>
          <p className="text-sm text-white/70">
            {t("footer.madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
