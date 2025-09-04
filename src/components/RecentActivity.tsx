import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";

const RecentActivity = () => {
  const { events, loading } = useEvents();
  
  // Get only the 3 most recent events
  const recentEvents = events
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const getStatusBadge = (event: any) => {
    const eventDate = new Date(event.start_time);
    const now = new Date();
    
    if (eventDate > now) {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">📅 À venir</Badge>;
    } else {
      return <Badge variant="secondary">Terminé</Badge>;
    }
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="container px-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des événements...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Événements récents</h2>
            <p className="text-muted-foreground">Les derniers événements ajoutés</p>
          </div>
          
          <Button variant="outline" asChild>
            <Link to="/events">
              Voir tout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {recentEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentEvents.map((event) => {
              const imageUrl = event.images?.[0] || event.image_url || "/lovable-uploads/d8c8f0dd-a457-4a2d-b79b-5a64a0fd5515.png";
              
              return (
                <Card key={event.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img 
                      src={imageUrl} 
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(event)}
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {event.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.start_time).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {event.city}, {event.country}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Organisé par {event.organiser_email.split('@')[0]}
                    </div>

                    <Button className="w-full mt-4" variant="outline" asChild>
                      <Link to={`/events/${event.id}`}>
                        Voir détails
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun événement récent</h3>
            <p className="text-muted-foreground mb-6">
              Les nouveaux événements apparaîtront ici une fois créés.
            </p>
            <Button asChild>
              <Link to="/create-event">
                Créer un événement
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentActivity;