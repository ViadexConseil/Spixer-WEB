import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, AlertCircle, Users, Calendar, Shield, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const RoleStatus = () => {
  const { user, hasRole } = useAuth();

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Non connecté</h3>
          <p className="text-muted-foreground mb-4">
            Connectez-vous pour accéder aux tableaux de bord
          </p>
          <Button asChild>
            <Link to="/login">Se connecter</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            État de votre compte
          </CardTitle>
          <CardDescription>
            Informations sur vos rôles et accès aux tableaux de bord
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Utilisateur connecté</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="outline">Connecté</Badge>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Vos rôles et accès :</h4>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className={`p-4 rounded-lg border-2 ${hasRole('admin') ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Administrateur</span>
                  {hasRole('admin') ? (
                    <Badge className="bg-green-100 text-green-800">Actif</Badge>
                  ) : (
                    <Badge variant="secondary">Non attribué</Badge>
                  )}
                </div>
                {hasRole('admin') && (
                  <Button size="sm" asChild className="w-full">
                    <Link to="/admin">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Tableau de bord Admin
                    </Link>
                  </Button>
                )}
              </div>

              <div className={`p-4 rounded-lg border-2 ${hasRole('organizer') ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Organisateur</span>
                  {hasRole('organizer') ? (
                    <Badge className="bg-green-100 text-green-800">Actif</Badge>
                  ) : (
                    <Badge variant="secondary">Non attribué</Badge>
                  )}
                </div>
                {hasRole('organizer') ? (
                  <Button size="sm" asChild className="w-full">
                    <Link to="/organizer">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Tableau de bord Organisateur
                    </Link>
                  </Button>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Créez un événement pour devenir organisateur
                  </div>
                )}
              </div>
            </div>
          </div>

          {!hasRole('organizer') && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">
                      Comment accéder au tableau de bord organisateur ?
                    </h4>
                    <p className="text-sm text-amber-700 mb-3">
                      Pour devenir organisateur et accéder au tableau de bord, vous devez créer votre premier événement.
                    </p>
                    <Button size="sm" asChild>
                      <Link to="/create-event">
                        Créer un événement
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Rôles disponibles dans votre profil :</h4>
            <p className="text-sm text-muted-foreground">
              {user.roles && user.roles.length > 0 
                ? `Rôles actuels: ${user.roles.join(', ')}` 
                : 'Aucun rôle spécial attribué'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleStatus;