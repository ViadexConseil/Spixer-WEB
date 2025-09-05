import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Calendar, 
  Trophy, 
  BarChart3, 
  Shield, 
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  FileText,
  TrendingUp,
  MapPin,
  Star
} from "lucide-react";
import { eventsAPI, authAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    if (!hasRole('admin')) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions d'administrateur.",
        variant: "destructive"
      });
      return;
    }
    
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const eventsData = await eventsAPI.list();
      setEvents(eventsData);
      // Note: User management endpoint would need to be added to API
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const getEventStats = () => {
    const total = events.length;
    const upcoming = events.filter(e => new Date(e.start_time) > new Date()).length;
    const ongoing = events.filter(e => {
      const now = new Date();
      return new Date(e.start_time) <= now && new Date(e.end_time) >= now;
    }).length;
    const completed = events.filter(e => new Date(e.end_time) < new Date()).length;
    
    return { total, upcoming, ongoing, completed };
  };

  const stats = getEventStats();

  if (!hasRole('admin')) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background page-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Accès non autorisé</h1>
              <p className="text-muted-foreground">Vous devez être administrateur pour accéder à cette page.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background page-content">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement du tableau de bord...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background page-content">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Tableau de bord Admin</h1>
                <p className="text-muted-foreground">Gérez la plateforme Spixer</p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Administrateur
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Événements</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">À venir</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">En cours</p>
                      <p className="text-2xl font-bold text-green-600">{stats.ongoing}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Terminés</p>
                      <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Dashboard */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="events">Événements</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="analytics">Analyses</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Événements récents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events.slice(0, 5).map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{event.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {event.city}, {event.country}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {new Date(event.start_time).toLocaleDateString('fr-FR')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      État du système
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>API Spixer</span>
                        <Badge className="bg-green-100 text-green-800">En ligne</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Base de données</span>
                        <Badge className="bg-green-100 text-green-800">Opérationnelle</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Stockage fichiers</span>
                        <Badge className="bg-green-100 text-green-800">Disponible</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Système de paiements</span>
                        <Badge className="bg-green-100 text-green-800">Actif</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Events Management Tab */}
            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Gestion des événements</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Rechercher un événement..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtres
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events
                      .filter(event => 
                        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.city.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">{event.name}</h3>
                              <Badge variant={
                                new Date(event.start_time) > new Date() ? "default" :
                                new Date(event.end_time) < new Date() ? "secondary" : "destructive"
                              }>
                                {new Date(event.start_time) > new Date() ? "À venir" :
                                 new Date(event.end_time) < new Date() ? "Terminé" : "En cours"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.city}, {event.country}
                              </span>
                              <span>{new Date(event.start_time).toLocaleDateString('fr-FR')}</span>
                              <span>Organisé par {event.organiser_email}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Management Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      La gestion des utilisateurs sera disponible prochainement.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Statistiques de la plateforme
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Événements par mois</span>
                        <span className="font-bold">{Math.floor(stats.total / 12)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Taux de participation</span>
                        <span className="font-bold">87%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Organisateurs actifs</span>
                        <span className="font-bold">{new Set(events.map(e => e.organiser_email)).size}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Croissance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Graphiques détaillés disponibles prochainement.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;