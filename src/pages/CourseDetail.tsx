import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, MapPin, Users, Share2, Heart, Trophy, Video, Info, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CourseDetail = () => {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock data for the course
  const course = {
    id: id,
    title: "Marathon de Paris",
    date: "2024-04-07",
    lieu: "Paris, France",
    participants: 50000,
    status: "À venir",
    distance: "42.2 km",
    description: "Le Marathon de Paris est l'un des événements de course à pied les plus prestigieux au monde.",
    image: "/lovable-uploads/d8c8f0dd-a457-4a2d-b79b-5a64a0fd5515.png",
    partnerLogo: "/logo.svg"
  };

  const mockClassement = [
    { position: 1, nom: "Jean Dupont", temps: "2:15:34", dossard: "001" },
    { position: 2, nom: "Marie Martin", temps: "2:18:42", dossard: "002" },
    { position: 3, nom: "Pierre Bernard", temps: "2:22:15", dossard: "003" },
    { position: 4, nom: "Sophie Dubois", temps: "2:25:31", dossard: "004" },
    { position: 5, nom: "Antoine Moreau", temps: "2:28:07", dossard: "005" }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      "Live": "bg-red-500 text-white",
      "À venir": "bg-spixer-blue text-white",
      "Terminé": "bg-gray-500 text-white"
    };
    return variants[status as keyof typeof variants] || "bg-gray-500 text-white";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-elegant overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 md:p-8 text-white">
                <Badge className={`mb-4 ${getStatusBadge(course.status)}`}>
                  {course.status}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(course.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{course.lieu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{course.participants.toLocaleString()} participants</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
              <p className="text-gray-600 flex-1">{course.description}</p>
              <div className="flex gap-3">
                <Button 
                  variant={isFollowing ? "default" : "outline"} 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className="flex items-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
                  {isFollowing ? 'Suivi' : 'Suivre'}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Partager
                </Button>
                <Button className="bg-spixer-orange hover:bg-spixer-orange-dark">
                  Participer
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="classement" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classement" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Classement
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Vidéo
            </TabsTrigger>
            <TabsTrigger value="carte" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Carte GPX
            </TabsTrigger>
            <TabsTrigger value="infos" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Infos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classement">
            <Card>
              <CardHeader>
                <CardTitle>Classement en direct</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClassement.map((runner) => (
                    <div key={runner.position} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          runner.position === 1 ? 'bg-yellow-500' : 
                          runner.position === 2 ? 'bg-gray-400' : 
                          runner.position === 3 ? 'bg-amber-600' : 'bg-gray-600'
                        }`}>
                          {runner.position}
                        </div>
                        <div>
                          <div className="font-semibold">{runner.nom}</div>
                          <div className="text-sm text-gray-600">Dossard #{runner.dossard}</div>
                        </div>
                      </div>
                      <div className="text-lg font-mono font-semibold">
                        {runner.temps}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video">
            <Card>
              <CardHeader>
                <CardTitle>Replay vidéo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Video className="w-16 h-16 mx-auto mb-4" />
                    <p>Replay vidéo à venir</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="carte">
            <Card>
              <CardHeader>
                <CardTitle>Carte GPX interactive</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Map className="w-16 h-16 mx-auto mb-4" />
                    <p>Carte interactive à venir</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="infos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Épreuves</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Marathon</span>
                      <span className="font-semibold">42.2 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Semi-marathon</span>
                      <span className="font-semibold">21.1 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>10km</span>
                      <span className="font-semibold">10 km</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Départ Marathon</span>
                      <span className="font-semibold">08:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Départ Semi</span>
                      <span className="font-semibold">09:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Départ 10km</span>
                      <span className="font-semibold">10:00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {course.partnerLogo && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Partenaire officiel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center p-8">
                      <img src={course.partnerLogo} alt="Partenaire" className="h-16" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetail;