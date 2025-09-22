import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

interface Participation {
  id: string;
  eventId?: string;
  title: string;
  date: string;
  status: string;
  position?: number;
}

interface ProfileParticipationsProps {
  participations: Participation[];
}

const ProfileParticipations = ({ participations }: ProfileParticipationsProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "À venir": return "default";
      case "Terminé": return "secondary";
      default: return "secondary";
    }
  };

  if (participations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Aucune participation</h3>
          <p className="text-muted-foreground mb-4">Vous n'avez participé à aucune course.</p>
          <Button asChild>
            <Link to="/events">Découvrir les événements</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {participations.map((participation) => (
        <Card key={participation.id} className="hover-lift">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{participation.title}</CardTitle>
              <Badge variant={getStatusVariant(participation.status)}>
                {participation.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(participation.date).toLocaleDateString('fr-FR')}</span>
              </div>
              {participation.position && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="w-4 h-4" />
                  <span>Position: {participation.position}</span>
                </div>
              )}
            </div>
            <Button className="w-full mt-4" variant="outline" asChild>
              <Link to={participation.eventId ? `/events/${participation.eventId}` : '/events'}>
                Voir détails
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProfileParticipations;