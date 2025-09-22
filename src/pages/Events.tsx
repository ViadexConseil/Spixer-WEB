import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Map, 
  List, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Star,
  Sparkles,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { useEvents } from "@/hooks/useEvents";
import { useLiveRankings } from "@/hooks/useLiveRankings";
import { LiveRankingsCard } from "@/components/LiveRankingsCard";

const Events = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const { events, loading, error, refetch } = useEvents();

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Identify live events (currently happening)
  const liveEvents = useMemo(() => {
    const now = new Date();
    return filteredEvents.filter(event => {
      const startTime = new Date(event.start_time);
      const endTime = new Date(event.end_time);
      return startTime <= now && now <= endTime;
    });
  }, [filteredEvents]);

  const liveEventIds = useMemo(() => 
    liveEvents.map(event => event.id), 
    [liveEvents]
  );

  // Use live rankings hook only for live events
  const { rankings, loading: rankingsLoading, error: rankingsError } = useLiveRankings(liveEventIds);

  const getStatusBadge = (dateString: string, endTime?: string) => {
    const eventDate = new Date(dateString);
    const eventEndDate = endTime ? new Date(endTime) : null;
    const now = new Date();
    
    // Check if event is currently live
    if (eventEndDate && eventDate <= now && now <= eventEndDate) {
      return { text: "EN DIRECT", class: "bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse shadow-lg" };
    }
    
    const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return { text: "Terminé", class: "bg-gray-500 text-white" };
    if (daysDiff === 0) return { text: "Aujourd'hui", class: "bg-red-500 text-white" };
    if (daysDiff <= 7) return { text: "Cette semaine", class: "bg-orange-500 text-white" };
    return { text: "À venir", class: "bg-spixer-blue text-white" };
  };

  if (loading) {
    return (
      <>
      <Navigation />
        <div className="min-h-screen bg-gray-50 page-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des événements...</p>
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
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full text-primary text-xs sm:text-sm font-medium">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              Événements Sportifs
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold px-4 sm:px-0">
              Tous les événements
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Découvrez tous les événements sportifs à venir et passés avec chronométrage intelligent
            </p>

          {/* Quick Stats - Only show real data */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary mb-1">{events.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Événements disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-secondary mb-1">
                {new Set(events.map(e => e.organiser_email)).size}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Organisateurs</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary mb-1">
                {events.filter(e => {
                  const eventDate = new Date(e.start_time);
                  return eventDate > new Date();
                }).length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">À venir</div>
            </div>
          </div>
          </div>

          {/* Enhanced Filters */}
          <div className="bg-card rounded-2xl sm:rounded-3xl shadow-xl border p-4 sm:p-6 md:p-8 mb-8 sm:mb-12">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    placeholder="Rechercher par nom, ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-lg sm:rounded-xl border-muted-foreground/20 focus:border-primary/50 text-sm sm:text-base"
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-10 sm:h-12 rounded-lg sm:rounded-xl px-4 sm:px-6 border-primary/20 hover:bg-primary/5 text-sm sm:text-base"
                >
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Filtres avancés</span>
                  <span className="sm:hidden">Filtres</span>
                </Button>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl px-3 sm:px-4 h-10 sm:h-12 text-xs sm:text-sm"
                >
                  <List className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Liste</span>
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl px-3 sm:px-4 h-10 sm:h-12 text-xs sm:text-sm"
                >
                  <Map className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Carte</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Event List */}
          {viewMode === 'list' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredEvents.map((event, index) => {
                const status = getStatusBadge(event.start_time, event.end_time);
                const imageUrl = event.images?.[0] || event.image_url || "/lovable-uploads/d8c8f0dd-a457-4a2d-b79b-5a64a0fd5515.png";
                const isLive = liveEventIds.includes(event.id);
                const eventRankings = rankings[event.id] || [];
                const rankingsAreLoading = rankingsLoading[event.id] || false;
                const eventRankingsError = rankingsError[event.id];
                
                return (
                  <Card 
                    key={event.id} 
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-0 shadow-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Status Badge */}
                      <Badge className={`absolute top-4 right-4 ${status.class} shadow-lg`}>
                        {status.text}
                      </Badge>

                      {/* Quick Actions */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20 rounded-full p-2 backdrop-blur-sm"
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.start_time).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {event.name}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0 space-y-4">
                      <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{event.city}, {event.country}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4 text-secondary" />
                          <span>Organisé par {event.organiser_email.split('@')[0]}</span>
                        </div>
                      </div>
                      
                      {/* Live Rankings for live events */}
                      {isLive && (
                        <LiveRankingsCard
                          eventId={event.id}
                          rankings={eventRankings}
                          loading={rankingsAreLoading}
                          error={eventRankingsError}
                        />
                      )}

                      <Button 
                        className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn" 
                        asChild
                      >
                        <Link to={`/events/${event.id}`}>
                          {isLive ? 'Suivre en direct' : 'Découvrir l\'événement'}
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Enhanced Map View Placeholder */}
          {viewMode === 'map' && (
            <div className="bg-card rounded-3xl shadow-xl border p-12 text-center">
              <div className="max-w-md mx-auto space-y-6">
                <div className="rounded-full w-20 h-20 flex items-center justify-center mx-auto bg-muted">
                  <Map className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Vue carte interactive</h3>
                <p className="text-muted-foreground leading-relaxed">
                  La visualisation des événements sur carte avec géolocalisation et filtres avancés sera bientôt disponible.
                </p>
                <Button className="rounded-xl">
                  Être notifié du lancement
                </Button>
              </div>
            </div>
          )}
          
          {/* Enhanced Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-card rounded-3xl shadow-xl border p-12 max-w-md mx-auto">
                <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Aucun événement trouvé</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Essayez de modifier vos critères de recherche ou découvrez nos événements populaires.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                    className="rounded-xl"
                  >
                    Réinitialiser la recherche
                  </Button>
                  <Button className="rounded-xl">
                    Voir tous les événements
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Events;