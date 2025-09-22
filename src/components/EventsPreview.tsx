import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { eventsAPI, Event } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export const EventsPreview: React.FC = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedEvents = await eventsAPI.list();
        setAllEvents(fetchedEvents);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(errorMessage);
        console.error('Error fetching events:', err);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les événements.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Show only the next 3 upcoming events
  const events = allEvents
    .filter(event => new Date(event.start_time) > new Date())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 3);

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleViewAllEvents = () => {
    navigate('/events');
  };

  if (loading) {
    return (
      <section className="section-container animate-on-scroll">
        <div className="text-center">
          <div className="section-title mb-4">Événements à venir</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-container animate-on-scroll">
        <div className="text-center">
          <div className="section-title mb-4">Événements à venir</div>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="section-container animate-on-scroll">
        <div className="text-center">
          <div className="section-title mb-4">Événements à venir</div>
          <p className="section-subtitle">Aucun événement prévu pour le moment.</p>
          <Button onClick={handleViewAllEvents} className="mt-4">
            Créer un événement
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="section-container animate-on-scroll">
      <div className="text-center mb-12">
        <div className="section-title mb-4">Événements à venir</div>
        <p className="section-subtitle">
          Découvrez les prochains événements sportifs près de chez vous
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {events.map((event, index) => (
          <Card key={event.id} className={`feature-card hover-lift stagger-${index + 1}`}>
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary" className="mb-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  {format(new Date(event.start_time), 'dd MMM', { locale: fr })}
                </Badge>
                {new Date(event.start_time).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 && (
                  <Badge variant="destructive" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Bientôt
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{event.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.city}, {event.country}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {event.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  Organisé par {event.organiser_email.split('@')[0]}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleViewEvent(event.id)}
                  className="gap-1"
                >
                  Voir <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button onClick={handleViewAllEvents} variant="outline" size="lg">
          Voir tous les événements
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </section>
  );
};