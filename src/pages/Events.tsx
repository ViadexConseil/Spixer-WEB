import React, { useState, useEffect } from "react";
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

const Events = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const { events, loading, error, refetch } = useEvents();

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
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
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background page-content">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Calendar className="w-4 h-4" />
              Événements Sportifs
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                Tous les événements
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Découvrez tous les événements sportifs à venir et passés avec chronométrage intelligent
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{events.length}</div>
                <div className="text-sm text-muted-foreground">Événements actifs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">50K+</div>
                <div className="text-sm text-muted-foreground">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">4.9★</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="bg-card rounded-3xl shadow-xl border p-8 mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Rechercher par nom, ville, organisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 rounded-xl border-muted-foreground/20 focus:border-primary/50"
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-12 rounded-xl px-6 border-primary/20 hover:bg-primary/5"
                >
                  <Filter className="w-4 h-4" />
                  Filtres avancés
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex items-center gap-2 rounded-xl"
                >
                  <List className="w-4 h-4" />
                  Liste
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="flex items-center gap-2 rounded-xl"
                >
                  <Map className="w-4 h-4" />
                  Carte
                </Button>
              </div>
            </div>
          </div>

          {/* Event List */}
          {viewMode === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => {
                const status = getStatusBadge(event.start_time);
                const imageUrl = event.images?.[0] || event.image_url || "/lovable-uploads/d8c8f0dd-a457-4a2d-b79b-5a64a0fd5515.png";
                
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
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn" 
                        asChild
                      >
                        <Link to={`/events/${event.id}`}>
                          Découvrir l'événement
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
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <Map className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Vue carte interactive</h3>
                <p className="text-muted-foreground leading-relaxed">
                  La visualisation des événements sur carte avec géolocalisation et filtres avancés sera bientôt disponible.
                </p>
                <Button className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl">
                  <Sparkles className="w-4 h-4 mr-2" />
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
                  <Button className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl">
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