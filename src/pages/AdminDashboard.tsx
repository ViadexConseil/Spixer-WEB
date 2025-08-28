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
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<Event>>({});
  const [editingStage, setEditingStage] = useState<Partial<Stage>>({});
  const [eventStages, setEventStages] = useState<Stage[]>([]);
  const [stageRegistrations, setStageRegistrations] = useState<Registration[]>([]);
  const [stageRankings, setStageRankings] = useState<Ranking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRegistrations = registrations.filter(
    (registration) =>
      registration.user_email.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'all' || registration.status === statusFilter)
  );

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

  const handleEditStage = async (stage: Stage) => {
    setSelectedStage(stage);
    setEditingStage(stage);
    try {
      const [stageRegs, stageRanks] = await Promise.all([
        registrationsAPI.getByStage(stage.id),
        rankingsAPI.getByStage(stage.id),
      ]);
      setStageRegistrations(stageRegs);
      setStageRankings(stageRanks);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de l'étape",
        variant: "destructive",
      });
    }
  };

  const handleSaveStage = async () => {
    if (!selectedStage || !editingStage.name || !editingStage.description) return;

    try {
      await stagesAPI.update(selectedStage.id, {
        name: editingStage.name,
        description: editingStage.description,
        start_time: editingStage.start_time,
        end_time: editingStage.end_time,
        registration_end_time: editingStage.registration_end_time,
      });
      
      const updatedStages = await stagesAPI.getByEvent(selectedEvent!.id);
      setEventStages(updatedStages);
      setSelectedStage(null);
      setEditingStage({});
      toast({
        title: "Succès",
        description: "Étape mise à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'étape",
        variant: "destructive",
      });
    }
  };

  const handleBackToStages = () => {
    setSelectedStage(null);
    setEditingStage({});
    setStageRegistrations([]);
    setStageRankings([]);
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setSelectedStage(null);
    setEditingEvent({});
    setEditingStage({});
    setEventStages([]);
    setStageRegistrations([]);
    setStageRankings([]);
  };

  const handleUpdateRegistrationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await registrationsAPI.update(id, { status });
      loadData();
      toast({
        title: "Succès",
        description: `Inscription ${status === 'approved' ? 'approuvée' : 'rejetée'} avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'inscription",
        variant: "destructive",
      });
    }
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

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 pt-24">
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
          {selectedStage ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleBackToStages}>
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    Gestion: {selectedStage.name}
                  </CardTitle>
                  <CardDescription>Modifiez l'étape et gérez ses inscriptions et classements</CardDescription>
                </div>
                <Button onClick={handleSaveStage}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nom de l'étape</label>
                    <Input
                      value={editingStage.name || ''}
                      onChange={(e) => setEditingStage({ ...editingStage, name: e.target.value })}
                      placeholder="Nom de l'étape"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Catégorie</label>
                    <Input
                      value={editingStage.category_label || ''}
                      onChange={(e) => setEditingStage({ ...editingStage, category_label: e.target.value })}
                      placeholder="Catégorie"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date de début</label>
                    <Input
                      type="datetime-local"
                      value={editingStage.start_time ? editingStage.start_time.slice(0, 16) : ''}
                      onChange={(e) => setEditingStage({ ...editingStage, start_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date de fin</label>
                    <Input
                      type="datetime-local"
                      value={editingStage.end_time ? editingStage.end_time.slice(0, 16) : ''}
                      onChange={(e) => setEditingStage({ ...editingStage, end_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Fin des inscriptions</label>
                    <Input
                      type="datetime-local"
                      value={editingStage.registration_end_time ? editingStage.registration_end_time.slice(0, 16) : ''}
                      onChange={(e) => setEditingStage({ ...editingStage, registration_end_time: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={editingStage.description || ''}
                      onChange={(e) => setEditingStage({ ...editingStage, description: e.target.value })}
                      placeholder="Description de l'étape"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Inscriptions */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Inscriptions ({stageRegistrations.length})</h3>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {stageRegistrations.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          Aucune inscription pour cette étape
                        </p>
                      ) : (
                        stageRegistrations.map((registration) => (
                          <div key={registration.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-sm">{registration.user_email}</h4>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant={registration.status === 'approved' ? 'default' : 'secondary'} className="text-xs">
                                    {registration.status}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">{registration.type}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(registration.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Classements */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Classements ({stageRankings.length})</h3>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un résultat
                      </Button>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {stageRankings.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          Aucun classement pour cette étape
                        </p>
                      ) : (
                        stageRankings
                          .sort((a, b) => a.rank_position - b.rank_position)
                          .map((ranking) => (
                            <div key={ranking.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                      <span className="text-sm font-bold">#{ranking.rank_position}</span>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm">{ranking.user_email}</h4>
                                      <p className="text-xs text-muted-foreground">Position {ranking.rank_position}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : selectedEvent ? (
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
                        <div key={stage.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="flex-1 cursor-pointer" onClick={() => handleEditStage(stage)}>
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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditStage(stage)}
                            >
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
              <CardDescription>Rechercher, filtrer et gérer les inscriptions des utilisateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Input
                  placeholder="Rechercher par email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 border rounded-lg"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvé</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>
              <div className="space-y-4">
                {filteredRegistrations.map((registration) => (
                  <div key={registration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{registration.user_email}</p>
                      <p className="text-sm text-muted-foreground">
                        Étape: {stages.find(s => s.id === registration.stage_id)?.name || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(registration.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={registration.status === 'approved' ? 'default' : 'secondary'}>
                        {registration.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateRegistrationStatus(registration.id, 'approved')}
                        disabled={registration.status === 'approved'}
                      >
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateRegistrationStatus(registration.id, 'rejected')}
                        disabled={registration.status === 'rejected'}
                      >
                        Rejeter
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
      <Footer />
    </>
  );
};

export default AdminDashboard;