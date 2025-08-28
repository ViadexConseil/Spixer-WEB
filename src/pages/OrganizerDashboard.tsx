import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, Calendar, Eye } from 'lucide-react';
import { organizerAPI, stagesAPI, registrationsAPI, rankingsAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Event, Stage, Registration, Ranking } from '@/services/api';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsData, stagesData, registrationsData, rankingsData] = await Promise.all([
        organizerAPI.getEvents(),
        stagesAPI.list(),
        registrationsAPI.list(),
        rankingsAPI.list(),
      ]);

      setEvents(eventsData);
      setStages(stagesData);
      setRegistrations(registrationsData);
      setRankings(rankingsData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/courses/${eventId}`);
  };

  const handleCreateEvent = () => {
    navigate('/create-course');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-6 pt-24">
          <div className="text-center">Chargement...</div>
        </div>
        <Footer />
      </>
    );
  }

  // Filter data for organizer's events
  const myEventIds = events.map(e => e.id);
  const myStages = stages.filter(stage => myEventIds.includes(stage.event_id));
  const myStageIds = myStages.map(s => s.id);
  const myRegistrations = registrations.filter(reg => myStageIds.includes(reg.stage_id));
  const myRankings = rankings.filter(rank => myStageIds.includes(rank.stage_id));

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tableau de Bord Organisateur</h1>
        <p className="text-muted-foreground">Gérez vos événements, étapes et inscriptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Événements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Étapes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStages.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myRegistrations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classements</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myRankings.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Mes Événements</TabsTrigger>
          <TabsTrigger value="stages">Mes Étapes</TabsTrigger>
          <TabsTrigger value="registrations">Inscriptions</TabsTrigger>
          <TabsTrigger value="rankings">Classements</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mes Événements</CardTitle>
                <CardDescription>Gérez vos événements sportifs</CardDescription>
              </div>
              <Button onClick={handleCreateEvent}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvel Événement
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun événement créé</p>
                    <Button onClick={handleCreateEvent} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer votre premier événement
                    </Button>
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <p className="text-sm">{event.city}, {event.country}</p>
                        <p className="text-sm">{new Date(event.start_time).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewEvent(event.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stages">
          <Card>
            <CardHeader>
              <CardTitle>Mes Étapes</CardTitle>
              <CardDescription>Gérez les étapes de vos événements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myStages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucune étape créée</p>
                  </div>
                ) : (
                  myStages.map((stage) => (
                    <div key={stage.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{stage.name}</h3>
                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary">{stage.category_label}</Badge>
                        </div>
                        <p className="text-sm mt-1">
                          {new Date(stage.start_time).toLocaleDateString()} - {new Date(stage.end_time).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>Inscriptions à mes événements</CardTitle>
              <CardDescription>Gérez les inscriptions des participants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myRegistrations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucune inscription pour le moment</p>
                  </div>
                ) : (
                  myRegistrations.map((registration) => (
                    <div key={registration.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{registration.user_email}</h3>
                        <p className="text-sm text-muted-foreground">{registration.event_name} - {registration.stage_name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={registration.status === 'approved' ? 'default' : 'secondary'}>
                            {registration.status}
                          </Badge>
                          <Badge variant="outline">{registration.type}</Badge>
                        </div>
                        <p className="text-sm mt-1">{new Date(registration.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings">
          <Card>
            <CardHeader>
              <CardTitle>Classements de mes événements</CardTitle>
              <CardDescription>Gérez les résultats et classements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myRankings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun classement pour le moment</p>
                  </div>
                ) : (
                  myRankings.map((ranking) => (
                    <div key={ranking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Position #{ranking.rank_position}</h3>
                        <p className="text-sm text-muted-foreground">{ranking.user_email}</p>
                        <p className="text-sm">{ranking.event_name} - {ranking.stage_name}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
      <Footer />
    </>
  );
};

export default OrganizerDashboard;