import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Video, Trophy, Map, Brain } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const ServiceCard = ({ icon, title, description, index }: ServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={cardRef}
      className={cn(
        "feature-card glass-card opacity-0 p-6",
        "lg:hover:bg-gradient-to-br lg:hover:from-white lg:hover:to-pulse-50",
        "transition-all duration-300"
      )}
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      <div className="rounded-full bg-pulse-50 w-12 h-12 flex items-center justify-center text-pulse-500 mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const NosServices = () => {
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
  
  return (
    <section className="py-16 md:py-20 bg-gray-50" id="services" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="pulse-chip mx-auto mb-4 opacity-0 fade-in-element">
            <span>Nos Services</span>
          </div>
          <h2 className="section-title mb-4 opacity-0 fade-in-element">
            Suivez, vivez, mesurez <br className="hidden sm:block" />vos courses autrement
          </h2>
          <p className="section-subtitle mx-auto opacity-0 fade-in-element">
            Découvrez nos services innovants pour révolutionner votre expérience des courses sportives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <ServiceCard
            icon={<Video size={24} />}
            title="Suivi vidéo intelligent"
            description="Reconnaissance automatique des participants et suivi en temps réel grâce à l'IA avancée."
            index={0}
          />
          <ServiceCard
            icon={<Trophy size={24} />}
            title="Classements en direct"
            description="Résultats instantanés et classements mis à jour en temps réel pendant la course."
            index={1}
          />
          <ServiceCard
            icon={<Map size={24} />}
            title="Carte GPX interactive"
            description="Visualisation du parcours en temps réel avec positions des coureurs et points clés."
            index={2}
          />
          <ServiceCard
            icon={<Brain size={24} />}
            title="Reconnaissance automatique"
            description="Identification intelligente des participants sans intervention manuelle."
            index={3}
          />
        </div>
      </div>
    </section>
  );
};

export default NosServices;