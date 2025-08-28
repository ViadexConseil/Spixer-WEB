import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, MapPin, Users, Share2, Heart, Trophy, Video, Info, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { eventsAPI, stagesAPI, rankingsAPI, Event, Stage, Ranking } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const CourseDetail = () => {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        const eventData = await eventsAPI.get(id);
        setEvent(eventData);

        const stagesData = await stagesAPI.getByEvent(id);
        setStages(stagesData);

        // Fetch rankings for all stages and combine them
        if (stagesData.length > 0) {
          const allRankings = await Promise.all(
            stagesData.map(stage => rankingsAPI.getByStage(stage.id))
          );
          // Flatten the array of arrays and sort by rank
          const combinedRankings = allRankings.flat().sort((a, b) => a.rank_position - b.rank_position);
          setRankings(combinedRankings);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur API",
          description: "Impossible de charger les détails de l'événement.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const getStatusBadge = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return { text: "Terminé", class: "bg-gray-500 text-white" };
    if (daysDiff === 0) return { text: "Aujourd'hui", class: "bg-red-500 text-white" };
    if (daysDiff <= 7) return { text: "Cette semaine", class: "bg-orange-500 text-white" };
    return { text: "À venir", class: "bg-spixer-blue text-white" };
  };

  const isRegistrationOpen = (event: Event): boolean => {
    if (!event.registration_end_time) return true; // No deadline means always open
    if (event.is_draft === 1) return false; // Draft events not open for registration
    if (event.cancel_reason) return false; // Cancelled events not open
    
    const now = new Date();
    const deadline = new Date(event.registration_end_time);
    return now < deadline;
  };

  const getRegistrationTimeRemaining = (event: Event): { hours: number; minutes: number } | null => {
    if (!event.registration_end_time || !isRegistrationOpen(event)) return null;
    
    const now = new Date();
    const deadline = new Date(event.registration_end_time);
    const timeDiff = deadline.getTime() - now.getTime();
    
    if (timeDiff <= 0) return null;
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  const getRegistrationStatusMessage = (event: Event): { message: string; canRegister: boolean } => {
    if (event.is_draft === 1) {
      return { message: "Événement en préparation", canRegister: false };
    }
    
    if (event.cancel_reason) {
      return { message: "Événement annulé", canRegister: false };
    }
    
    if (!event.registration_end_time) {
      return { message: "Inscriptions ouvertes", canRegister: true };
    }
    
    if (!isRegistrationOpen(event)) {
      return { message: "Inscriptions fermées", canRegister: false };
    }
    
    const timeRemaining = getRegistrationTimeRemaining(event);
    if (timeRemaining && timeRemaining.hours < 24) {
      if (timeRemaining.hours === 0) {
        return { 
          message: `Plus que ${timeRemaining.minutes}min pour s'inscrire`, 
          canRegister: true 
        };
      }
      return { 
        message: `Plus que ${timeRemaining.hours}h${timeRemaining.minutes.toString().padStart(2, '0')} pour s'inscrire`, 
        canRegister: true 
      };
    }
    
    return { message: "Inscriptions ouvertes", canRegister: true };
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 page-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des détails...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 page-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Événement non trouvé</h1>
              <Button asChild>
                <a href="/courses">Retour aux événements</a>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const status = getStatusBadge(event.start_time);
  const registrationStatus = getRegistrationStatusMessage(event);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 page-content">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-elegant overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img 
              src="/lovable-uploads/d8c8f0dd-a457-4a2d-b79b-5a64a0fd5515.png" 
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 md:p-8 text-white">
                <Badge className={`mb-4 ${status.class}`}>
                  {status.text}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.start_time).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.city}, {event.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{stages.reduce((total, stage) => total + stage.max_participants, 0)} places max</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            {/* Registration Status Banner */}
            {event.registration_end_time && (
              <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">
                    {registrationStatus.message}
                  </span>
                  {event.registration_end_time && (
                    <span className="text-xs text-blue-600">
                      Limite: {new Date(event.registration_end_time).toLocaleString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
              <p className="text-gray-600 flex-1">{event.description}</p>
              <div className="flex gap-3">
                <Button 
                  variant={isFollowing ? "default" : "outline"} 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className="flex items-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
                  {isFollowing ? 'Suivi' : 'Suivre'}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Partager
                </Button>
                {registrationStatus.canRegister ? (
                  <Button className="bg-spixer-orange hover:bg-spixer-orange-dark" asChild>
                    <a href={`/courses/${event.id}/participer`}>Participer</a>
                  </Button>
                ) : (
                  <Button disabled className="bg-gray-400 cursor-not-allowed">
                    {registrationStatus.message}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="classement" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classement" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Classement
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Vidéo
            </TabsTrigger>
            <TabsTrigger value="carte" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Carte GPX
            </TabsTrigger>
            <TabsTrigger value="infos" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Infos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classement">
            <Card>
              <CardHeader>
                <CardTitle>Classement</CardTitle>
              </CardHeader>
              <CardContent>
                {rankings.length > 0 ? (
                  <div className="space-y-4">
                    {rankings.map((runner) => (
                      <div key={runner.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            runner.rank_position === 1 ? 'bg-yellow-500' :
                            runner.rank_position === 2 ? 'bg-gray-400' :
                            runner.rank_position === 3 ? 'bg-amber-600' : 'bg-gray-300'
                          }`}>
                            {runner.rank_position}
                          </div>
                          <div>
                            <div className="font-semibold">{runner.user_email}</div>
                            <div className="text-sm text-gray-600">{runner.stage_name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold">Classement non disponible</h3>
                    <p className="text-gray-600 text-sm">Les résultats seront affichés ici une fois disponibles.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video">
            <Card>
              <CardHeader>
                <CardTitle>Replay vidéo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Video className="w-16 h-16 mx-auto mb-4" />
                    <p>Replay vidéo à venir</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="carte">
            <Card>
              <CardHeader>
                <CardTitle>Carte GPX interactive</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Map className="w-16 h-16 mx-auto mb-4" />
                    <p>Carte interactive à venir</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="infos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Épreuves disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stages.map((stage) => (
                      <div key={stage.id} className="flex justify-between">
                        <span>{stage.name}</span>
                        <span className="font-semibold">{stage.max_participants} places</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations pratiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Date</span>
                      <span className="font-semibold">{new Date(event.start_time).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Heure</span>
                      <span className="font-semibold">{new Date(event.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lieu</span>
                      <span className="font-semibold">{event.city}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Partenaire officiel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-8">
                    <img src="/logo.svg" alt="Partenaire" className="h-16" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;