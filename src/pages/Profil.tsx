import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Calendar, MapPin, Trophy, Settings, Users, Play, Heart, Award, Star, Zap, Target, Crown, Shield, Medal, Flame, Clock, MapPin as Location } from "lucide-react";
import Navigation from "@/components/Navigation";
import { authAPI, ProfileUser, Event } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const allBadges: Badge[] = [
  { id: '1', name: 'Premier Pas', description: 'Première course terminée', icon: Play, color: 'bg-green-500', rarity: 'common' },
  { id: '2', name: 'Sprinter', description: 'Course de moins de 5km terminée', icon: Zap, color: 'bg-yellow-500', rarity: 'common' },
  { id: '3', name: 'Marathonien', description: 'Marathon terminé', icon: Trophy, color: 'bg-purple-500', rarity: 'legendary' },
  { id: '4', name: 'Régulier', description: '10 courses terminées', icon: Target, color: 'bg-blue-500', rarity: 'rare' },
  { id: '5', name: 'Vétéran', description: '50 courses terminées', icon: Crown, color: 'bg-orange-500', rarity: 'epic' },
  { id: '6', name: 'Lève-tôt', description: 'Course matinale (avant 7h)', icon: Clock, color: 'bg-indigo-500', rarity: 'common' },
  { id: '7', name: 'Noctambule', description: 'Course nocturne (après 20h)', icon: Star, color: 'bg-purple-600', rarity: 'common' },
  { id: '8', name: 'Démon de Vitesse', description: 'Temps sous les 20min/5km', icon: Flame, color: 'bg-red-500', rarity: 'rare' },
  { id: '9', name: 'Organisateur', description: 'Première course créée', icon: Users, color: 'bg-teal-500', rarity: 'common' },
  { id: '10', name: 'Mentor', description: '10 courses organisées', icon: Shield, color: 'bg-emerald-500', rarity: 'epic' },
  { id: '11', name: 'Explorateur', description: 'Courses dans 5 villes différentes', icon: Location, color: 'bg-cyan-500', rarity: 'rare' },
  { id: '12', name: 'Podium', description: 'Top 3 dans une course', icon: Medal, color: 'bg-amber-500', rarity: 'rare' },
  { id: '13', name: 'Champion', description: '1ère place dans une course', icon: Crown, color: 'bg-yellow-600', rarity: 'epic' },
  { id: '14', name: 'Social', description: '100 participants dans une course créée', icon: Heart, color: 'bg-pink-500', rarity: 'epic' },
  { id: '15', name: 'Perfectionniste', description: 'Course sans aucun arrêt', icon: Target, color: 'bg-slate-500', rarity: 'rare' },
  { id: '16', name: 'Endurant', description: 'Course de plus de 2h', icon: Clock, color: 'bg-stone-500', rarity: 'rare' },
  { id: '17', name: 'Météo Extrême', description: 'Course sous la pluie', icon: Shield, color: 'bg-gray-600', rarity: 'common' },
  { id: '18', name: 'Collectionneur', description: '20 courses différentes', icon: Award, color: 'bg-violet-500', rarity: 'epic' },
  { id: '19', name: 'Fondateur', description: 'Membre depuis le lancement', icon: Star, color: 'bg-gradient-to-r from-purple-500 to-pink-500', rarity: 'legendary' },
  { id: '20', name: 'VIP', description: 'Compte premium actif', icon: Crown, color: 'bg-gradient-to-r from-yellow-400 to-orange-500', rarity: 'legendary' },
  { id: '21', name: 'Team Player', description: 'Course en équipe terminée', icon: Users, color: 'bg-green-600', rarity: 'common' },
  { id: '22', name: 'Aventurier', description: 'Trail ou course nature', icon: MapPin, color: 'bg-lime-600', rarity: 'common' },
  { id: '23', name: 'Motivé', description: '7 jours consécutifs d\'activité', icon: Flame, color: 'bg-red-600', rarity: 'rare' },
  { id: '24', name: 'Influenceur', description: '1000+ vues sur une course', icon: Star, color: 'bg-rose-500', rarity: 'epic' }
];

const getRandomBadges = (badges: Badge[], count: number): Badge[] => {
  const shuffled = [...badges].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const Profil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user profile with complete data
        const profileResponse = await authAPI.getProfile();
        // Extract the first user from the array
        const userProfile = profileResponse.user[0];
        setUser(userProfile);
        
        // Assign 5 random badges to the user
        const randomBadges = getRandomBadges(allBadges, 5);
        setUserBadges(randomBadges);
        
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
        <Navigation />
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
      "À venir": "bg-spixer-blue text-white",
      "Terminé": "bg-gray-500 text-white",
      "Publié": "bg-green-500 text-white",
      "Brouillon": "bg-yellow-500 text-white"
    };
    return variants[status as keyof typeof variants] || "bg-gray-500 text-white";
  };

  return (
    <>
      <Navigation />
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
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-spixer-orange hover:bg-spixer-orange-dark" asChild>
                <a href="/create-event" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Créer un événement
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
            <div className="text-center">
              <div className="text-2xl font-bold text-spixer-blue">{user.events?.length || 0}</div>
              <div className="text-sm text-gray-600">Courses créées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userBadges.length}</div>
              <div className="text-sm text-gray-600">Badges débloqués</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses-participees" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses-participees" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Mes participations
            </TabsTrigger>
            <TabsTrigger value="courses-creees" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Mes courses
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Mes badges
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
                      <a href={course.eventId ? `/events/${course.eventId}` : '#'}>Voir détails</a>
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
                  <a href="/events">Découvrir les événements</a>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="courses-creees">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Mes événements créés</h2>
                <Button className="bg-spixer-orange hover:bg-spixer-orange-dark" asChild>
                  <a href="/create-event" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nouvel événement
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
                        <a href={`/events/${course.id}`}>Voir</a>
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
                <p className="text-gray-600 mb-4">Vous n'avez pas encore créé d'événement.</p>
                <Button className="bg-spixer-orange hover:bg-spixer-orange-dark" asChild>
                  <a href="/create-event">Créer mon premier événement</a>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="badges">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Mes badges</h2>
                <div className="text-sm text-gray-600">
                  {userBadges.length} badge{userBadges.length > 1 ? 's' : ''} débloqué{userBadges.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            {userBadges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userBadges.map((badge) => {
                  const IconComponent = badge.icon;
                  const rarityColors = {
                    common: 'border-gray-300',
                    rare: 'border-blue-400',
                    epic: 'border-purple-400',
                    legendary: 'border-yellow-400'
                  };
                  
                  return (
                    <Card key={badge.id} className={`hover-lift cursor-pointer border-2 ${rarityColors[badge.rarity]}`}>
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center mx-auto mb-3`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs capitalize ${
                            badge.rarity === 'legendary' ? 'text-yellow-600 border-yellow-300' :
                            badge.rarity === 'epic' ? 'text-purple-600 border-purple-300' :
                            badge.rarity === 'rare' ? 'text-blue-600 border-blue-300' :
                            'text-gray-600 border-gray-300'
                          }`}
                        >
                          {badge.rarity}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun badge débloqué</h3>
                <p className="text-gray-600 mb-4">Participez à des courses pour débloquer vos premiers badges !</p>
                <Button asChild>
                  <a href="/events">Découvrir les événements</a>
                </Button>
              </div>
            )}
            
            {/* All Available Badges Section */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Tous les badges disponibles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allBadges.map((badge) => {
                  const IconComponent = badge.icon;
                  const isUnlocked = userBadges.some(userBadge => userBadge.id === badge.id);
                  const rarityColors = {
                    common: 'border-gray-300',
                    rare: 'border-blue-400',
                    epic: 'border-purple-400',
                    legendary: 'border-yellow-400'
                  };
                  
                  return (
                    <Card key={badge.id} className={`border-2 ${rarityColors[badge.rarity]} ${!isUnlocked ? 'opacity-50' : ''}`}>
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 rounded-full ${isUnlocked ? badge.color : 'bg-gray-400'} flex items-center justify-center mx-auto mb-3`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs capitalize ${
                            badge.rarity === 'legendary' ? 'text-yellow-600 border-yellow-300' :
                            badge.rarity === 'epic' ? 'text-purple-600 border-purple-300' :
                            badge.rarity === 'rare' ? 'text-blue-600 border-blue-300' :
                            'text-gray-600 border-gray-300'
                          }`}
                        >
                          {badge.rarity}
                        </Badge>
                        {isUnlocked && (
                          <div className="mt-2">
                            <Badge className="bg-green-500 text-white text-xs">
                              Débloqué
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
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
                    <Button
                      className="bg-spixer-orange hover:bg-spixer-orange-dark"
                      onClick={() => navigate('/settings')}
                    >
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