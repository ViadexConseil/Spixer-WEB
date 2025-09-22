import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Calendar, Trophy, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { authAPI, ProfileUser } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Profil = () => {
  console.log("NEW PROFIL COMPONENT LOADING - userBadges should not exist anywhere");
  
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const profileResponse = await authAPI.getProfile();
        const userProfile = profileResponse.user[0];
        console.log("User data loaded:", userProfile);
        setUser(userProfile);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données utilisateur.",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background page-content">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement du profil...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background page-content">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-foreground mb-4">Utilisateur non trouvé</h1>
              <Button onClick={() => navigate('/login')}>Se connecter</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const displayName = user.username || 
    (user.first_name || user.last_name ? 
      `${user.first_name || ''} ${user.last_name || ''}`.trim() : 
      user.username) || 
    user.email;

  const participationCount = user.registrations?.length || 0;
  const eventsCount = user.events?.length || 0;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background page-content">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-center text-center sm:text-left">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar_url || ""} />
                    <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                      {displayName.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
                    <p className="text-muted-foreground mb-3">{user.email}</p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Badge variant="secondary">
                        {user.is_premium ? "Premium" : "Gratuit"}
                      </Badge>
                      {user.roles && user.roles.length > 0 && (
                        <Badge variant="outline">
                          {user.roles.join(", ")}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button asChild>
                    <Link to="/create-event">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un événement
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/settings">
                      <Settings className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{participationCount}</div>
                <div className="text-sm text-muted-foreground">Participations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-secondary-foreground mb-2">{eventsCount}</div>
                <div className="text-sm text-muted-foreground">Événements créés</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{user.volunteer_assignments?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Missions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{user.favorite_sports?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Sports favoris</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Mes participations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {participationCount > 0 
                    ? `Vous avez participé à ${participationCount} course${participationCount > 1 ? 's' : ''}`
                    : "Aucune participation pour le moment"
                  }
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/events">
                    {participationCount > 0 ? "Voir mes courses" : "Découvrir les événements"}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Mes événements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {eventsCount > 0 
                    ? `Vous avez créé ${eventsCount} événement${eventsCount > 1 ? 's' : ''}`
                    : "Aucun événement créé"
                  }
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={eventsCount > 0 ? "/organizer-dashboard" : "/create-event"}>
                    {eventsCount > 0 ? "Gérer mes événements" : "Créer un événement"}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Paramètres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Gérez votre profil et vos préférences
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/settings">
                    Modifier le profil
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profil;