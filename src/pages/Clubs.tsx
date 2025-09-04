import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Users, Calendar, MapPin, Trophy, Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { clubsAPI, Club } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const Clubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubsList = await clubsAPI.list();
        setClubs(clubsList);
      } catch (error) {
        console.error('Error fetching clubs:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les clubs.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.federation_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted page-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des clubs...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted page-content">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              Communauté Sportive
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Découvrez les Clubs
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Rejoignez des communautés passionnées et participez à des événements organisés par les meilleurs clubs sportifs
            </p>
          </div>

          {/* Search and Create */}
          <div className="bg-card rounded-3xl shadow-lg border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Rechercher un club..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
              
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl px-6 py-3 font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Créer un club
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-2xl p-6 text-center border shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">{clubs.length}</h3>
              <p className="text-muted-foreground">Clubs actifs</p>
            </div>
            <div className="bg-card rounded-2xl p-6 text-center border shadow-sm">
              <div className="bg-secondary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-1">150+</h3>
              <p className="text-muted-foreground">Événements organisés</p>
            </div>
            <div className="bg-card rounded-2xl p-6 text-center border shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">5000+</h3>
              <p className="text-muted-foreground">Membres actifs</p>
            </div>
          </div>

          {/* Clubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClubs.map((club, index) => {
              const imageUrl = club.images?.[0] || club.image_url || "/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png";
              
              return (
                <Card 
                  key={club.id} 
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-primary/90 hover:bg-primary text-white">
                      {club.federation_name}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-4 left-4 text-white hover:bg-white/20 rounded-full p-2"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                      {club.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {club.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>Membre depuis {new Date(club.created_at).getFullYear()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl"
                        asChild
                      >
                        <Link to={`/clubs/${club.id}`}>Découvrir</Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-xl border-primary/20 hover:bg-primary/5"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredClubs.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-card rounded-3xl shadow-lg border p-12 max-w-md mx-auto">
                <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aucun club trouvé</h3>
                <p className="text-muted-foreground mb-6">
                  Essayez de modifier vos critères de recherche ou créez le premier club.
                </p>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un club
                </Button>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-primary via-primary to-secondary rounded-3xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Rejoignez la communauté</h2>
            <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
              Créez votre propre club ou rejoignez-en un existant pour organiser des événements inoubliables
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 rounded-xl px-8 py-3 font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Créer mon club
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 rounded-xl px-8 py-3 font-medium"
              >
                Découvrir plus
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Clubs;