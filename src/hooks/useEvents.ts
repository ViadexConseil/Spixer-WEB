import { useState, useEffect } from 'react';
import { eventsAPI, Event } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface UseEventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useEvents = (): UseEventsState => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedEvents = await eventsAPI.list();
      setEvents(fetchedEvents);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Error fetching events:', err);
      
      // Only show toast on user-initiated refetch, not on initial load
      if (!loading) {
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les événements.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  };
};