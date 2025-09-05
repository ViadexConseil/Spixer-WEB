import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Users, Share2, Heart, Trophy, Video, Info, Map, Play, Clock, Medal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { eventsAPI, stagesAPI, rankingsAPI, Event, Stage, Ranking } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const EventDetail = () => {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [stageRankings, setStageRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRankings, setLoadingRankings] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        const eventData = await eventsAPI.get(id);
        setEvent(eventData);

        const stagesData = await stagesAPI.getByEvent(id);
        setStages(stagesData);

        // Pre-select first stage if available
        if (stagesData.length > 0) {
          setSelectedStage(stagesData[0]);
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

    fetchEventData();
  }, [id]);

  useEffect(() => {
    const fetchStageRankings = async () => {
      if (!selectedStage) return;
      
      setLoadingRankings(true);
      
      try {
        const rankings = await rankingsAPI.getByStage(selectedStage.id);
        setStageRankings(rankings);
      } catch (error) {
        console.error("Erreur lors du chargement des classements:", error);
        setStageRankings([]);
      } finally {
        setLoadingRankings(false);
      }
    };

    fetchStageRankings();
  }, [selectedStage]);

  const getStageStatus = (stage: Stage): { text: string; class: string; showRankings: boolean } => {
    const now = new Date();
    const startTime = new Date(stage.start_time);
    const endTime = new Date(stage.end_time);
    
    if (now < startTime) {
      return { text: "À venir", class: "bg-blue-500 text-white", showRankings: false };
    }
    if (now >= startTime && now <= endTime) {
      return { text: "En cours", class: "bg-green-500 text-white animate-pulse", showRankings: true };
    }
    return { text: "Terminé", class: "bg-gray-500 text-white", showRankings: true };
  };

  const getEventStatus = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return { text: "Terminé", class: "bg-gray-500 text-white" };
    if (daysDiff === 0) return { text: "Aujourd'hui", class: "bg-red-500 text-white" };
    if (daysDiff <= 7) return { text: "Cette semaine", class: "bg-orange-500 text-white" };
    return { text: "À venir", class: "bg-primary text-primary-foreground" };
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background page-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des détails...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background page-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-foreground mb-4">Événement non trouvé</h1>
              <Button asChild>
                <Link to="/events">Retour aux événements</Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const eventStatus = getEventStatus(event.start_time);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background page-content">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-card rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-64 md:h-80">
              <img 
                src={event.images?.[0] || event.image_url || "/lovable-uploads/d8c8f0dd-a457-4a2d-b79b-5a64a0fd5515.png"} 
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 md:p-8 text-white">
                  <Badge className={`mb-4 ${eventStatus.class}`}>
                    {eventStatus.text}
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
                      <span>{stages.length} épreuve{stages.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                <p className="text-muted-foreground flex-1">{event.description}</p>
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
                </div>
              </div>
            </div>
          </div>

          {/* Stages Section */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Stages List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Épreuves ({stages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stages.map((stage) => {
                    const stageStatus = getStageStatus(stage);
                    return (
                      <div
                        key={stage.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                          selectedStage?.id === stage.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedStage(stage)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{stage.name}</h3>
                          <Badge className={stageStatus.class}>
                            {stageStatus.text}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(stage.start_time).toLocaleString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            <span>Max {stage.max_participants || 'illimité'} participants</span>
                          </div>
                          {stageStatus.showRankings && (
                            <div className="flex items-center gap-2 text-primary">
                              <Medal className="w-3 h-3" />
                              <span>Classement disponible</span>
                            </div>
                          )}
                        </div>
                        {selectedStage?.id === stage.id && (
                          <Button size="sm" className="w-full mt-3" asChild>
                            <Link to={`/events/${event.id}/stages/${stage.id}/register`}>
                              Participer à cette épreuve
                            </Link>
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  
                  {stages.length === 0 && (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Aucune épreuve disponible</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stage Details & Rankings */}
            <div className="lg:col-span-2">
              {selectedStage ? (
                <Tabs defaultValue="ranking" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="ranking" className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Classement
                    </TabsTrigger>
                    <TabsTrigger value="details" className="flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Détails
                    </TabsTrigger>
                    <TabsTrigger value="live" className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Live
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="ranking">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Classement - {selectedStage.name}</span>
                          <Badge variant="outline">
                            {stageRankings.length} participant{stageRankings.length > 1 ? 's' : ''}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loadingRankings ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Chargement du classement...</p>
                          </div>
                        ) : stageRankings.length > 0 ? (
                          <div className="space-y-3">
                            {stageRankings.map((runner, index) => (
                              <div key={runner.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                    runner.rank_position === 1 ? 'bg-yellow-500' :
                                    runner.rank_position === 2 ? 'bg-gray-400' :
                                    runner.rank_position === 3 ? 'bg-amber-600' : 'bg-muted-foreground'
                                  }`}>
                                    {runner.rank_position === 1 && <Medal className="w-5 h-5" />}
                                    {runner.rank_position !== 1 && runner.rank_position}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-foreground">{runner.user_email}</div>
                                    <div className="text-sm text-muted-foreground">
                                      Position {runner.rank_position}
                                    </div>
                                  </div>
                                </div>
                                {runner.rank_position <= 3 && (
                                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold text-foreground">Classement non disponible</h3>
                            <p className="text-muted-foreground text-sm">
                              {getStageStatus(selectedStage).showRankings 
                                ? "Aucun résultat pour le moment" 
                                : "Les résultats seront disponibles pendant ou après l'épreuve"}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="details">
                    <Card>
                      <CardHeader>
                        <CardTitle>Détails de l'épreuve</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Nom de l'épreuve</label>
                              <p className="text-foreground font-semibold">{selectedStage.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Description</label>
                              <p className="text-foreground">{selectedStage.description || "Aucune description disponible"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Âge minimum</label>
                              <p className="text-foreground">{(selectedStage as any).min_age || "Aucune restriction"} ans</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Début</label>
                              <p className="text-foreground font-semibold">
                                {new Date(selectedStage.start_time).toLocaleString('fr-FR')}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Fin</label>
                              <p className="text-foreground font-semibold">
                                {new Date(selectedStage.end_time).toLocaleString('fr-FR')}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Participants max</label>
                              <p className="text-foreground">{selectedStage.max_participants || "Illimité"}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="live">
                    <Card>
                      <CardHeader>
                        <CardTitle>Suivi en direct</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <Play className="w-16 h-16 mx-auto mb-4" />
                            <p className="text-lg font-medium">Suivi en direct</p>
                            <p className="text-sm">Disponible pendant l'épreuve</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Sélectionnez une épreuve
                    </h3>
                    <p className="text-muted-foreground">
                      Choisissez une épreuve dans la liste pour voir les détails et classements
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;