import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Trophy, Settings } from "lucide-react";
import Navigation from "@/components/Navigation";
import DashboardAccess from "@/components/DashboardAccess";
import RoleStatus from "@/components/RoleStatus";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileParticipations from "@/components/ProfileParticipations";
import ProfileEvents from "@/components/ProfileEvents";
import ProfileSettings from "@/components/ProfileSettings";
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

  const participations = user.registrations?.map(registration => ({
    id: registration.registration_id,
    eventId: registration.stage?.event?.event_id,
    title: registration.stage?.event?.event_name || 'Course inconnue',
    date: registration.stage?.event?.start_time || '',
    status: registration.stage?.event?.start_time ? 
      (new Date(registration.stage.event.start_time) > new Date() ? 'À venir' : 'Terminé') : 
      'Date inconnue',
    position: registration.ranking?.rank_position || null
  })) || [];

  const eventsCreated = user.events?.map(event => ({
    id: event.event_id,
    title: event.event_name,
    date: event.start_time ? event.start_time.split('T')[0] : 'Date inconnue',
    participants: 0,
    status: "Publié"
  })) || [];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background page-content">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Header */}
          <ProfileHeader 
            user={user} 
            participations={participations.length}
            eventsCreated={eventsCreated.length}
          />

          {/* Role Status */}
          <RoleStatus />
          
          {/* Dashboard Access */}
          <DashboardAccess />

          {/* Main Tabs */}
          <Tabs defaultValue="participations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="participations" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Participations
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Mes événements
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Paramètres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="participations">
              <ProfileParticipations participations={participations} />
            </TabsContent>

            <TabsContent value="events">
              <ProfileEvents events={eventsCreated} />
            </TabsContent>

            <TabsContent value="settings">
              <ProfileSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Profil;