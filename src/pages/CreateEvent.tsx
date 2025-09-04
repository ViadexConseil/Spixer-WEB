import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Upload, Eye, Save, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { eventsAPI, stagesAPI, authAPI, Event, Stage, getAuthToken } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    start_time: "",
    city: "",
    country: "France",
    postal_code: ""
  });
  const [stages, setStages] = useState([{
    name: "",
    description: "",
    max_participants: 100,
    id: Date.now().toString(),
    start_time: "",
    end_time: "",
    registration_end_time: "",
  }]);

  const addStage = () => {
    setStages([...stages, {
      name: "",
      description: "",
      max_participants: 100,
      id: Date.now().toString(),
      start_time: "",
      end_time: "",
      registration_end_time: "",
    }]);
  };

  const removeStage = (stageId: string) => {
    if (stages.length > 1) {
      setStages(stages.filter(stage => stage.id !== stageId));
    }
  };

  const updateStage = (stageId: string, field: string, value: string | number) => {
    setStages(stages.map(stage => 
      stage.id === stageId ? { ...stage, [field]: value } : stage
    ));
  };

  const steps = [
    { id: 1, title: "Détails de l'événement", description: "Informations générales" },
    { id: 2, title: "Import OnePlan", description: "Zones logistiques" },
    { id: 3, title: "Épreuves", description: "GPX et horaires" },
    { id: 4, title: "Aperçu", description: "Vérification finale" }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour créer une course.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      // Validation
      if (!eventData.name || !eventData.start_time || !eventData.city) {
        toast({
          title: "Champs manquants",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive",
        });
        return;
      }

      // Create event
      const createdEvent = await eventsAPI.create({
        name: eventData.name,
        description: eventData.description,
        start_time: eventData.start_time,
        city: eventData.city,
        postal_code: eventData.postal_code
      });

      // Create stages for the event
      const stagesToCreate = stages.filter(stage => stage.name.trim() !== "");
      
      // Create the specified stages
      for (const stage of stagesToCreate) {
        if (!stage.start_time || !stage.end_time || !stage.registration_end_time) {
            toast({
                title: "Dates manquantes pour une épreuve",
                description: `Veuillez renseigner toutes les dates pour l'épreuve: ${stage.name}`,
                variant: "destructive",
            });
            // We should probably stop the whole process here
            throw new Error("Missing dates for a stage");
        }
        await stagesAPI.create({
          event_id: createdEvent.event_id,
          name: stage.name,
          description: stage.description,
          start_time: stage.start_time,
          end_time: stage.end_time,
          registration_end_time: stage.registration_end_time,
          max_participants: stage.max_participants
        });
      }

      if (stagesToCreate.length === 0) {
        toast({
            title: "Aucune épreuve",
            description: "Veuillez ajouter au moins une épreuve à votre événement.",
            variant: "destructive",
        });
        throw new Error("No stages provided");
      }

      toast({
        title: "Course créée !",
        description: "Votre course a été publiée avec succès.",
      });

      navigate('/profile');
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
      toast({
        title: "Erreur",
        description: "Impossible de publier la course. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Détails de l'événement</CardTitle>
              <CardDescription>
                Renseignez les informations principales de votre course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de la course *</Label>
                  <Input 
                    id="title" 
                    placeholder="Marathon de votre ville" 
                    value={eventData.name}
                    onChange={(e) => setEventData({...eventData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="date" 
                      type="datetime-local" 
                      className="pl-10" 
                      value={eventData.start_time}
                      onChange={(e) => setEventData({...eventData, start_time: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="city" 
                      placeholder="Paris" 
                      className="pl-10" 
                      value={eventData.city}
                      onChange={(e) => setEventData({...eventData, city: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input 
                    id="country" 
                    placeholder="France" 
                    value={eventData.country}
                    onChange={(e) => setEventData({...eventData, country: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Code postal</Label>
                  <Input 
                    id="postal_code" 
                    placeholder="75001" 
                    value={eventData.postal_code}
                    onChange={(e) => setEventData({...eventData, postal_code: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Décrivez votre événement..." 
                  rows={4}
                  value={eventData.description}
                  onChange={(e) => setEventData({...eventData, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image de couverture</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">
                    Glissez-déposez une image ou cliquez pour sélectionner
                  </p>
                  <Input type="file" accept="image/*" className="hidden" />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Import OnePlan</CardTitle>
              <CardDescription>
                Importez votre fichier OnePlan pour définir les zones logistiques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Importer un fichier OnePlan</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Formats acceptés: .oneplan, .json
                </p>
                <Button variant="outline">
                  Sélectionner un fichier
                </Button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Qu'est-ce qu'OnePlan ?</h4>
                <p className="text-sm text-blue-800">
                  OnePlan vous permet de définir précisément les zones de départ, 
                  d'arrivée, de ravitaillement et autres points logistiques de votre course.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Épreuves et parcours</CardTitle>
              <CardDescription>
                Ajoutez les différentes épreuves avec leurs parcours GPX (optionnel - si aucune épreuve n'est ajoutée, une épreuve par défaut sera créée)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Épreuves</h3>
                <Button size="sm" className="flex items-center gap-2" onClick={addStage}>
                  <Plus className="w-4 h-4" />
                  Ajouter une épreuve
                </Button>
              </div>
              
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <Card key={stage.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-sm font-semibold text-gray-700">Épreuve {index + 1}</h4>
                        {stages.length > 1 && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => removeStage(stage.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`epreuve-${stage.id}`}>Nom de l'épreuve *</Label>
                            <Input
                              id={`epreuve-${stage.id}`}
                              placeholder="Ex: Marathon, Semi-marathon..."
                              value={stage.name}
                              onChange={(e) => updateStage(stage.id, 'name', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`participants-${stage.id}`}>Nombre max de participants</Label>
                            <Input
                              id={`participants-${stage.id}`}
                              type="number"
                              placeholder="100"
                              value={stage.max_participants}
                              onChange={(e) => updateStage(stage.id, 'max_participants', parseInt(e.target.value) || 100)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor={`start_time-${stage.id}`}>Début *</Label>
                                <Input type="datetime-local" id={`start_time-${stage.id}`} value={stage.start_time} onChange={(e) => updateStage(stage.id, 'start_time', e.target.value)} required />
                            </div>
                            <div>
                                <Label htmlFor={`end_time-${stage.id}`}>Fin *</Label>
                                <Input type="datetime-local" id={`end_time-${stage.id}`} value={stage.end_time} onChange={(e) => updateStage(stage.id, 'end_time', e.target.value)} required />
                            </div>
                            <div>
                                <Label htmlFor={`registration_end_time-${stage.id}`}>Fin des inscriptions *</Label>
                                <Input type="datetime-local" id={`registration_end_time-${stage.id}`} value={stage.registration_end_time} onChange={(e) => updateStage(stage.id, 'registration_end_time', e.target.value)} required />
                            </div>
                        </div>
                        <div>
                          <Label htmlFor={`description-${stage.id}`}>Description</Label>
                          <Textarea
                            id={`description-${stage.id}`}
                            placeholder="Description de l'épreuve..."
                            rows={2}
                            value={stage.description}
                            onChange={(e) => updateStage(stage.id, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {stages.every(stage => !stage.name.trim()) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Info:</strong> Si aucune épreuve n'est configurée, une épreuve par défaut sera automatiquement créée avec le nom de votre événement.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Aperçu de votre course</CardTitle>
              <CardDescription>
                Vérifiez les informations avant publication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Marathon de votre ville</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Date:</span> 15 juin 2024
                  </div>
                  <div>
                    <span className="font-semibold">Lieu:</span> Votre ville, France
                  </div>
                  <div>
                    <span className="font-semibold">Épreuves:</span> 1
                  </div>
                  <div>
                    <span className="font-semibold">Statut:</span> 
                    <Badge className="ml-2">Brouillon</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 page-content">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-4">Créer un nouvel événement</h1>
          <p className="section-subtitle">Configurez votre événement sportif en quelques étapes</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-elegant p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold ${
                  currentStep >= step.id ? 'bg-spixer-orange text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-semibold ${
                    currentStep >= step.id ? 'text-spixer-orange' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-spixer-orange' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Précédent
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Sauvegarder
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Aperçu
            </Button>
            
            {currentStep < steps.length ? (
              <Button onClick={handleNext} className="bg-spixer-orange hover:bg-spixer-orange-dark">
                Suivant
              </Button>
            ) : (
              <Button 
                onClick={handlePublish} 
                className="bg-spixer-orange hover:bg-spixer-orange-dark"
                disabled={isLoading}
              >
                {isLoading ? "Publication..." : "Publier la course"}
              </Button>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;