import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { ProfileUser } from "@/services/api";

interface ProfileHeaderProps {
  user: ProfileUser;
  participations: number;
  eventsCreated: number;
}

const ProfileHeader = ({ user, participations, eventsCreated }: ProfileHeaderProps) => {
  const displayName = user.name || 
    (user.first_name || user.last_name ? 
      `${user.first_name || ''} ${user.last_name || ''}`.trim() : 
      user.username) || 
    user.email;

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar_url || ""} />
              <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                {displayName.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">{displayName}</h1>
              <p className="text-muted-foreground mb-2">{user.email}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {user.is_premium ? "Premium" : "Gratuit"}
                </Badge>
                {user.roles && user.roles.length > 0 && (
                  <Badge variant="outline">
                    {user.roles.join(", ")}
                  </Badge>
                )}
                <Badge variant="outline">
                  Membre depuis {new Date(user.user_created_at).toLocaleDateString('fr-FR')}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/create-event" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Créer un événement
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/settings">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-3xl font-bold text-primary mb-2">{participations}</div>
            <div className="text-sm text-muted-foreground">Participations</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-3xl font-bold text-secondary-foreground mb-2">{eventsCreated}</div>
            <div className="text-sm text-muted-foreground">Événements créés</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-3xl font-bold text-green-600 mb-2">{user.volunteer_assignments?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Missions bénévoles</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-3xl font-bold text-purple-600 mb-2">{user.favorite_sports?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Sports favoris</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;