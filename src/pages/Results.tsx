import React, { useState } from "react";
import { Search, Filter, Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

const Results = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockResults = [
    {
      id: "1",
      eventName: "Marathon de Paris 2024",
      participantName: "Jean Dupont",
      position: 1,
      time: "2:08:45",
      category: "Senior M",
      date: "2024-04-07"
    },
    {
      id: "2", 
      eventName: "Trail des Vosges",
      participantName: "Marie Martin",
      position: 3,
      time: "1:45:32",
      category: "Senior F",
      date: "2024-03-15"
    },
    {
      id: "3",
      eventName: "10K Lyon",
      participantName: "Pierre Dubois",
      position: 12,
      time: "38:21",
      category: "Vétéran M",
      date: "2024-03-10"
    }
  ];

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (position === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (position === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-medium">#{position}</span>;
  };

  const filteredResults = mockResults.filter(result =>
    result.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm border bg-muted/50">
              🏆 Résultats et Classements
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold">
              Résultats des courses
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Consultez les résultats en temps réel et les classements de tous les événements
            </p>
          </div>

          {/* Search */}
          <div className="bg-card rounded-2xl border p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher par événement ou participant..."
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
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-muted-foreground">Événements terminés</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">45.2K</div>
                <div className="text-sm text-muted-foreground">Participants classés</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">2:08:45</div>
                <div className="text-sm text-muted-foreground">Record marathon</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Medal className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">99.7%</div>
                <div className="text-sm text-muted-foreground">Précision chronométrage</div>
              </CardContent>
            </Card>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Derniers résultats</h2>
            
            {filteredResults.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                        {getPositionIcon(result.position)}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg">{result.eventName}</h3>
                        <p className="text-muted-foreground">{result.participantName}</p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="text-2xl font-bold">{result.time}</div>
                      <Badge variant="secondary">{result.category}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      {new Date(result.date).toLocaleDateString('fr-FR')}
                    </span>
                    
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Results;