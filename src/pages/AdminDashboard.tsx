import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Users, Calendar, Trophy, ArrowLeft, Save } from 'lucide-react';
import { categoriesAPI, eventsAPI, stagesAPI, registrationsAPI, rankingsAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import type { Category, Event, Stage, Registration, Ranking } from '@/services/api';

const AdminDashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<Event>>({});
  const [eventStages, setEventStages] = useState<Stage[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, eventsData, stagesData, registrationsData, rankingsData] = await Promise.all([
        categoriesAPI.list(),
        eventsAPI.list(),
        stagesAPI.list(),
        registrationsAPI.list(),
        rankingsAPI.list(),
      ]);

      setCategories(categoriesData);
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

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await categoriesAPI.create({ label: newCategory });
      setNewCategory('');
      loadData();
      toast({
        title: "Succès",
        description: "Catégorie créée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la catégorie",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await categoriesAPI.delete(id);
      loadData();
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await eventsAPI.delete(id);
      loadData();
      toast({
        title: "Succès",
        description: "Événement supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = async (event: Event) => {
    setSelectedEvent(event);
    setEditingEvent(event);
    try {
      const eventStagesData = await stagesAPI.getByEvent(event.id);
      setEventStages(eventStagesData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les étapes de l'événement",
        variant: "destructive",
      });
    }
  };

  const handleSaveEvent = async () => {
    if (!selectedEvent || !editingEvent.name || !editingEvent.description) return;

    try {
      await eventsAPI.update(selectedEvent.id, {
        name: editingEvent.name,
        description: editingEvent.description,
        start_time: editingEvent.start_time,
        end_time: editingEvent.end_time,
      });
      
      loadData();
      setSelectedEvent(null);
      setEditingEvent({});
      toast({
        title: "Succès",
        description: "Événement mis à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'événement",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    try {
      await stagesAPI.delete(stageId);
      const updatedStages = await stagesAPI.getByEvent(selectedEvent!.id);
      setEventStages(updatedStages);
      loadData();
      toast({
        title: "Succès",
        description: "Étape supprimée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'étape",
        variant: "destructive",
      });
    }
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setEditingEvent({});
    setEventStages([]);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tableau de Bord Administrateur</h1>
        <p className="text-muted-foreground">Gérez les catégories, événements, étapes et inscriptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rankings.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="registrations">Inscriptions</TabsTrigger>
          <TabsTrigger value="rankings">Classements</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Catégories</CardTitle>
              <CardDescription>Créer et gérer les catégories de sport</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nom de la catégorie"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button onClick={handleCreateCategory}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{category.label}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          {selectedEvent ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleBackToEvents}>
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    Édition: {selectedEvent.name}
                  </CardTitle>
                  <CardDescription>Modifiez l'événement et gérez ses étapes</CardDescription>
                </div>
                <Button onClick={handleSaveEvent}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nom de l'événement</label>
                    <Input
                      value={editingEvent.name || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                      placeholder="Nom de l'événement"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Ville</label>
                    <Input
                      value={editingEvent.city || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, city: e.target.value })}
                      placeholder="Ville"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date de début</label>
                    <Input
                      type="datetime-local"
                      value={editingEvent.start_time ? editingEvent.start_time.slice(0, 16) : ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, start_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date de fin</label>
                    <Input
                      type="datetime-local"
                      value={editingEvent.end_time ? editingEvent.end_time.slice(0, 16) : ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, end_time: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={editingEvent.description || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                      placeholder="Description de l'événement"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Étapes de l'événement</h3>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une étape
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {eventStages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        Aucune étape créée pour cet événement
                      </p>
                    ) : (
                      eventStages.map((stage) => (
                        <div key={stage.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{stage.name}</h4>
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
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteStage(stage.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Événements</CardTitle>
                <CardDescription>Cliquez sur un événement pour le modifier et gérer ses étapes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Aucun événement créé</p>
                    </div>
                  ) : (
                    events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex-1 cursor-pointer" onClick={() => handleEditEvent(event)}>
                          <h3 className="font-semibold">{event.name}</h3>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <p className="text-sm">{event.city}, {event.country}</p>
                          <p className="text-sm">{new Date(event.start_time).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>


        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Inscriptions</CardTitle>
              <CardDescription>Vue d'ensemble de toutes les inscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {registrations.map((registration) => (
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
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Classements</CardTitle>
              <CardDescription>Vue d'ensemble de tous les classements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rankings.map((ranking) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;