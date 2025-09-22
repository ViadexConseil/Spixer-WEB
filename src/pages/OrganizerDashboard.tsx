import React, { useState, useEffect, useCallback, memo, FC } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { organizerAPI, eventsAPI, stagesAPI, registrationsAPI, rankingsAPI } from "@/services/api";
import type { Event as ApiEvent, Stage as ApiStage, Registration as ApiRegistration, Ranking as ApiRanking } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Extended interfaces for display purposes
interface Event extends ApiEvent {
  // API Event already has all needed fields
}

interface Stage extends ApiStage {
  event_name?: string;
  // For compatibility with editable fields that might not exist in API
  distance?: number;
  price?: number;
  status?: string;
}

interface Registration extends ApiRegistration {
  // API Registration already has event_name and stage_name
  // For compatibility with editable fields that might not exist in API
  bib_number?: number | null;
}

interface Ranking extends ApiRanking {
  // API Ranking already has event_name and stage_name
  // Map API field to component expected field
  position?: number | null;
  time?: string | null;
}

// Define a props interface for the EditableCell component.
interface EditableCellProps {
  type: 'event' | 'stage' | 'registration' | 'ranking';
  id: string;
  field: string;
  value: string | number | null;
  onUpdate: (type: EditableCellProps['type'], id: string, field: string, value: string | number) => Promise<void>;
  isSaving?: boolean;
}

const EditableCell: FC<EditableCellProps> = memo(({ type, id, field, value, onUpdate, isSaving }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Handles both string and number values correctly
    setLocalValue(value === null || value === undefined ? '' : String(value));
  }, [value]);

  const handleSave = () => {
    // Only update if the value has changed
    if (String(localValue) !== String(value)) {
      onUpdate(type, id, field, localValue);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') {
      setLocalValue(value === null ? '' : String(value));
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
          <span className="text-sm truncate">{value ?? '-'}</span>
          <Save className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </TableCell>
  );
});
EditableCell.displayName = 'EditableCell';


const OrganizerDashboard = () => {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  // FIX: Apply types to the state variables.
  const [events, setEvents] = useState<Event[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  // Add state for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      const eventsData = await organizerAPI.getEvents();
      if (!eventsData || eventsData.length === 0) {
        setEvents([]); setStages([]); setRegistrations([]); setRankings([]); return;
      }
      setEvents(eventsData);
      const eventMap = new Map(eventsData.map((e: ApiEvent) => [e.id, e]));

      const stagePromises = eventsData.map((event: ApiEvent) => stagesAPI.getByEvent(event.id));
      const stagesByEventResults = await Promise.allSettled(stagePromises);
      
      // Handle PromiseSettledResult and map API fields to component fields
      const allStages = stagesByEventResults
        .flatMap(result => (result.status === 'fulfilled' && result.value) ? result.value : [])
        .map((stage: ApiStage) => ({ 
          ...stage, 
          event_name: eventMap.get(stage.event_id)?.name || 'N/A',
          // Add compatibility fields if they don't exist
          distance: (stage as any).distance || 0,
          price: (stage as any).price || 0,
          status: (stage as any).status || 'active'
        }));
      setStages(allStages);

      if (allStages.length === 0) {
        setRegistrations([]); setRankings([]); return;
      }
      const stageMap = new Map(allStages.map(s => [s.id, s]));

      const registrationPromises = allStages.map(stage => registrationsAPI.getByStage(stage.id));
      const rankingPromises = allStages.map(stage => rankingsAPI.getByStage(stage.id));

      const [regResults, rankResults] = await Promise.all([
        Promise.allSettled(registrationPromises),
        Promise.allSettled(rankingPromises)
      ]);

      const allRegistrations = regResults
        .flatMap(result => (result.status === 'fulfilled' && result.value) ? result.value : [])
        .map((reg: ApiRegistration) => {
          const stage = stageMap.get(reg.stage_id);
          return { 
            ...reg, 
            // API already has stage_name and event_name, but add fallbacks
            stage_name: reg.stage_name || stage?.name || 'N/A', 
            event_name: reg.event_name || stage?.event_name || 'N/A',
            // Add compatibility field
            bib_number: (reg as any).bib_number || null
          };
        });
      setRegistrations(allRegistrations);
      
      const allRankings = rankResults
        .flatMap(result => (result.status === 'fulfilled' && result.value) ? result.value : [])
        .map((rank: ApiRanking) => {
          const stage = stageMap.get(rank.stage_id);
          return { 
            ...rank, 
            // API already has stage_name and event_name, but add fallbacks
            stage_name: rank.stage_name || stage?.name || 'N/A', 
            event_name: rank.event_name || stage?.event_name || 'N/A',
            // Map API fields to component expected fields
            position: rank.rank_position || null,
            time: (rank as any).time || null
          };
        });
      setRankings(allRankings);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({ title: "Erreur", description: "Impossible de charger les données.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!hasRole('organizer')) {
      toast({ title: "Accès refusé", description: "Vous devez être organisateur.", variant: "destructive" });
      return;
    }
    loadData();
  }, [hasRole, loadData, toast]);

  // Fix: Add types to the function parameters with correct type
  const updateField = useCallback(async (type: EditableCellProps['type'], id: string, field: string, value: string | number) => {
    const key = `${type}-${id}-${field}`;
    setSaving(prev => ({ ...prev, [key]: true }));
    
    try {
      const data = { [field]: value };
      let api;
      let setState;

      switch (type) {
        case 'event': api = eventsAPI; setState = setEvents; break;
        case 'stage': api = stagesAPI; setState = setStages; break;
        case 'registration': api = registrationsAPI; setState = setRegistrations; break;
        case 'ranking': api = rankingsAPI; setState = setRankings; break;
        default: throw new Error('Type not supported');
      }

      await api.update(id, data);
      setState((prev: any[]) => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
      
      toast({ title: "Mise à jour réussie", description: `${field} mis à jour.` });
    } catch (error) {
      console.error('Error updating field:', error);
      toast({ title: "Erreur de mise à jour", description: `Impossible de mettre à jour ${field}.`, variant: "destructive" });
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }));
    }
  }, [toast]);

  // Group data by parent entities
  const eventGroups = events.reduce((acc, event) => {
    acc[event.id] = { event, stages: stages.filter(s => s.event_id === event.id) };
    return acc;
  }, {} as Record<string, { event: Event; stages: Stage[] }>);

  const stageGroups = stages.reduce((acc, stage) => {
    acc[stage.id] = { 
      stage, 
      registrations: registrations.filter(r => r.stage_id === stage.id),
      rankings: rankings.filter(r => r.stage_id === stage.id)
    };
    return acc;
  }, {} as Record<string, { stage: Stage; registrations: Registration[]; rankings: Ranking[] }>);

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

            <TabsContent value="events">
              <Card>
                <CardHeader><CardTitle>Événements ({events.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.values(eventGroups).map(({ event, stages: eventStages }) => (
                      <Collapsible
                        key={event.id}
                        open={!collapsedSections[`event-${event.id}`]}
                        onOpenChange={() => toggleSection(`event-${event.id}`)}
                      >
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <div className="flex items-center gap-2">
                              {collapsedSections[`event-${event.id}`] ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              <h3 className="font-medium">{event.name}</h3>
                              <span className="text-sm text-muted-foreground">({eventStages.length} étapes)</span>
                            </div>
                            <span className="text-xs font-mono text-muted-foreground">{event.id}</span>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
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
                              <TableRow key={event.id}>
                                <TableCell className="font-mono text-xs">{event.id}</TableCell>
                                <EditableCell type="event" id={event.id} field="name" value={event.name} onUpdate={updateField} isSaving={saving[`event-${event.id}-name`]} />
                                <EditableCell type="event" id={event.id} field="description" value={event.description} onUpdate={updateField} isSaving={saving[`event-${event.id}-description`]} />
                                <EditableCell type="event" id={event.id} field="start_time" value={event.start_time} onUpdate={updateField} isSaving={saving[`event-${event.id}-start_time`]} />
                                <EditableCell type="event" id={event.id} field="end_time" value={event.end_time} onUpdate={updateField} isSaving={saving[`event-${event.id}-end_time`]} />
                                <EditableCell type="event" id={event.id} field="city" value={event.city} onUpdate={updateField} isSaving={saving[`event-${event.id}-city`]} />
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stages">
              <Card>
                <CardHeader><CardTitle>Étapes par événement ({stages.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.values(eventGroups).map(({ event, stages: eventStages }) => (
                      <Collapsible
                        key={`stages-${event.id}`}
                        open={!collapsedSections[`stages-${event.id}`]}
                        onOpenChange={() => toggleSection(`stages-${event.id}`)}
                      >
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <div className="flex items-center gap-2">
                              {collapsedSections[`stages-${event.id}`] ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              <h3 className="font-medium">{event.name}</h3>
                              <span className="text-sm text-muted-foreground">({eventStages.length} étapes)</span>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Début</TableHead>
                                <TableHead>Fin</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {eventStages.map((stage) => (
                                <TableRow key={stage.id}>
                                  <TableCell className="font-mono text-xs">{stage.id}</TableCell>
                                  <EditableCell type="stage" id={stage.id} field="name" value={stage.name} onUpdate={updateField} isSaving={saving[`stage-${stage.id}-name`]} />
                                  <EditableCell type="stage" id={stage.id} field="description" value={stage.description} onUpdate={updateField} isSaving={saving[`stage-${stage.id}-description`]} />
                                  <EditableCell type="stage" id={stage.id} field="start_time" value={stage.start_time} onUpdate={updateField} isSaving={saving[`stage-${stage.id}-start_time`]} />
                                  <EditableCell type="stage" id={stage.id} field="end_time" value={stage.end_time} onUpdate={updateField} isSaving={saving[`stage-${stage.id}-end_time`]} />
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="registrations">
              <Card>
                <CardHeader><CardTitle>Inscriptions par étape ({registrations.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.values(stageGroups)
                      .filter(({ registrations: stageRegs }) => stageRegs.length > 0)
                      .map(({ stage, registrations: stageRegs }) => (
                      <Collapsible
                        key={`registrations-${stage.id}`}
                        open={!collapsedSections[`registrations-${stage.id}`]}
                        onOpenChange={() => toggleSection(`registrations-${stage.id}`)}
                      >
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <div className="flex items-center gap-2">
                              {collapsedSections[`registrations-${stage.id}`] ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              <h3 className="font-medium">{stage.name}</h3>
                              <span className="text-sm text-muted-foreground">({stageRegs.length} inscriptions)</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{stage.event_name}</span>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Dossard</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stageRegs.map((reg) => (
                                <TableRow key={reg.id}>
                                  <TableCell className="font-mono text-xs">{reg.id}</TableCell>
                                  <TableCell className="text-sm">{reg.user_email}</TableCell>
                                  <EditableCell type="registration" id={reg.id} field="bib_number" value={reg.bib_number} onUpdate={updateField} isSaving={saving[`registration-${reg.id}-bib_number`]} />
                                  <EditableCell type="registration" id={reg.id} field="status" value={reg.status} onUpdate={updateField} isSaving={saving[`registration-${reg.id}-status`]} />
                                  <TableCell className="text-xs text-muted-foreground">{new Date(reg.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rankings">
              <Card>
                <CardHeader><CardTitle>Classements par étape ({rankings.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.values(stageGroups)
                      .filter(({ rankings: stageRankings }) => stageRankings.length > 0)
                      .map(({ stage, rankings: stageRankings }) => (
                      <Collapsible
                        key={`rankings-${stage.id}`}
                        open={!collapsedSections[`rankings-${stage.id}`]}
                        onOpenChange={() => toggleSection(`rankings-${stage.id}`)}
                      >
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <div className="flex items-center gap-2">
                              {collapsedSections[`rankings-${stage.id}`] ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              <h3 className="font-medium">{stage.name}</h3>
                              <span className="text-sm text-muted-foreground">({stageRankings.length} classements)</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{stage.event_name}</span>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Temps</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stageRankings.map((rank) => (
                                <TableRow key={rank.id}>
                                  <TableCell className="font-mono text-xs">{rank.id}</TableCell>
                                  <TableCell className="text-sm">{rank.user_email}</TableCell>
                                  <EditableCell type="ranking" id={rank.id} field="position" value={rank.position} onUpdate={updateField} isSaving={saving[`ranking-${rank.id}-position`]} />
                                  <EditableCell type="ranking" id={rank.id} field="time" value={rank.time} onUpdate={updateField} isSaving={saving[`ranking-${rank.id}-time`]} />
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
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

export default OrganizerDashboard;