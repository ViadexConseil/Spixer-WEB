import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Calendar, MapPin, Trophy, Settings, Users, Play, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import { authAPI, eventsAPI, ProfileUser, Event } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Profil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
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
        
        // Get user events
        const events = await eventsAPI.list();
        setUserEvents(events);
        
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
        <Navbar />
        <div className="min-h-screen bg-gray-50 page-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement du profil...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 page-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Utilisateur non trouvé</h1>
              <Button onClick={() => navigate('/login')}>Se connecter</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const displayName = user.name || user.username || user.email;
  const userRole = userEvents.length > 0 ? 'organisateur' : 'coureur';

  // Use actual registration data from user profile
  const mesCoursesParticipant = user.registrations?.map(registration => ({
    id: registration.registration_id,
    title: registration.stage?.event?.event_name || 'Course inconnue',
    date: registration.stage?.event?.event_start || '',
    status: registration.stage?.event?.event_start ? 
      (new Date(registration.stage.event.event_start) > new Date() ? 'À venir' : 'Terminé') : 
      'Date inconnue',
    position: registration.ranking?.rank_position || null,
    temps: null // No total_time field available in current API structure
  })) || [];

  const mesCoursesOrganisateur = userEvents.map(event => ({
    id: event.id,
    title: event.name,
    date: event.start_time ? event.start_time.split('T')[0] : 'Date inconnue',
    participants: 0, // Would be calculated from registrations
    status: "Publié"
  }));

  const getStatusBadge = (status: string) => {
    const variants = {
      "À venir": "bg-spixer-blue text-white",
      "Terminé": "bg-gray-500 text-white",
      "Publié": "bg-green-500 text-white",
      "Brouillon": "bg-yellow-500 text-white"
    };
    return variants[status as keyof typeof variants] || "bg-gray-500 text-white";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 page-content">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-elegant p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar_url || ""} />
                <AvatarFallback className="text-lg font-semibold bg-spixer-orange text-white">
                  {displayName.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{displayName}</h1>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <Badge variant="outline" className="capitalize">
                  {userRole}
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Paramètres
              </Button>
              <Button className="bg-spixer-orange hover:bg-spixer-orange-dark" asChild>
                <a href="/create" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Créer une course
                </a>
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-spixer-orange">{user.registrations?.length || 0}</div>
            <div className="text-sm text-gray-600">Courses participées</div>
          </div>
            {userRole === 'organisateur' && (
              <div className="text-center">
                <div className="text-2xl font-bold text-spixer-blue">{userEvents.length}</div>
                <div className="text-sm text-gray-600">Courses créées</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">-</div>
              <div className="text-sm text-gray-600">Temps total</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses-participees" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses-participees" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Mes participations
            </TabsTrigger>
            <TabsTrigger value="courses-creees" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Mes courses
            </TabsTrigger>
            <TabsTrigger value="profil" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Mon profil
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
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(course.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {course.position && course.temps && (
                        <>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Trophy className="w-4 h-4" />
                            <span>Position: {course.position}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Play className="w-4 h-4" />
                            <span>Temps: {course.temps}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <Button className="w-full mt-4" variant="outline" asChild>
                      <a href={`/courses/${course.id}`}>Voir détails</a>
                    </Button>
                  </CardContent>
                </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune participation</h3>
                <p className="text-gray-600 mb-4">Vous n'avez participé à aucune course pour le moment.</p>
                <Button asChild>
                  <a href="/courses">Découvrir les courses</a>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="courses-creees">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Mes courses créées</h2>
                <Button className="bg-spixer-orange hover:bg-spixer-orange-dark" asChild>
                  <a href="/create" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nouvelle course
                  </a>
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
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(course.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{course.participants} participants</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        Modifier
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <a href={`/courses/${course.id}`}>Voir</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Plus className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune course créée</h3>
                <p className="text-gray-600 mb-4">Vous n'avez pas encore créé de course.</p>
                <Button className="bg-spixer-orange hover:bg-spixer-orange-dark" asChild>
                  <a href="/create">Créer ma première course</a>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profil">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Gérez vos informations de profil et préférences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nom d'utilisateur</label>
                      <p className="text-lg">{user.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Nom complet</label>
                      <p className="text-lg">{user.name || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Rôle</label>
                      <p className="text-lg capitalize">{userRole}</p>
                    </div>
                     {user.location && (
                       <div>
                         <label className="text-sm font-medium">Localisation</label>
                         <p className="text-lg">{user.location}</p>
                       </div>
                     )}
                     {user.birthdate && (
                       <div>
                         <label className="text-sm font-medium">Date de naissance</label>
                         <p className="text-lg">{new Date(user.birthdate).toLocaleDateString('fr-FR')}</p>
                       </div>
                     )}
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="bg-spixer-orange hover:bg-spixer-orange-dark">
                      Modifier le profil
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