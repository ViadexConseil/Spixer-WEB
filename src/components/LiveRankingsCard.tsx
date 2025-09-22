import React, { useState, useEffect } from 'react';
import { Trophy, Users, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RankingWithStage {
  id: string;
  rank_position: number;
  user_email: string;
  stage_name: string;
  bib_number?: string;
}

interface LiveRankingsCardProps {
  eventId: string;
  rankings: RankingWithStage[];
  loading: boolean;
  error: string | null;
}

interface AnimatedRanking extends RankingWithStage {
  isNew?: boolean;
  previousPosition?: number;
}

export const LiveRankingsCard: React.FC<LiveRankingsCardProps> = ({
  eventId,
  rankings,
  loading,
  error
}) => {
  const [animatedRankings, setAnimatedRankings] = useState<AnimatedRanking[]>([]);
  const [previousRankings, setPreviousRankings] = useState<RankingWithStage[]>([]);

  useEffect(() => {
    if (rankings.length === 0) {
      setAnimatedRankings([]);
      return;
    }

    // Compare with previous rankings to detect changes
    const newAnimatedRankings: AnimatedRanking[] = rankings.map(ranking => {
      const previousRank = previousRankings.find(prev => prev.id === ranking.id);
      return {
        ...ranking,
        isNew: !previousRank,
        previousPosition: previousRank?.rank_position
      };
    });

    setAnimatedRankings(newAnimatedRankings);
    setPreviousRankings(rankings);

    // Clear animation flags after animation duration
    const timer = setTimeout(() => {
      setAnimatedRankings(prev => 
        prev.map(ranking => ({ ...ranking, isNew: false, previousPosition: undefined }))
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [rankings, previousRankings]);

  const getRankBadgeColor = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
      default: return 'bg-gradient-to-r from-slate-400 to-slate-600 text-white';
    }
  };

  const getPositionChangeIcon = (current: number, previous?: number) => {
    if (!previous || previous === current) return null;
    
    if (current < previous) {
      return <span className="text-green-500 text-xs font-bold">↗</span>;
    } else {
      return <span className="text-red-500 text-xs font-bold">↘</span>;
    }
  };

  if (error) {
    return (
      <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="mt-4 p-4 rounded-lg bg-muted/50">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Trophy className="w-4 h-4" />
          <span>Classement en cours...</span>
          {loading && (
            <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Classement LIVE</span>
        </div>
        {loading && (
          <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
        )}
        <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">
          Temps réel
        </Badge>
      </div>
      
      <div className="space-y-2">
        {animatedRankings.slice(0, 5).map((ranking, index) => (
          <div
            key={ranking.id}
            className={`
              flex items-center justify-between p-3 rounded-lg transition-all duration-500 ease-out
              ${ranking.isNew ? 'animate-fade-in bg-primary/5 border border-primary/20' : 'bg-muted/30'}
              ${ranking.previousPosition && ranking.previousPosition !== ranking.rank_position 
                ? 'transform hover:scale-[1.02]' : ''
              }
            `}
            style={{
              animationDelay: `${index * 100}ms`,
              transform: ranking.previousPosition && ranking.previousPosition !== ranking.rank_position
                ? `translateY(${(ranking.previousPosition - ranking.rank_position) * 60}px)`
                : 'translateY(0)'
            }}
          >
            <div className="flex items-center gap-3">
              <Badge 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg
                  ${getRankBadgeColor(ranking.rank_position)}
                `}
              >
                {ranking.rank_position}
              </Badge>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">
                    {ranking.user_email.split('@')[0]}
                  </span>
                  {getPositionChangeIcon(ranking.rank_position, ranking.previousPosition)}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {ranking.stage_name}
                </div>
              </div>
            </div>
            
            {ranking.bib_number && (
              <div className="text-xs bg-background/80 px-2 py-1 rounded border">
                #{ranking.bib_number}
              </div>
            )}
          </div>
        ))}
        
        {rankings.length > 5 && (
          <div className="text-center pt-2">
            <span className="text-xs text-muted-foreground">
              +{rankings.length - 5} autres participants
            </span>
          </div>
        )}
      </div>
    </div>
  );
};