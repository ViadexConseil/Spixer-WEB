import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, Bell, Shield, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileSettings = () => {
  const settingsCategories = [
    {
      icon: User,
      title: "Informations personnelles",
      description: "Modifiez vos informations de profil, nom, email, etc.",
      action: "Modifier le profil",
      href: "/settings"
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Gérez vos préférences de notifications par email et push.",
      action: "Configurer",
      href: "/settings"
    },
    {
      icon: Shield,
      title: "Sécurité et confidentialité",
      description: "Changez votre mot de passe et gérez vos paramètres de confidentialité.",
      action: "Gérer la sécurité",
      href: "/settings"
    },
    {
      icon: CreditCard,
      title: "Abonnement Premium",
      description: "Gérez votre abonnement Premium et les méthodes de paiement.",
      action: "Voir l'abonnement",
      href: "/pricing"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Paramètres du compte</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.title} className="hover-lift">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={category.href}>{category.action}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSettings;