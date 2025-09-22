import React, { useState, useEffect, useCallback, memo } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2 } from "lucide-react";
import { organizerAPI, eventsAPI, stagesAPI, registrationsAPI, rankingsAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

// OPTIMIZATION 2: Extract EditableCell outside the main component and wrap with React.memo
// This prevents the component from being re-created on every render of OrganizerDashboard.
// React.memo will prevent re-renders if its props haven't changed.
const EditableCell = memo(({ type, id, field, value, onUpdate, isSaving }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

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
          <span className="text-sm truncate">{value || '-'}</span>
          <Save className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </TableCell>
  );
});

const OrganizerDashboard = () => {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [stages, setStages] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  // OPTIMIZATION 1: Drastically improve data loading efficiency.
  // Instead of nested loops causing a waterfall of requests (N+1 problem),
  // we fetch data in parallel at each level.
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Fetch all events for the organizer
      const eventsData = await organizerAPI.getEvents();
      if (!eventsData || eventsData.length === 0) {
        setEvents([]);
        setStages([]);
        setRegistrations([]);
        setRankings([]);
        return;
      }
      setEvents(eventsData);

      // Create maps for quick lookups later
      const eventMap = new Map(eventsData.map(e => [e.id, e]));

      // 2. Fetch all stages for all events in parallel
      const stagePromises = eventsData.map(event => stagesAPI.getByEvent(event.id));
      const stagesByEvent = await Promise.allSettled(stagePromises);
      const allStages = stagesByEvent
        .filter(result => result.status === 'fulfilled' && result.value)
        .flatMap(result => result.value)
        .map(stage => ({ ...stage, event_name: eventMap.get(stage.event_id)?.name || 'N/A' }));
      setStages(allStages);

      if (allStages.length === 0) {
        setRegistrations([]);
        setRankings([]);
        return;
      }
      
      // Create a map for stage lookups
      const stageMap = new Map(allStages.map(s => [s.id, s]));

      // 3. Fetch all registrations and rankings for all stages in parallel
      const registrationPromises = allStages.map(stage => registrationsAPI.getByStage(stage.id));
      const rankingPromises = allStages.map(stage => rankingsAPI.getByStage(stage.id));

      const [registrationsByStage, rankingsByStage] = await Promise.all([
        Promise.allSettled(registrationPromises),
        Promise.allSettled(rankingPromises)
      ]);

      const allRegistrations = registrationsByStage
        .filter(result => result.status === 'fulfilled' && result.value)
        .flatMap(result => result.value)
        .map(reg => {
          const stage = stageMap.get(reg.stage_id);
          return {
            ...reg,
            stage_name: stage?.name || 'N/A',
            event_name: stage?.event_name || 'N/A'
          };
        });
      setRegistrations(allRegistrations);
      
      const allRankings = rankingsByStage
        .filter(result => result.status === 'fulfilled' && result.value)
        .flatMap(result => result.value)
        .map(rank => {
            const stage = stageMap.get(rank.stage_id);
            return {
                ...rank,
                stage_name: stage?.name || 'N/A',
                event_name: stage?.event_name || 'N/A'
            };
        });
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
  }, [toast]); // useCallback dependency

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
  }, [hasRole, loadData, toast]);

  // OPTIMIZATION 3: Memoize the updateField function with useCallback.
  // This ensures the function reference is stable between renders, allowing
  // React.memo on EditableCell to work correctly.
  const updateField = useCallback(async (type, id, field, value) => {
    const key = `${type}-${id}-${field}`;
    setSaving(prev => ({ ...prev, [key]: true }));
    
    try {
      const data = { [field]: value };
      let api;
      let setState;

      switch (type) {
        case 'event':       api = eventsAPI;       setState = setEvents;       break;
        case 'stage':       api = stagesAPI;       setState = setStages;       break;
        case 'registration':api = registrationsAPI;setState = setRegistrations;break;
        case 'ranking':     api = rankingsAPI;     setState = setRankings;     break;
        default: throw new Error('Type not supported');
      }

      await api.update(id, data);
      setState(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
      
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
  }, [toast]); // useCallback dependency

  // Conditional rendering for unauthorized users
  if (!hasRole('organizer')) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background page-content flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Accès non autorisé</h1>
              <p className="text-muted-foreground">Vous devez être organisateur pour accéder à cette page.</p>
            </div>
        </div>
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-background page-content flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Chargement des données...</p>
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

            {/* Events Tab */}
            <TabsContent value="events">
              <Card>
                <CardHeader><CardTitle>Événements ({events.length})</CardTitle></CardHeader>
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-mono text-xs">{event.id}</TableCell>
                          <EditableCell type="event" id={event.id} field="name" value={event.name} onUpdate={updateField} isSaving={saving[`event-${event.id}-name`]} />
                          <EditableCell type="event" id={event.id} field="description" value={event.description} onUpdate={updateField} isSaving={saving[`event-${event.id}-description`]} />
                          <EditableCell type="event" id={event.id} field="start_time" value={event.start_time} onUpdate={updateField} isSaving={saving[`event-${event.id}-start_time`]} />
                          <EditableCell type="event" id={event.id} field="end_time" value={event.end_time} onUpdate={updateField} isSaving={saving[`event-${event.id}-end_time`]} />
                          <EditableCell type="event" id={event.id} field="city" value={event.city} onUpdate={updateField} isSaving={saving[`event-${event.id}-city`]} />
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stages Tab */}
            <TabsContent value="stages">
                <Card>
                    <CardHeader><CardTitle>Étapes ({stages.length})</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Événement</TableHead>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Distance</TableHead>
                                    <TableHead>Prix</TableHead>
                                    <TableHead>Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stages.map((stage) => (
                                    <TableRow key={stage.id}>
                                        <TableCell className="font-mono text-xs">{stage.id}</TableCell>
                                        <TableCell className="text-sm">{stage.event_name}</TableCell>
                                        <EditableCell type="stage" id={stage.id} field="name" value={stage.name} onUpdate={updateField} isSaving={saving[`stage-${stage.id}-name`]}/>
                                        <EditableCell type="stage" id={stage.id} field="distance" value={stage.distance} onUpdate={updateField} isSaving={saving[`stage-${stage.id}-distance`]}/>
                                        <EditableCell type="stage" id={stage.id} field="price" value={stage.price} onUpdate={updateField} isSaving={saving[`stage-${stage.id}-price`]}/>
                                        <EditableCell type="stage" id={stage.id} field="status" value={stage.status} onUpdate={updateField} isSaving={saving[`stage-${stage.id}-status`]}/>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            
            {/* Registrations Tab */}
            <TabsContent value="registrations">
                <Card>
                    <CardHeader><CardTitle>Inscriptions ({registrations.length})</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Événement</TableHead>
                                    <TableHead>Étape</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Dossard</TableHead>
                                    <TableHead>Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {registrations.map((reg) => (
                                    <TableRow key={reg.id}>
                                        <TableCell className="font-mono text-xs">{reg.id}</TableCell>
                                        <TableCell className="text-sm">{reg.event_name}</TableCell>
                                        <TableCell className="text-sm">{reg.stage_name}</TableCell>
                                        <TableCell className="text-sm">{reg.user_email}</TableCell>
                                        <EditableCell type="registration" id={reg.id} field="bib_number" value={reg.bib_number} onUpdate={updateField} isSaving={saving[`registration-${reg.id}-bib_number`]}/>
                                        <EditableCell type="registration" id={reg.id} field="status" value={reg.status} onUpdate={updateField} isSaving={saving[`registration-${reg.id}-status`]}/>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Rankings Tab */}
            <TabsContent value="rankings">
                <Card>
                    <CardHeader><CardTitle>Classements ({rankings.length})</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Événement</TableHead>
                                    <TableHead>Étape</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Temps</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rankings.map((rank) => (
                                    <TableRow key={rank.id}>
                                        <TableCell className="font-mono text-xs">{rank.id}</TableCell>
                                        <TableCell className="text-sm">{rank.event_name}</TableCell>
                                        <TableCell className="text-sm">{rank.stage_name}</TableCell>
                                        <TableCell className="text-sm">{rank.user_email}</TableCell>
                                        <EditableCell type="ranking" id={rank.id} field="position" value={rank.position} onUpdate={updateField} isSaving={saving[`ranking-${rank.id}-position`]}/>
                                        <EditableCell type="ranking" id={rank.id} field="time" value={rank.time} onUpdate={updateField} isSaving={saving[`ranking-${rank.id}-time`]}/>
                                    </TableRow>
                                ))}
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