import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Video, Trophy, Map, Brain, Sparkles, ArrowRight, Target, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  color: string;
  features: string[];
}

const ServiceCard = ({ icon, title, description, index, color, features }: ServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
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
        "group relative bg-card border rounded-3xl p-8 opacity-0 overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer",
        `hover:border-${color}/30`
      )}
      style={{ animationDelay: `${0.15 * index}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}/5 via-transparent to-${color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Animated background elements */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-2xl transition-all duration-700 group-hover:scale-150" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-${color}/10 to-${color}/20 text-${color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* Features List */}
          <ul className="space-y-2 mt-4">
            {features.map((feature, idx) => (
              <li 
                key={idx}
                className={`flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300`}
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                <div className={`w-1.5 h-1.5 rounded-full bg-${color} flex-shrink-0`} />
                {feature}
              </li>
            ))}
          </ul>

          {/* Call to Action */}
          <Button
            variant="ghost"
            className={cn(
              "mt-6 p-0 h-auto font-medium text-${color} hover:text-${color}/80 group/button",
              isHovered && "animate-pulse"
            )}
          >
            En savoir plus 
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/button:translate-x-1" />
          </Button>
        </div>

        {/* Corner decoration */}
        <div className={`absolute bottom-4 right-4 w-8 h-8 bg-gradient-to-br from-${color}/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      </div>
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

  const services = [
    {
      icon: <Video size={28} />,
      title: "Suivi vidéo intelligent",
      description: "Reconnaissance automatique des participants et suivi en temps réel grâce à l'IA avancée.",
      color: "primary",
      features: [
        "IA de reconnaissance faciale",
        "Tracking automatique",
        "Détection multi-angles",
        "Précision 99.7%"
      ]
    },
    {
      icon: <Trophy size={28} />,
      title: "Classements en direct",
      description: "Résultats instantanés et classements mis à jour en temps réel pendant la course.",
      color: "secondary", 
      features: [
        "Mise à jour temps réel",
        "Notifications push",
        "Historique complet",
        "Export données"
      ]
    },
    {
      icon: <Map size={28} />,
      title: "Carte GPX interactive",
      description: "Visualisation du parcours en temps réel avec positions des coureurs et points clés.",
      color: "primary",
      features: [
        "Géolocalisation précise",
        "Zones de passage",
        "Altitude & dénivelé",
        "Partage social"
      ]
    },
    {
      icon: <Brain size={28} />,
      title: "Reconnaissance automatique",
      description: "Identification intelligente des participants sans intervention manuelle.",
      color: "secondary",
      features: [
        "Sans intervention humaine",
        "Multi-participants",
        "Base de données sécurisée",
        "Respect RGPD"
      ]
    }
  ];
  
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-muted/30 via-background to-muted/50" id="services" ref={sectionRef}>
      <div className="container px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium opacity-0 fade-in-element">
            <Sparkles className="w-4 h-4" />
            Nos Services
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold opacity-0 fade-in-element">
            <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Suivez, vivez, mesurez
            </span>
            <br />
            <span className="text-foreground">vos courses autrement</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed opacity-0 fade-in-element">
            Découvrez nos services innovants pour révolutionner votre expérience des courses sportives avec la technologie la plus avancée.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 opacity-0 fade-in-element">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">99.7%</div>
              <div className="text-sm text-muted-foreground">Précision</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1">5K+</div>
              <div className="text-sm text-muted-foreground">Événements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">&lt; 1s</div>
              <div className="text-sm text-muted-foreground">Temps réel</div>
            </div>
          </div>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              index={index}
              color={service.color}
              features={service.features}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 opacity-0 fade-in-element">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl px-8 py-4 font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Target className="w-5 h-5 mr-2" />
            Découvrir toutes nos fonctionnalités
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NosServices;