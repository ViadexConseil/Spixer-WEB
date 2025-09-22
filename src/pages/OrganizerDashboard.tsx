import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2 } from "lucide-react";
import { organizerAPI, eventsAPI, stagesAPI, registrationsAPI, rankingsAPI, serverAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const OrganizerDashboard = () => {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [stages, setStages] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    if (!hasRole('organizer')) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être organisateur pour accéder à cette page.",
        variant: "destructive"
      });
      return;
    }
    
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [eventsData, allStages, allRegistrations, allRankings] = await Promise.all([
        organizerAPI.getEvents(),
        loadAllStages(),
        loadAllRegistrations(),
        loadAllRankings()
      ]);
      
      setEvents(eventsData);
      setStages(allStages);
      setRegistrations(allRegistrations);
      setRankings(allRankings);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAllStages = async () => {
    try {
      const eventsData = await organizerAPI.getEvents();
      const allStages = [];
      for (const event of eventsData) {
        try {
          const eventStages = await stagesAPI.getByEvent(event.id);
          allStages.push(...eventStages.map(stage => ({ ...stage, event_name: event.name })));
        } catch (error) {
          console.log(`No stages for event ${event.id}`);
        }
      }
      return allStages;
    } catch (error) {
      return [];
    }
  };

  const loadAllRegistrations = async () => {
    try {
      const eventsData = await organizerAPI.getEvents();
      const allRegistrations = [];
      for (const event of eventsData) {
        try {
          const eventStages = await stagesAPI.getByEvent(event.id);
          for (const stage of eventStages) {
            try {
              const stageRegistrations = await registrationsAPI.getByStage(stage.id);
              allRegistrations.push(...stageRegistrations.map(reg => ({ 
                ...reg, 
                event_name: event.name, 
                stage_name: stage.name 
              })));
            } catch (error) {
              console.log(`No registrations for stage ${stage.id}`);
            }
          }
        } catch (error) {
          console.log(`No stages for event ${event.id}`);
        }
      }
      return allRegistrations;
    } catch (error) {
      return [];
    }
  };

  const loadAllRankings = async () => {
    try {
      const eventsData = await organizerAPI.getEvents();
      const allRankings = [];
      for (const event of eventsData) {
        try {
          const eventStages = await stagesAPI.getByEvent(event.id);
          for (const stage of eventStages) {
            try {
              const stageRankings = await rankingsAPI.getByStage(stage.id);
              allRankings.push(...stageRankings.map(rank => ({ 
                ...rank, 
                event_name: event.name, 
                stage_name: stage.name 
              })));
            } catch (error) {
              console.log(`No rankings for stage ${stage.id}`);
            }
          }
        } catch (error) {
          console.log(`No stages for event ${event.id}`);
        }
      }
      return allRankings;
    } catch (error) {
      return [];
    }
  };

  const updateField = async (type, id, field, value) => {
    const key = `${type}-${id}-${field}`;
    setSaving(prev => ({ ...prev, [key]: true }));
    
    try {
      let response;
      const data = { [field]: value };
      
      switch (type) {
        case 'event':
          response = await eventsAPI.update(id, data);
          setEvents(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
          break;
        case 'stage':
          response = await stagesAPI.update(id, data);
          setStages(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
          break;
        case 'registration':
          response = await registrationsAPI.update(id, data);
          setRegistrations(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
          break;
        case 'ranking':
          response = await rankingsAPI.update(id, data);
          setRankings(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
          break;
        default:
          throw new Error('Type not supported');
      }
      
      toast({
        title: "Mise à jour réussie",
        description: `${field} mis à jour avec succès.`
      });
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: "Erreur de mise à jour",
        description: `Impossible de mettre à jour ${field}.`,
        variant: "destructive"
      });
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }));
    }
  };

  const EditableCell = ({ type, id, field, value, onUpdate }) => {
    const [localValue, setLocalValue] = useState(value || '');
    const [isEditing, setIsEditing] = useState(false);
    const key = `${type}-${id}-${field}`;
    const isSaving = saving[key];

    const handleSave = () => {
      if (localValue !== value) {
        onUpdate(type, id, field, localValue);
      }
      setIsEditing(false);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSave();
      } else if (e.key === 'Escape') {
        setLocalValue(value || '');
        setIsEditing(false);
      }
    };

    return (
      <TableCell 
        className="cursor-pointer hover:bg-muted/50" 
        onClick={() => !isEditing && setIsEditing(true)}
      >
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="h-8 text-xs"
              autoFocus
            />
            {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
          </div>
        ) : (
          <div className="flex items-center justify-between group">
            <span className="text-sm">{value || '-'}</span>
            <Save className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </TableCell>
    );
  };

  if (!hasRole('organizer')) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background page-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
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
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des données...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Tableau de bord Organisateur</h1>
            <p className="text-muted-foreground">Données brutes éditables - Cliquez sur une cellule pour modifier</p>
          </div>

          <Tabs defaultValue="events" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="events">Événements</TabsTrigger>
              <TabsTrigger value="stages">Étapes</TabsTrigger>
              <TabsTrigger value="registrations">Inscriptions</TabsTrigger>
              <TabsTrigger value="rankings">Classements</TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Événements ({events.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Début</TableHead>
                        <TableHead>Fin</TableHead>
                        <TableHead>Ville</TableHead>
                        <TableHead>Pays</TableHead>
                        <TableHead>Code postal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-mono text-xs">{event.id}</TableCell>
                          <EditableCell type="event" id={event.id} field="name" value={event.name} onUpdate={updateField} />
                          <EditableCell type="event" id={event.id} field="description" value={event.description} onUpdate={updateField} />
                          <EditableCell type="event" id={event.id} field="start_time" value={event.start_time} onUpdate={updateField} />
                          <EditableCell type="event" id={event.id} field="end_time" value={event.end_time} onUpdate={updateField} />
                          <EditableCell type="event" id={event.id} field="city" value={event.city} onUpdate={updateField} />
                          <EditableCell type="event" id={event.id} field="country" value={event.country} onUpdate={updateField} />
                          <EditableCell type="event" id={event.id} field="postal_code" value={event.postal_code} onUpdate={updateField} />
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stages">
              <Card>
                <CardHeader>
                  <CardTitle>Étapes ({stages.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => {
                        const eventStages = stages.filter(stage => stage.event_id === event.id);
                        if (eventStages.length === 0) return null;
                        
                        return (
                          <React.Fragment key={event.id}>
                            <TableRow className="bg-muted/50">
                              <TableCell colSpan={6} className="font-semibold text-primary">
                                📅 {event.name} ({eventStages.length} étape{eventStages.length > 1 ? 's' : ''})
                              </TableCell>
                            </TableRow>
                            {eventStages.map((stage) => (
                              <TableRow key={stage.id}>
                                <TableCell className="font-mono text-xs">{stage.id}</TableCell>
                                <EditableCell type="stage" id={stage.id} field="name" value={stage.name} onUpdate={updateField} />
                                <EditableCell type="stage" id={stage.id} field="description" value={stage.description} onUpdate={updateField} />
                                <EditableCell type="stage" id={stage.id} field="distance" value={stage.distance} onUpdate={updateField} />
                                <EditableCell type="stage" id={stage.id} field="price" value={stage.price} onUpdate={updateField} />
                                <EditableCell type="stage" id={stage.id} field="status" value={stage.status} onUpdate={updateField} />
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={6} className="h-2"></TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="registrations">
              <Card>
                <CardHeader>
                  <CardTitle>Inscriptions ({registrations.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Dossard</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date inscription</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stages.map((stage) => {
                        const stageRegistrations = registrations.filter(reg => reg.stage_id === stage.id);
                        if (stageRegistrations.length === 0) return null;
                        
                        return (
                          <React.Fragment key={stage.id}>
                            <TableRow className="bg-muted/50">
                              <TableCell colSpan={5} className="font-semibold text-secondary-foreground">
                                🏃 {stage.name} • {stage.event_name} ({stageRegistrations.length} inscription{stageRegistrations.length > 1 ? 's' : ''})
                              </TableCell>
                            </TableRow>
                            {stageRegistrations.map((registration) => (
                              <TableRow key={registration.id}>
                                <TableCell className="font-mono text-xs">{registration.id}</TableCell>
                                <TableCell className="text-sm">{registration.user_email}</TableCell>
                                <EditableCell type="registration" id={registration.id} field="bib_number" value={registration.bib_number} onUpdate={updateField} />
                                <EditableCell type="registration" id={registration.id} field="status" value={registration.status} onUpdate={updateField} />
                                <TableCell className="text-sm">{registration.created_at}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={5} className="h-2"></TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rankings">
              <Card>
                <CardHeader>
                  <CardTitle>Classements ({rankings.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Temps</TableHead>
                        <TableHead>Email participant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stages.map((stage) => {
                        const stageRankings = rankings.filter(rank => rank.stage_id === stage.id);
                        if (stageRankings.length === 0) return null;
                        
                        return (
                          <React.Fragment key={stage.id}>
                            <TableRow className="bg-muted/50">
                              <TableCell colSpan={4} className="font-semibold text-accent-foreground">
                                🏆 {stage.name} • {stage.event_name} ({stageRankings.length} classement{stageRankings.length > 1 ? 's' : ''})
                              </TableCell>
                            </TableRow>
                            {stageRankings
                              .sort((a, b) => (a.position || 999) - (b.position || 999))
                              .map((ranking) => (
                              <TableRow key={ranking.id}>
                                <TableCell className="font-mono text-xs">{ranking.id}</TableCell>
                                <EditableCell type="ranking" id={ranking.id} field="position" value={ranking.position} onUpdate={updateField} />
                                <EditableCell type="ranking" id={ranking.id} field="time" value={ranking.time} onUpdate={updateField} />
                                <TableCell className="text-sm">{ranking.user_email}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={4} className="h-2"></TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default OrganizerDashboard;