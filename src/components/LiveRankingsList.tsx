import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, Zap } from 'lucide-react';

interface RankingWithStage {
  id: string;
  rank_position: number;
  user_email: string;
  stage_name: string;
  bib_number?: string;
}

interface AnimatedRanking extends RankingWithStage {
  isNew?: boolean;
  previousPosition?: number;
  isMovingUp?: boolean;
  isMovingDown?: boolean;
}

interface LiveRankingsListProps {
  rankings: RankingWithStage[];
  loading: boolean;
  error: string | null;
}

export const LiveRankingsList: React.FC<LiveRankingsListProps> = ({
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
      const isNew = !previousRank;
      const isMovingUp = previousRank && previousRank.rank_position > ranking.rank_position;
      const isMovingDown = previousRank && previousRank.rank_position < ranking.rank_position;
      
      return {
        ...ranking,
        isNew,
        previousPosition: previousRank?.rank_position,
        isMovingUp,
        isMovingDown
      };
    });

    setAnimatedRankings(newAnimatedRankings);
    setPreviousRankings(rankings);

    // Clear animation flags after animation duration
    const timer = setTimeout(() => {
      setAnimatedRankings(prev => 
        prev.map(ranking => ({ 
          ...ranking, 
          isNew: false, 
          previousPosition: undefined,
          isMovingUp: false,
          isMovingDown: false
        }))
      );
    }, 1500);

    return () => clearTimeout(timer);
  }, [rankings, previousRankings]);

  const getRankBadgeColor = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg';
      case 2: return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-white shadow-lg';
      case 3: return 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-lg';
      default: return 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 text-white shadow-md';
    }
  };

  const getPositionChangeElement = (current: number, previous?: number, isMovingUp?: boolean, isMovingDown?: boolean) => {
    if (!previous || previous === current) return null;
    
    if (isMovingUp) {
      return (
        <div className="flex items-center gap-1 animate-bounce">
          <span className="text-green-500 font-bold text-sm">↗</span>
          <span className="text-green-600 text-xs font-semibold">+{previous - current}</span>
        </div>
      );
    } else if (isMovingDown) {
      return (
        <div className="flex items-center gap-1">
          <span className="text-red-500 font-bold text-sm">↘</span>
          <span className="text-red-600 text-xs font-semibold">-{current - previous}</span>
        </div>
      );
    }
    
    return null;
  };

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-red-50 border border-red-200">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative">
          <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          {loading && (
            <div className="absolute -top-2 -right-2 w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {loading ? 'Chargement du classement...' : 'Classement non disponible'}
        </h3>
        <p className="text-gray-600">
          {loading ? 'Mise à jour en temps réel' : 'Les résultats seront affichés ici une fois disponibles.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Live indicator */}
      <div className="flex items-center justify-between mb-6 p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Zap className="w-5 h-5 text-red-500" />
            <span className="font-bold text-red-600">CLASSEMENT EN DIRECT</span>
          </div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <span>Actualisation...</span>
          </div>
        )}
      </div>

      {/* Rankings list */}
      <div className="space-y-2">
        {animatedRankings.map((ranking, index) => (
          <div
            key={ranking.id}
            className={`
              flex items-center justify-between p-4 rounded-xl border transition-all duration-700 ease-out
              ${ranking.isNew 
                ? 'animate-fade-in bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg' 
                : ranking.isMovingUp 
                ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300 shadow-md transform -translate-y-2' 
                : ranking.isMovingDown 
                ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-300 shadow-md transform translate-y-2' 
                : 'bg-white border-gray-200 hover:shadow-md'
              }
              hover:scale-[1.02] cursor-pointer group
            `}
            style={{
              animationDelay: `${index * 50}ms`,
              zIndex: ranking.isMovingUp ? 10 : ranking.isMovingDown ? 1 : 5
            }}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div 
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500
                    ${getRankBadgeColor(ranking.rank_position)}
                    ${ranking.isMovingUp ? 'animate-bounce' : ''}
                  `}
                >
                  {ranking.rank_position}
                </div>
                {ranking.rank_position <= 3 && (
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  </div>
                )}
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-lg text-gray-800 truncate group-hover:text-primary transition-colors">
                    {ranking.user_email.split('@')[0]}
                  </span>
                  {getPositionChangeElement(
                    ranking.rank_position, 
                    ranking.previousPosition, 
                    ranking.isMovingUp, 
                    ranking.isMovingDown
                  )}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {ranking.stage_name}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {ranking.bib_number && (
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-mono text-gray-700 border">
                  #{ranking.bib_number}
                </div>
              )}
              {ranking.isNew && (
                <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                  NOUVEAU
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Mise à jour automatique toutes les 5 secondes</p>
      </div>
    </div>
  );
};