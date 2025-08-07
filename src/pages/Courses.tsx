import React, { useState } from "react";
import { Search, Filter, Map, List, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Courses = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  const mockCourses = [
    {
      id: 1,
      title: "Marathon de Paris",
      date: "2024-04-07",
      lieu: "Paris, France",
      participants: 50000,
      status: "À venir",
      distance: "42.2 km",
      image: "/lovable-uploads/d8c8f0dd-a457-4a2d-b79b-5a64a0fd5515.png"
    },
    {
      id: 2,
      title: "Trail du Mont-Blanc",
      date: "2024-08-25",
      lieu: "Chamonix, France",
      participants: 2300,
      status: "Live",
      distance: "171 km",
      image: "/lovable-uploads/d8c8f0dd-a457-4a2d-b79b-5a64a0fd5515.png"
    },
    {
      id: 3,
      title: "10km de Marseille",
      date: "2024-03-15",
      lieu: "Marseille, France",
      participants: 8500,
      status: "Terminé",
      distance: "10 km",
      image: "/lovable-uploads/d8c8f0dd-a457-4a2d-b79b-5a64a0fd5515.png"
    }
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-4">Toutes les courses</h1>
          <p className="section-subtitle">Découvrez toutes les courses à venir et passées</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-elegant p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher une course..."
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

        {/* Course List */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.map((course) => (
              <Card key={course.id} className="hover-lift cursor-pointer group">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className={`absolute top-4 right-4 ${getStatusBadge(course.status)}`}>
                    {course.status}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(course.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{course.lieu}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{course.participants.toLocaleString()} participants</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                        {course.distance}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <a href={`/courses/${course.id}`}>Voir la course</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Map View Placeholder */}
        {viewMode === 'map' && (
          <div className="bg-white rounded-2xl shadow-elegant p-8 text-center">
            <Map className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Vue carte à venir</h3>
            <p className="text-gray-600">La visualisation des courses sur carte sera bientôt disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;