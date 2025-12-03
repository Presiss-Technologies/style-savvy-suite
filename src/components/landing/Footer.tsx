import { Scissors } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    product: {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "How It Works", href: "#workflow" },
        { name: "Download App", href: "#" },
      ],
    },
    support: {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Video Tutorials", href: "#" },
        { name: "Contact Us", href: "#" },
        { name: "WhatsApp Support", href: "#" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
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
              The complete tailor management software built for modern tailoring 
              businesses in Gujarat and beyond.
            </p>
            <p className="text-sm text-white/70 font-gujarati">
              ગુજરાત ના દરજીઓ માટે સંપૂર્ણ સોફ્ટવેર
            </p>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section, index) => (
            <div key={index}>
              <h4 className="font-bold text-white mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-white/80 hover:text-accent transition-colors"
                    >
                      {link.name}
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
            © 2024 StyleSavvy. All rights reserved.
          </p>
          <p className="text-sm text-white/70">
            Made with ❤️ for Surat's Tailoring Community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
