import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const Partenaires = () => {
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
  
  const partners = [
    { name: "Marathon de Paris", logo: "/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png" },
    { name: "Run Events", logo: "/lovable-uploads/dc13e94f-beeb-4671-8a22-0968498cdb4c.png" },
    { name: "Sport Federation", logo: "/lovable-uploads/fcd4b855-00c6-447e-b4c2-249ed6a92807.png" },
    { name: "Athletic Association", logo: "/lovable-uploads/ea09aba0-54c8-4977-ac16-dc239a0a7184.png" }
  ];

  const testimonials = [
    {
      name: "Jean-François Mercier",
      role: "Directeur Marathon de Paris",
      content: "Spixer nous a permis de réduire les erreurs de chronométrage de 99%. Une révolution pour nos 40 000 participants.",
      avatar: "/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png"
    },
    {
      name: "Caroline Dubois",
      role: "Organisatrice Trail des Vosges",
      content: "L'installation est si simple que nous avons pu nous concentrer sur l'expérience des coureurs. Parfait !",
      avatar: "/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png"
    }
  ];
  
  const showTrustedPartners = false; // Variable pour contrôler l'affichage
  
  if (!showTrustedPartners) return null;
  
  return (
    <section className="py-16 md:py-20 bg-gray-50" id="partenaires" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="pulse-chip mx-auto mb-4 opacity-0 fade-in-element">
            <span>Nos Partenaires</span>
          </div>
          <h2 className="section-title mb-4 opacity-0 fade-in-element">
            Ils nous font confiance
          </h2>
          <p className="section-subtitle mx-auto opacity-0 fade-in-element">
            Plus de 500 événements organisés avec succès grâce à Spixer.
          </p>
        </div>
        
        {/* Logos des partenaires */}
        <div className="mb-16 opacity-0 fade-in-element">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Témoignages d'organisateurs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 fade-in-element"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-gray-700 mb-4 italic text-lg">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-pulse-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistiques */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-0 fade-in-element">
          <div className="text-center">
            <div className="text-4xl font-bold text-pulse-500 mb-2">500+</div>
            <div className="text-gray-600">Événements organisés</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pulse-500 mb-2">2M+</div>
            <div className="text-gray-600">Participants chronométrés</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pulse-500 mb-2">99.9%</div>
            <div className="text-gray-600">Satisfaction client</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partenaires;