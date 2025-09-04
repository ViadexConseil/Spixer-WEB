
import React from "react";
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-gray-700 py-16">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Newsletter Exclusive
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Restez informé des dernières innovations
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Recevez en avant-première nos nouvelles fonctionnalités, études de cas et conseils d'experts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Input 
                  placeholder="Votre adresse email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl h-12 flex-1"
                />
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl px-6 h-12 font-medium">
                  S'abonner
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
              {/* Company Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <img 
                    src="/lovable-uploads/ea09aba0-54c8-4977-ac16-dc239a0a7184.png" 
                    alt="Spixer Logo" 
                    className="h-16 mb-4" 
                  />
                  <p className="text-gray-300 leading-relaxed max-w-md">
                    Révolutionnez vos événements sportifs avec la technologie de chronométrage 
                    la plus avancée au monde. Intelligence artificielle, reconnaissance automatique, 
                    et précision inégalée.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>contact@spixer.fr</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="w-5 h-5 text-secondary" />
                    <span>+33 1 23 45 67 89</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>Paris, France</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, label: "Facebook" },
                    { icon: Twitter, label: "Twitter" },
                    { icon: Instagram, label: "Instagram" },
                    { icon: Linkedin, label: "LinkedIn" }
                  ].map(({ icon: Icon, label }) => (
                    <Button
                      key={label}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-300 hover:scale-110"
                      aria-label={label}
                    >
                      <Icon size={20} />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white">Produit</h4>
                <ul className="space-y-3">
                  {[
                    { label: "Fonctionnalités", href: "/#services" },
                    { label: "Événements", href: "/events" },
                    { label: "Clubs", href: "/clubs" },
                    { label: "Tarification", href: "/pricing" },
                    { label: "Documentation", href: "/faq" }
                  ].map((item) => (
                    <li key={item.label}>
                      <Link 
                        to={item.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white">Support</h4>
                <ul className="space-y-3">
                  {[
                    { label: "Centre d'aide", href: "/faq" },
                    { label: "Contact", href: "/contact" },
                    { label: "Formation", href: "/contact" },
                    { label: "API", href: "/faq" },
                    { label: "Statut système", href: "#" }
                  ].map((item) => (
                    <li key={item.label}>
                      <Link 
                        to={item.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white">Légal</h4>
                <ul className="space-y-3">
                  {[
                    { label: "Mentions légales", href: "/privacy" },
                    { label: "Politique de confidentialité", href: "/privacy" },
                    { label: "Conditions d'utilisation", href: "/privacy" },
                    { label: "RGPD", href: "/privacy" },
                    { label: "Cookies", href: "/privacy" }
                  ].map((item) => (
                    <li key={item.label}>
                      <Link 
                        to={item.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-8">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-400 text-sm text-center md:text-left">
                © 2025 Spixer. Tous droits réservés. 
                <span className="inline-flex items-center gap-1 ml-2 text-primary">
                  <Sparkles className="w-3 h-3" />
                  Version Spixer 2025 Beta
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Made with ❤️ in France</span>
                <span>•</span>
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
