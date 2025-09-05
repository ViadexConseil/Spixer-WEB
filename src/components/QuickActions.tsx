import React from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Users, 
  Trophy, 
  Search,
  Plus,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QuickActions = () => {
  const actions = [
    {
      title: "Trouver un événement",
      description: "Découvrez les courses près de chez vous",
      icon: Search,
      href: "/events",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      title: "Créer un événement",
      description: "Organisez votre propre course",
      icon: Plus,
      href: "/create-event",
      color: "bg-green-50 text-green-600 border-green-200"
    },
    {
      title: "Rejoindre un club",
      description: "Connectez-vous avec d'autres coureurs",
      icon: Users,
      href: "/clubs",
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      title: "Voir les résultats",
      description: "Consultez vos performances",
      icon: Trophy,
      href: "/results",
      color: "bg-orange-50 text-orange-600 border-orange-200"
    }
  ];

  return (
    <section className="py-8 sm:py-12">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Que voulez-vous faire ?</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Choisissez une action pour commencer</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {actions.map((action) => (
            <Card key={action.href} className="group hover:shadow-md transition-all duration-200 cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <Link to={action.href} className="block">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 sm:mb-4`}>
                    <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  
                  <h3 className="text-sm sm:text-base font-semibold mb-2 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    {action.description}
                  </p>
                  
                  <div className="flex items-center text-xs sm:text-sm text-primary group-hover:translate-x-1 transition-transform">
                    Commencer
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;