import React, { useState, useEffect } from "react";
import { Search, Filter, Trophy, Medal, Award, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { rankingsAPI, eventsAPI, Ranking, Event } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Results = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rankingsData, eventsData] = await Promise.all([
          rankingsAPI.list(),
          eventsAPI.list()
        ]);
        setRankings(rankingsData);
        setEvents(eventsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les résultats.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (position === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (position === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-medium">#{position}</span>;
  };

  const filteredRankings = rankings.filter(ranking =>
    ranking.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ranking.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background">
          <div className="container px-4 py-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des résultats...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm border bg-muted/50">
              🏆 Résultats et Classements
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold">
              Résultats des courses
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Consultez les résultats et classements des événements terminés
            </p>
          </div>

          {/* Search */}
          <div className="bg-card rounded-2xl border p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher par événement ou participant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtres
              </Button>
            </div>
          </div>

          {/* Stats - Only show real data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{events.length}</div>
                <div className="text-sm text-muted-foreground">Événements référencés</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{rankings.length}</div>
                <div className="text-sm text-muted-foreground">Résultats disponibles</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {new Set(rankings.map(r => r.user_email)).size}
                </div>
                <div className="text-sm text-muted-foreground">Participants uniques</div>
              </CardContent>
            </Card>
          </div>

          {/* Results List */}
          {rankings.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Résultats disponibles</h2>
              
              {filteredRankings.map((ranking) => (
                <Card key={ranking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                          {getPositionIcon(ranking.rank_position)}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg">{ranking.event_name}</h3>
                          <p className="text-muted-foreground">{ranking.user_email}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="text-2xl font-bold">Position #{ranking.rank_position}</div>
                        <Badge variant="secondary">{ranking.stage_name}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <span className="text-sm text-muted-foreground">
                        Événement: {ranking.event_name}
                      </span>
                      
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun résultat disponible</h3>
              <p className="text-muted-foreground mb-6">
                Les résultats des courses seront affichés ici une fois les événements terminés.
              </p>
              <Button asChild>
                <Link to="/events">
                  Découvrir les événements
                </Link>
              </Button>
            </div>
          )}

          {/* No Search Results */}
          {rankings.length > 0 && filteredRankings.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-destructive/10 text-destructive rounded-lg p-4 max-w-md mx-auto">
                <h3 className="font-semibold mb-2">Erreur de chargement</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Results;