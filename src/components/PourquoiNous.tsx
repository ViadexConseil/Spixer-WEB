import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Star, Check, Zap } from "lucide-react";

const PourquoiNous = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("animate-fade-in");
              }, index * 150);
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
  
  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Organisatrice Marathon de Paris",
      content: "Spixer a révolutionné notre approche du chronométrage. La précision et la facilité d'utilisation sont remarquables.",
      rating: 5
    },
    {
      name: "Pierre Martin",
      role: "Directeur SportEvents",
      content: "L'intelligence artificielle de Spixer nous fait gagner un temps considérable. Plus d'erreurs de timing !",
      rating: 5
    },
    {
      name: "Sophie Laurent",
      role: "Coach sportif",
      content: "Mes athlètes adorent pouvoir suivre leurs performances en temps réel. C'est motivant et très précis.",
      rating: 5
    }
  ];

  const advantages = [
    "Aucune installation physique requise",
    "Précision garantie à 85%",
    "Compatible tous sports & tous terrains",
    "Interface moderne et intuitive",
    "Support technique 24h/24",
    "Analyse post-course détaillée",
    "Technologie propriétaire",
    "Simplicité de déploiement"
  ];

  return (
    <section className="py-16 md:py-20 bg-gray-50" id="pourquoi-nous" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="pulse-chip mx-auto mb-4 opacity-0 fade-in-element">
            <span>Pourquoi nous choisir</span>
          </div>
          <h2 className="section-title mb-4 opacity-0 fade-in-element">
            La référence du chronométrage intelligent
          </h2>
          <p className="section-subtitle mx-auto opacity-0 fade-in-element">
            Découvrez pourquoi des milliers d'organisateurs nous font confiance pour leurs événements.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Comparatif */}
          <div className="opacity-0 fade-in-element">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <Zap className="mr-3 text-pulse-500" size={24} />
              Spixer vs Solutions classiques
            </h3>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="space-y-4">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-pulse-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="text-gray-800">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section données techniques */}
          <div className="opacity-0 fade-in-element">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <div className="w-2 h-2 bg-spixer-blue rounded-full mr-3 animate-pulse"></div>
              Technologie Spixer
            </h3>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-spixer-blue">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-spixer-blue/5 rounded-xl">
                  <div className="text-3xl font-bold text-spixer-blue mb-2">87%</div>
                  <div className="text-sm text-gray-600">Précision maximale</div>
                </div>
                <div className="text-center p-4 bg-spixer-orange/5 rounded-xl">
                  <div className="text-3xl font-bold text-spixer-orange mb-2">&lt; 50ms</div>
                  <div className="text-sm text-gray-600">Latence système</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-spixer-blue/10 to-spixer-orange/10 rounded-xl">
                <p className="text-center text-gray-700 font-medium">
                  Intelligence artificielle propriétaire développée spécifiquement pour le chronométrage sportif
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton Me notifier avec modal */}
        <div className="mt-16 text-center opacity-0 fade-in-element">
          <div className="bg-gradient-to-r from-spixer-blue to-spixer-orange rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Spixer arrive bientôt !</h3>
            <p className="text-lg mb-6 opacity-90 max-w-3xl mx-auto">
              Soyez parmi les premiers à tester notre plateforme révolutionnaire de chronométrage sportif.
            </p>
            {!showEmailForm ? (
              <button 
                onClick={() => setShowEmailForm(true)}
                className="bg-white text-spixer-blue font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Me notifier du lancement
              </button>
            ) : (
              <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!email || !email.includes("@")) return;
                  setIsSubmitting(true);
                  setTimeout(() => {
                    setIsSubmitting(false);
                    setEmail("");
                    setShowEmailForm(false);
                  }, 1000);
                }}>
                  <div className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
                      disabled={isSubmitting}
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="flex-1 bg-white text-spixer-blue font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? "Envoi..." : "Valider"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEmailForm(false);
                          setEmail("");
                        }}
                        className="px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PourquoiNous;