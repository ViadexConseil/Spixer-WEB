import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, BarChart3, Users, Settings, TrendingUp, Bell } from "lucide-react";

const DashboardAccess = () => {
  const { user, hasRole } = useAuth();

  if (!user) {
    return null;
  }

  const dashboards = [];

  if (hasRole('admin')) {
    dashboards.push({
      title: "Administration",
      description: "Gérez la plateforme, les utilisateurs et les événements",
      icon: Shield,
      href: "/admin",
      color: "bg-red-50 text-red-600 border-red-200",
      features: ["Gestion des utilisateurs", "Modération des événements", "Analyses globales", "Configuration système"]
    });
  }

  if (hasRole('organizer')) {
    dashboards.push({
      title: "Organisateur",
      description: "Gérez vos événements et suivez les performances",
      icon: BarChart3,
      href: "/organizer",
      color: "bg-blue-50 text-blue-600 border-blue-200",
      features: ["Événements en direct", "Gestion des participants", "Analyses de performance", "Outils d'organisation"]
    });
  }

  if (dashboards.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Vos tableaux de bord</h2>
        <p className="text-muted-foreground">
          Accédez à vos outils de gestion et d'analyse
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {dashboards.map((dashboard) => (
          <Card key={dashboard.href} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${dashboard.color}`}>
                  <dashboard.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">{dashboard.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {dashboard.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {dashboard.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button asChild className="w-full">
                <Link to={dashboard.href}>
                  Accéder au tableau de bord
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Profil</p>
                <p className="text-xs text-muted-foreground">Gérer mon compte</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Paramètres</p>
                <p className="text-xs text-muted-foreground">Configuration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Activité</p>
                <p className="text-xs text-muted-foreground">Mes statistiques</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Notifications</p>
                <p className="text-xs text-muted-foreground">Alertes importantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAccess;