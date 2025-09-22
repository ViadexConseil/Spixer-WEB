import { useState, useEffect, useCallback } from 'react';
import { rankingsAPI, stagesAPI, Ranking, Stage } from '@/services/api';

interface RankingWithStage extends Ranking {
  stage_name: string;
}

interface LiveRankingsState {
  rankings: Record<string, RankingWithStage[]>; // eventId -> rankings
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
}

export const useLiveRankings = (liveEventIds: string[]) => {
  const [state, setState] = useState<LiveRankingsState>({
    rankings: {},
    loading: {},
    error: {}
  });

  const fetchRankingsForEvent = useCallback(async (eventId: string) => {
    try {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, [eventId]: true },
        error: { ...prev.error, [eventId]: null }
      }));

      // Get stages for this event
      const stages: Stage[] = await stagesAPI.getByEvent(eventId);
      
      if (stages.length === 0) {
        setState(prev => ({
          ...prev,
          rankings: { ...prev.rankings, [eventId]: [] },
          loading: { ...prev.loading, [eventId]: false }
        }));
        return;
      }

      // Fetch rankings for all stages
      const allRankings = await Promise.all(
        stages.map(async (stage) => {
          try {
            const rankings = await rankingsAPI.getByStage(stage.id);
            return rankings.map(ranking => ({
              ...ranking,
              stage_name: stage.name
            }));
          } catch (error) {
            console.error(`Error fetching rankings for stage ${stage.id}:`, error);
            return [];
          }
        })
      );

      // Flatten and sort by rank position
      const combinedRankings = allRankings
        .flat()
        .sort((a, b) => a.rank_position - b.rank_position)
        .slice(0, 5); // Only show top 5 for each event

      setState(prev => ({
        ...prev,
        rankings: { ...prev.rankings, [eventId]: combinedRankings },
        loading: { ...prev.loading, [eventId]: false }
      }));

    } catch (error) {
      console.error(`Error fetching rankings for event ${eventId}:`, error);
      setState(prev => ({
        ...prev,
        error: { ...prev.error, [eventId]: 'Erreur lors du chargement des classements' },
        loading: { ...prev.loading, [eventId]: false }
      }));
    }
  }, []);

  const fetchAllRankings = useCallback(() => {
    liveEventIds.forEach(eventId => {
      fetchRankingsForEvent(eventId);
    });
  }, [liveEventIds, fetchRankingsForEvent]);

  // Initial fetch
  useEffect(() => {
    if (liveEventIds.length > 0) {
      fetchAllRankings();
    }
  }, [fetchAllRankings]);

  // Polling for live updates - every 5 seconds for live events
  useEffect(() => {
    if (liveEventIds.length === 0) return;

    const interval = setInterval(() => {
      fetchAllRankings();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchAllRankings]);

  return {
    rankings: state.rankings,
    loading: state.loading,
    error: state.error,
    refetch: fetchAllRankings
  };
};