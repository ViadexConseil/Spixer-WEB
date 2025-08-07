import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Star, Check, Zap } from "lucide-react";

const PourquoiNous = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
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
    "Précision millimétrique garantie",
    "Installation rapide en 15 minutes",
    "Compatible tous sports et terrains",
    "Interface intuitive et moderne",
    "Support technique 24h/24",
    "Analyses détaillées post-course"
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

          {/* Témoignages */}
          <div className="opacity-0 fade-in-element">
            <h3 className="text-2xl font-semibold mb-6">Ce que disent nos clients</h3>
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section technologie propriétaire */}
        <div className="mt-16 text-center opacity-0 fade-in-element">
          <div className="bg-gradient-to-r from-pulse-500 to-pulse-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Technologie propriétaire</h3>
            <p className="text-lg mb-6 opacity-90 max-w-3xl mx-auto">
              Notre IA développée en interne analyse plus de 1000 points de données par seconde 
              pour une précision inégalée dans le chronométrage sportif.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <div className="text-sm opacity-80">Précision garantie</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">&lt; 1ms</div>
                <div className="text-sm opacity-80">Latence système</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">50k+</div>
                <div className="text-sm opacity-80">Événements traités</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PourquoiNous;