import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Map, List, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { eventsAPI, Event } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const Events = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      
      try {
        const fetchedEvents = await eventsAPI.list();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error);
        toast({
          title: "Erreur API",
          description: "Impossible de charger les événements depuis l'API.",
          variant: "destructive"
        });
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
        <Navbar />
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
      <Navbar />
      <div className="min-h-screen bg-gray-50 page-content">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-4">Tous les événements</h1>
          <p className="section-subtitle">Découvrez tous les événements sportifs à venir et passés</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-elegant p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher un événement..."
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
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                Liste
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="flex items-center gap-2"
              >
                <Map className="w-4 h-4" />
                Carte
              </Button>
            </div>
          </div>
        </div>

        {/* Event List */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const status = getStatusBadge(event.start_time);
              return (
                <Card key={event.id} className="hover-lift cursor-pointer group">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img 
                      src="/lovable-uploads/d8c8f0dd-a457-4a2d-b79b-5a64a0fd5515.png" 
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className={`absolute top-4 right-4 ${status.class}`}>
                      {status.text}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {event.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.start_time).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.city}, {event.country}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" asChild>
                      <Link to={`/events/${event.id}`}>Voir l'événement</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Map View Placeholder */}
        {viewMode === 'map' && (
          <div className="bg-white rounded-2xl shadow-elegant p-8 text-center">
            <Map className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Vue carte à venir</h3>
            <p className="text-gray-600">La visualisation des événements sur carte sera bientôt disponible.</p>
          </div>
        )}
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white rounded-lg shadow-sm p-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun événement trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche.
              </p>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default Events;