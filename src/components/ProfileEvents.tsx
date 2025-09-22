import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  date: string;
  participants: number;
  status: string;
}

interface ProfileEventsProps {
  events: Event[];
}

const ProfileEvents = ({ events }: ProfileEventsProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Publié": return "default";
      default: return "secondary";
    }
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Plus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Aucun événement créé</h3>
          <p className="text-muted-foreground mb-4">Vous n'avez pas encore créé d'événement.</p>
          <Button asChild>
            <Link to="/create-event">Créer mon premier événement</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mes événements</h2>
        <Button asChild>
          <Link to="/create-event" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouvel événement
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover-lift">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Badge variant={getStatusVariant(event.status)}>
                  {event.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{event.participants} participants</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  Modifier
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link to={`/events/${event.id}`}>Voir</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileEvents;