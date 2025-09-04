import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Calendar, MapPin, Trophy, Settings, Users, Heart, Edit } from "lucide-react";
import Navigation from "@/components/Navigation";
import { authAPI, ProfileUser } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";

const Profil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user profile with complete data
        const profileResponse = await authAPI.getProfile();
        // Extract the first user from the array
        const userProfile = profileResponse.user[0];
        setUser(userProfile);
        
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données utilisateur. Veuillez vous reconnecter.",
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-foreground mb-4">Utilisateur non trouvé</h1>
              <Button onClick={() => navigate('/login')}>Se connecter</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const displayName = user.name || user.username || user.email;

  // Use actual registration data from user profile  
  const mesCoursesParticipant = user.registrations?.map(registration => ({
    id: registration.registration_id,
    eventId: registration.stage?.event?.event_id,
    title: registration.stage?.event?.event_name || 'Course inconnue',
    date: registration.stage?.event?.start_time || '',
    status: registration.stage?.event?.start_time ? 
      (new Date(registration.stage.event.start_time) > new Date() ? 'À venir' : 'Terminé') : 
      'Date inconnue',
    position: registration.ranking?.rank_position || null,
    temps: null // No total_time field available in current API structure
  })) || [];

  const mesCoursesOrganisateur = user.events?.map(event => ({
    id: event.event_id,
    title: event.event_name,
    date: event.start_time ? event.start_time.split('T')[0] : 'Date inconnue',
    participants: 0, // Would be calculated from registrations
    status: "Publié"
  })) || [];

  const getStatusBadge = (status: string) => {
    const variants = {
      "À venir": "bg-primary text-primary-foreground",
      "Terminé": "bg-muted text-muted-foreground",
      "Publié": "bg-green-500 text-white",
      "Brouillon": "bg-yellow-500 text-white"
    };
    return variants[status as keyof typeof variants] || "bg-muted text-muted-foreground";
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background page-content">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-card rounded-2xl shadow-elegant p-6 md:p-8 mb-8 border">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.avatar_url || ""} />
                  <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                    {displayName.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">{displayName}</h1>
                  <p className="text-muted-foreground mb-2">{user.email}</p>
                  <Badge variant="secondary" className="mb-2">
                    Utilisateur
                  </Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <Button asChild>
                  <Link to="/create-event" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
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
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-6 border-t border-border">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-primary mb-2">{user.registrations?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Courses participées</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-secondary-foreground mb-2">{user.events?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Courses organisées</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="courses-participees" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="courses-participees" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Participations
              </TabsTrigger>
              <TabsTrigger value="courses-creees" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Mes événements
              </TabsTrigger>
              <TabsTrigger value="profil" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Paramètres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses-participees">
              {mesCoursesParticipant.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mesCoursesParticipant.map((course) => (
                    <Card key={course.id} className="hover-lift cursor-pointer">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <Badge className={getStatusBadge(course.status)}>
                            {course.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(course.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          {course.position && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Trophy className="w-4 h-4" />
                              <span>Position: {course.position}</span>
                            </div>
                          )}
                        </div>
                        <Button className="w-full mt-4" variant="outline" asChild>
                          <Link to={course.eventId ? `/events/${course.eventId}` : '/events'}>
                            Voir détails
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Aucune participation</h3>
                  <p className="text-muted-foreground mb-4">Vous n'avez participé à aucune course pour le moment.</p>
                  <Button asChild>
                    <Link to="/events">Découvrir les événements</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="courses-creees">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Mes événements créés</h2>
                  <Button asChild>
                    <Link to="/create-event" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Nouvel événement
                    </Link>
                  </Button>
                </div>
              </div>
              
              {mesCoursesOrganisateur.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mesCoursesOrganisateur.map((course) => (
                    <Card key={course.id} className="hover-lift cursor-pointer">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <Badge className={getStatusBadge(course.status)}>
                            {course.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(course.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{course.participants} participants</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1">
                            Modifier
                          </Button>
                          <Button size="sm" className="flex-1" asChild>
                            <Link to={`/events/${course.id}`}>Voir</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Plus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Aucune course créée</h3>
                  <p className="text-muted-foreground mb-4">Vous n'avez pas encore créé d'événement.</p>
                  <Button asChild>
                    <Link to="/create-event">Créer mon premier événement</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="profil">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Gérez vos informations de profil et vos préférences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Nom d'utilisateur</label>
                      <p className="text-foreground">{user.username || "Non défini"}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-foreground">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                      <p className="text-foreground">{user.name || "Non défini"}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Date d'inscription</label>
                      <p className="text-foreground">Non disponible</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-border">
                    <div className="flex gap-4">
                      <Button variant="outline" asChild>
                        <Link to="/settings">Modifier le profil</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/settings">Paramètres du compte</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Profil;