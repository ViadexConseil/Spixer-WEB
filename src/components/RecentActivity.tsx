import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const RecentActivity = () => {
  const recentEvents = [
    {
      id: "1",
      name: "Marathon de Paris",
      date: "2024-04-07",
      location: "Paris, France",
      participants: 45000,
      status: "live",
      image: "/lovable-uploads/d8c8f0dd-a457-4a2d-b79b-5a64a0fd5515.png"
    },
    {
      id: "2", 
      name: "Trail des Vosges",
      date: "2024-04-14",
      location: "Gérardmer, France",
      participants: 2500,
      status: "upcoming",
      image: "/lovable-uploads/62c5c1e4-dbde-497d-886c-fee818178bf0.png"
    },
    {
      id: "3",
      name: "Semi-Marathon Lyon",
      date: "2024-04-21", 
      location: "Lyon, France",
      participants: 8000,
      status: "upcoming",
      image: "/lovable-uploads/9bdc128b-ce3d-44ef-a8e4-2686ae6af174.png"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'live':
        return <Badge className="bg-red-100 text-red-700 border-red-200">🔴 En direct</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">📅 À venir</Badge>;
      default:
        return <Badge variant="secondary">Terminé</Badge>;
    }
  };

  return (
    <section className="py-12">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Activité récente</h2>
            <p className="text-muted-foreground">Les derniers événements et actualités</p>
          </div>
          
          <Button variant="outline" asChild>
            <Link to="/events">
              Voir tout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentEvents.map((event) => (
            <Card key={event.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img 
                  src={event.image} 
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(event.status)}
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {event.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.date).toLocaleDateString('fr-FR', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {event.participants.toLocaleString()} participants
                </div>

                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link to={`/events/${event.id}`}>
                    {event.status === 'live' ? 'Suivre en direct' : 'Voir détails'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentActivity;