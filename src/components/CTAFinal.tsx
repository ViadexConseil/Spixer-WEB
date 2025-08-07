import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Smartphone, Download, Users } from "lucide-react";

const CTAFinal = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [userAgent, setUserAgent] = useState<string>("");

  useEffect(() => {
    setUserAgent(navigator.userAgent);
  }, []);

  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("animate-fade-in");
              }, index * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleDownloadClick = () => {
    if (isIOS) {
      // Redirection vers App Store (URL à remplacer)
      window.open("https://apps.apple.com/", "_blank");
    } else if (isAndroid) {
      // Redirection vers Google Play (URL à remplacer)
      window.open("https://play.google.com/", "_blank");
    } else {
      // Formulaire d'accès bêta pour les autres appareils
      document.getElementById("beta-access")?.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-pulse-500 to-pulse-600 text-white relative overflow-hidden" id="cta-final" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="section-container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 opacity-0 fade-in-element">
            Prêt à révolutionner vos courses ?
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8 opacity-0 fade-in-element">
            Rejoignez la révolution du chronométrage sportif avec Spixer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Bouton Créer un compte */}
          <div className="opacity-0 fade-in-element">
            <a
              href="/login"
              className="block w-full bg-white text-spixer-blue rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg text-center"
            >
              <Users size={32} className="mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Créer un compte</h3>
              <p className="text-sm opacity-70">Rejoignez la communauté Spixer</p>
            </a>
          </div>

          {/* Bouton Télécharger l'app */}
          <div className="opacity-0 fade-in-element">
            <button
              onClick={handleDownloadClick}
              className="w-full bg-white text-spixer-blue rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Download size={32} className="mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Télécharger l'application</h3>
              <p className="text-sm opacity-70">
                {isIOS ? "Disponible sur l'App Store" : isAndroid ? "Disponible sur Google Play" : "Bientôt disponible"}
              </p>
            </button>
          </div>

          {/* Bouton Voir les offres */}
          <div className="opacity-0 fade-in-element">
            <a
              href="/pricing"
              className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg text-center"
            >
              <ArrowRight size={32} className="mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Voir les offres</h3>
              <p className="text-sm opacity-70">Découvrez nos plans tarifaires</p>
            </a>
          </div>
        </div>

        {/* Call to action principal */}
        <div className="text-center opacity-0 fade-in-element">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <span className="text-sm font-medium">🚀 Plus de 50 000 utilisateurs nous font déjà confiance</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleDownloadClick}
              className="flex items-center justify-center group bg-white text-pulse-600 font-semibold py-4 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {isIOS ? "Télécharger sur iOS" : isAndroid ? "Télécharger sur Android" : "Demander un accès"}
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button className="text-white border border-white/30 hover:border-white font-medium py-4 px-8 rounded-full hover:bg-white/10 transition-all duration-300">
              En savoir plus
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAFinal;