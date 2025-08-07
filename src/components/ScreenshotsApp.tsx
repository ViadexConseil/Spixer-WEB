import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ScreenshotsApp = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEmailField, setShowEmailField] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const screenshots = [
    {
      id: "nouvelle-interface",
      title: "Interface moderne",
      description: "Une interface utilisateur repensée pour une meilleure expérience",
      image: "/lovable-uploads/45a86609-bd8a-42eb-8be1-602ed7e90824.png"
    },
    {
      id: "classement",
      title: "Classement en temps réel",
      description: "Suivez les positions en direct avec mise à jour instantanée",
      image: "/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png"
    },
    {
      id: "video",
      title: "Suivi vidéo intelligent",
      description: "Reconnaissance automatique et suivi des participants",
      image: "/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png"
    },
    {
      id: "carte",
      title: "Carte interactive",
      description: "Visualisation du parcours et positions GPS en temps réel",
      image: "/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png"
    }
  ];
  
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

  // Auto-cycle through screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [screenshots.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const handleNotifyClick = () => {
    setShowEmailField(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre adresse email.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Merci !",
        description: "Vous serez notifié dès que l'application sera disponible.",
      });
      setEmail("");
      setShowEmailField(false);
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <section className="py-16 md:py-20 bg-white" id="screenshots" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="pulse-chip mx-auto mb-4 opacity-0 fade-in-element">
            <span>Application Mobile</span>
          </div>
          <h2 className="section-title mb-4 opacity-0 fade-in-element">
            Découvrez l'interface Spixer
          </h2>
          <p className="section-subtitle mx-auto opacity-0 fade-in-element">
            Une expérience utilisateur intuitive pour tous vos besoins de chronométrage.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Screenshots Carousel */}
          <div className="relative order-2 lg:order-1 opacity-0 fade-in-element">
            <div className="relative w-full max-w-sm mx-auto">
              {/* Phone Frame */}
              <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-black rounded-[2.5rem] overflow-hidden">
                  {/* Screenshot Display */}
                  <div className="relative h-[600px] overflow-hidden">
                    {screenshots.map((screenshot, index) => (
                      <div
                        key={screenshot.id}
                        className={cn(
                          "absolute inset-0 transition-opacity duration-700",
                          currentIndex === index ? "opacity-100" : "opacity-0"
                        )}
                      >
                        <img
                          src={screenshot.image}
                          alt={screenshot.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
              
              {/* Dots Indicator */}
              <div className="flex justify-center mt-6 space-x-2">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
                      currentIndex === index ? "bg-pulse-500" : "bg-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 opacity-0 fade-in-element">
            <div className="space-y-8">
              {screenshots.map((screenshot, index) => (
                <div
                  key={screenshot.id}
                  className={cn(
                    "p-6 rounded-2xl transition-all duration-500",
                    currentIndex === index 
                      ? "bg-pulse-50 border-2 border-pulse-200 shadow-lg" 
                      : "bg-gray-50 border-2 border-transparent hover:border-gray-200"
                  )}
                  onClick={() => setCurrentIndex(index)}
                >
                  <h3 className={cn(
                    "text-xl font-semibold mb-3 transition-colors duration-300",
                    currentIndex === index ? "text-pulse-600" : "text-gray-800"
                  )}>
                    {screenshot.title}
                  </h3>
                  <p className="text-gray-600">{screenshot.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-br from-pulse-500 to-pulse-600 rounded-2xl text-white">
              <h4 className="text-lg font-semibold mb-2">Disponible bientôt</h4>
              <p className="text-sm opacity-90 mb-4">
                L'application Spixer sera disponible sur iOS et Android. 
                Inscrivez-vous pour être notifié du lancement !
              </p>
              {!showEmailField ? (
                <button 
                  onClick={handleNotifyClick}
                  className="bg-white text-pulse-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Me notifier
                </button>
              ) : (
                <form onSubmit={handleEmailSubmit} className="flex gap-2 items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    className="flex-1 px-3 py-2 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                    disabled={isSubmitting}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "..." : "Valider"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotsApp;