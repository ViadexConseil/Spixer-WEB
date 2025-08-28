
import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-12">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/lovable-uploads/ea09aba0-54c8-4977-ac16-dc239a0a7184.png" 
              alt="Spixer Logo" 
              className="h-12 mb-4" 
            />
            <p className="text-gray-400 mb-4 max-w-md">
              Révolutionnez vos événements sportifs avec la technologie de chronométrage 
              la plus avancée au monde.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Liens légaux */}
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Mentions légales</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">RGPD</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Conditions d'utilisation</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Support technique</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Formation</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Spixer. Tous droits réservés. Version Spixer 2025 Beta
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
