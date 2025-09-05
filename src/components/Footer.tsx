
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
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-1 space-y-4">
              <img 
                src="/lovable-uploads/ea09aba0-54c8-4977-ac16-dc239a0a7184.png" 
                alt="Spixer Logo" 
                className="h-10 sm:h-12 mb-4" 
              />
              <p className="text-gray-300 leading-relaxed max-w-sm text-sm sm:text-base">
                Chronométrage sportif intelligent avec reconnaissance automatique et suivi temps réel.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-3 sm:space-x-4">
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
                    className="text-gray-400 hover:text-white rounded-lg p-2"
                    aria-label={label}
                  >
                    <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-white text-sm sm:text-base">Produit</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {[
                  { label: "Événements", href: "/events" },
                  { label: "Clubs", href: "/clubs" },
                  { label: "Résultats", href: "/results" },
                  { label: "Tarification", href: "/pricing" }
                ].map((item) => (
                  <li key={item.label}>
                    <Link 
                      to={item.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-white text-sm sm:text-base">Support</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {[
                  { label: "Centre d'aide", href: "/faq" },
                  { label: "Contact", href: "/contact" },
                  { label: "Documentation", href: "/faq" },
                  { label: "API", href: "/faq" }
                ].map((item) => (
                  <li key={item.label}>
                    <Link 
                      to={item.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-white text-sm sm:text-base">Légal</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {[
                  { label: "Mentions légales", href: "/privacy" },
                  { label: "Confidentialité", href: "/privacy" },
                  { label: "Conditions", href: "/privacy" },
                  { label: "RGPD", href: "/privacy" }
                ].map((item) => (
                  <li key={item.label}>
                    <Link 
                      to={item.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
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
      <div className="border-t border-gray-700 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <div className="text-center sm:text-left">
              © 2025 Spixer. Tous droits réservés. Version Beta 2025
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 text-center">
              <span>Made with ❤️ in France</span>
              <span className="hidden sm:inline">•</span>
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
