import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar, 
  Users, 
  Trophy, 
  Plus,
  Edit,
  Eye,
  Settings,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Activity,
  CheckCircle,
  UserCheck,
  Timer,
  BarChart3,
  Play,
  Pause,
  StopCircle,
  AlertCircle,
  Bell
} from "lucide-react";
import { organizerAPI, eventsAPI, stagesAPI, registrationsAPI, rankingsAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const OrganizerDashboard = () => {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [stages, setStages] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    if (!hasRole('organizer')) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être organisateur pour accéder à cette page.",
        variant: "destructive"
      });
      return;
    }
    
    loadOrganizerData();
  }, []);

  const loadOrganizerData = async () => {
    try {
      setLoading(true);
      const eventsData = await organizerAPI.getEvents();
      setEvents(eventsData);
      
      // Load live events (events currently running)
      const liveEventsData = eventsData.filter(event => {
        const now = new Date();
        return new Date(event.start_time) <= now && new Date(event.end_time) >= now;
      });
      setLiveEvents(liveEventsData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading organizer data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données d'organisateur.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const loadEventDetails = async (eventId) => {
    try {
      const stagesData = await stagesAPI.getByEvent(eventId);
      setStages(stagesData);
      
      // Load registrations for all stages
      const allRegistrations = [];
      for (const stage of stagesData) {
        try {
          const stageRegistrations = await registrationsAPI.getByStage(stage.id);
          allRegistrations.push(...stageRegistrations);
        } catch (error) {
          console.log(`No registrations found for stage ${stage.id}`);
        }
      }
      setRegistrations(allRegistrations);
      
      // Load rankings
      const allRankings = [];
      for (const stage of stagesData) {
        try {
          const stageRankings = await rankingsAPI.getByStage(stage.id);
          allRankings.push(...stageRankings);
        } catch (error) {
          console.log(`No rankings found for stage ${stage.id}`);
        }
      }
      setRankings(allRankings);
      
    } catch (error) {
      console.error('Error loading event details:', error);
    }
  };

  const getEventStats = () => {
    const total = events.length;
    const upcoming = events.filter(e => new Date(e.start_time) > new Date()).length;
    const live = liveEvents.length;
    const completed = events.filter(e => new Date(e.end_time) < new Date()).length;
    
    return { total, upcoming, live, completed };
  };

  const stats = getEventStats();

  if (!hasRole('organizer')) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background page-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <UserCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Accès non autorisé</h1>
              <p className="text-muted-foreground">Vous devez être organisateur pour accéder à cette page.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background page-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement de votre tableau de bord...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background page-content">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Tableau de bord Organisateur</h1>
                <p className="text-muted-foreground">Gérez vos événements et suivez en temps réel</p>
              </div>
              <div className="flex items-center gap-3">
                {liveEvents.length > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    <Activity className="h-4 w-4 mr-1" />
                    {liveEvents.length} événement(s) en cours
                  </Badge>
                )}
                <Button onClick={() => navigate('/create-event')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un événement
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Mes événements</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">En direct</p>
                      <p className="text-2xl font-bold text-red-600">{stats.live}</p>
                    </div>
                    <Activity className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">À venir</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Participants</p>
                      <p className="text-2xl font-bold text-green-600">{registrations.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Live Events Alert */}
          {liveEvents.length > 0 && (
            <Card className="mb-8 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <Bell className="h-5 w-5" />
                  Événements en cours de diffusion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {liveEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <h3 className="font-semibold text-red-800">{event.name}</h3>
                        <p className="text-sm text-red-600">{event.city}, {event.country}</p>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          loadEventDetails(event.id);
                        }}
                      >
                        <Timer className="h-4 w-4 mr-2" />
                        Contrôle Live
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Dashboard */}
          <Tabs defaultValue="management" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="management" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Gestion
              </TabsTrigger>
              <TabsTrigger value="live" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Suivi Live
              </TabsTrigger>
            </TabsList>

            {/* Management Tab */}
            <TabsContent value="management" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Event Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Mes événements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {events.slice(0, 5).map((event) => (
                      <div key={event.id} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{event.name}</h4>
                          <Badge variant={
                            new Date(event.start_time) > new Date() ? "outline" :
                            new Date(event.end_time) < new Date() ? "secondary" : "default"
                          } className="text-xs">
                            {new Date(event.start_time) > new Date() ? "À venir" :
                             new Date(event.end_time) < new Date() ? "Terminé" : "En cours"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{event.city}, {event.country}</p>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 text-xs"
                            onClick={() => {
                              setSelectedEvent(event);
                              loadEventDetails(event.id);
                            }}
                          >
                            Gérer
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            Modifier
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Registration Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Inscriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {registrations.slice(0, 5).map((registration) => (
                      <div key={registration.id} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{registration.user_email}</p>
                          <Badge variant={registration.status === 'approved' ? 'default' : 'outline'} className="text-xs">
                            {registration.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{registration.stage_name}</p>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                            Approuver
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            Refuser
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Volunteer Assignment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Attribution bénévoles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">Zone Départ</p>
                        <Badge variant="outline" className="text-xs">2/4 assignés</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          Assigner
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          Voir équipe
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">Zone Arrivée</p>
                        <Badge variant="default" className="text-xs">4/4 assignés</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          Modifier
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          Voir équipe
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Actions rapides
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start h-9">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un événement
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start h-9">
                      <Users className="h-4 w-4 mr-2" />
                      Inviter des bénévoles
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start h-9">
                      <Trophy className="h-4 w-4 mr-2" />
                      Configurer les prix
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start h-9">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Exporter les données
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Live Tracking Tab */}
            <TabsContent value="live" className="space-y-6">
              {liveEvents.length > 0 ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Suivi en temps réel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Live Controls */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-sm">Contrôles</h3>
                          <div className="flex flex-col gap-2">
                            <Button variant="default" size="sm" className="justify-start">
                              <Play className="h-4 w-4 mr-2" />
                              Démarrer course
                            </Button>
                            <Button variant="outline" size="sm" className="justify-start">
                              <Pause className="h-4 w-4 mr-2" />
                              Pause générale
                            </Button>
                            <Button variant="outline" size="sm" className="justify-start">
                              <StopCircle className="h-4 w-4 mr-2" />
                              Fin de course
                            </Button>
                          </div>
                          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <div className="flex items-center gap-2 text-primary text-sm">
                              <CheckCircle className="h-4 w-4" />
                              Système opérationnel
                            </div>
                          </div>
                        </div>

                        {/* Live Stats */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-sm">En direct</h3>
                          <div className="space-y-3">
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <p className="text-lg font-semibold">147</p>
                              <p className="text-xs text-muted-foreground">Participants actifs</p>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <p className="text-lg font-semibold text-green-600">92</p>
                              <p className="text-xs text-muted-foreground">Arrivées enregistrées</p>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <p className="text-lg font-semibold text-blue-600">55</p>
                              <p className="text-xs text-muted-foreground">En course</p>
                            </div>
                          </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-sm">Activité récente</h3>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                              <p className="font-medium text-green-800">15:42:33 - Arrivée détectée</p>
                              <p className="text-green-600">Coureur #247</p>
                            </div>
                            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                              <p className="font-medium text-blue-800">15:41:15 - Départ</p>
                              <p className="text-blue-600">Coureur #251</p>
                            </div>
                            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                              <p className="font-medium text-yellow-800">15:40:02 - Correction</p>
                              <p className="text-yellow-600">Temps ajusté #245</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Record Management */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Gestion des records
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                            <div>
                              <p className="font-medium text-sm">Jean Dupont</p>
                              <p className="text-xs text-muted-foreground">Temps: 01:23:45</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                              Modifier temps
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                              Disqualifier
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                            <div>
                              <p className="font-medium text-sm">Marie Martin</p>
                              <p className="text-xs text-muted-foreground">Temps: 01:25:12</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                              Modifier temps
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                              Disqualifier
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-400 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                            <div>
                              <p className="font-medium text-sm">Pierre Bernard</p>
                              <p className="text-xs text-muted-foreground">Temps: 01:26:33</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                              Modifier temps
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                              Disqualifier
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Manual Adjustments */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Ajustements manuels
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Correction de temps</h4>
                          <div className="space-y-2">
                            <Input placeholder="Numéro de coureur" className="h-9" />
                            <Input placeholder="Nouveau temps (HH:MM:SS)" className="h-9" />
                            <Button variant="outline" size="sm" className="w-full">
                              Appliquer correction
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Ajustement de position</h4>
                          <div className="space-y-2">
                            <Input placeholder="Numéro de coureur" className="h-9" />
                            <Input placeholder="Nouvelle position" className="h-9" />
                            <Button variant="outline" size="sm" className="w-full">
                              Modifier classement
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Timer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun événement en cours</h3>
                    <p className="text-muted-foreground text-sm">
                      Le suivi live apparaîtra ici lorsque vos événements seront en cours.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Participants Tab */}
            <TabsContent value="participants" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des participants</CardTitle>
                </CardHeader>
                <CardContent>
                  {registrations.length > 0 ? (
                    <div className="space-y-4">
                      {registrations.slice(0, 10).map((registration) => (
                        <div key={registration.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{registration.user_email}</p>
                            <p className="text-sm text-muted-foreground">{registration.stage_name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={registration.status === 'approved' ? 'default' : 'secondary'}>
                              {registration.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun participant inscrit pour le moment.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance de vos événements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Taux de participation moyen</span>
                        <span className="font-bold">92%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Note moyenne des participants</span>
                        <span className="font-bold flex items-center gap-1">
                          4.8 <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Taux de recommandation</span>
                        <span className="font-bold">96%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Évolution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Graphiques détaillés disponibles prochainement.
                      </p>
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

export default OrganizerDashboard;