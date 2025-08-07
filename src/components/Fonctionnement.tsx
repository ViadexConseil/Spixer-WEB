import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Download, LogIn, Play } from "lucide-react";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const StepCard = ({ number, title, description, icon, index }: StepCardProps) => {
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
      className="text-center opacity-0"
      style={{ animationDelay: `${0.2 * index}s` }}
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-pulse-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-pulse-500 rounded-full flex items-center justify-center text-pulse-500 font-bold text-sm">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Fonctionnement = () => {
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
    <section className="py-16 md:py-20 bg-white" id="fonctionnement" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="pulse-chip mx-auto mb-4 opacity-0 fade-in-element">
            <span>Comment ça marche</span>
          </div>
          <h2 className="section-title mb-4 opacity-0 fade-in-element">
            Démarrez en 3 étapes simples
          </h2>
          <p className="section-subtitle mx-auto opacity-0 fade-in-element">
            Un processus simplifié pour accéder à nos services de chronométrage intelligent.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <StepCard
            number="1"
            title="Téléchargez l'app"
            description="Installez Spixer sur votre smartphone pour accéder à toutes nos fonctionnalités."
            icon={<Download size={24} />}
            index={0}
          />
          <StepCard
            number="2"
            title="Connectez-vous"
            description="Créez votre compte ou connectez-vous pour personnaliser votre expérience."
            icon={<LogIn size={24} />}
            index={1}
          />
          <StepCard
            number="3"
            title="Suivez vos courses en live"
            description="Profitez du suivi en temps réel et des fonctionnalités avancées de Spixer."
            icon={<Play size={24} />}
            index={2}
          />
        </div>
      </div>
    </section>
  );
};

export default Fonctionnement;