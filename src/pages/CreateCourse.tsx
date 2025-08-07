import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Upload, Eye, Save, Plus } from "lucide-react";

const CreateCourse = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasSubscription, setHasSubscription] = useState(false); // Simulate subscription status

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

  const handlePublish = () => {
    if (!hasSubscription) {
      // Redirect to pricing page
      window.location.href = '/pricing';
    } else {
      // Publish the course
      alert('Course publiée avec succès !');
      window.location.href = '/profil';
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
                  <Label htmlFor="title">Titre de la course</Label>
                  <Input id="title" placeholder="Marathon de votre ville" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input id="date" type="date" className="pl-10" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="location" placeholder="Ville, Pays" className="pl-10" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Décrivez votre événement..." 
                  rows={4}
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
                Ajoutez les différentes épreuves avec leurs parcours GPX
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Épreuves</h3>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter une épreuve
                </Button>
              </div>
              
              <div className="space-y-4">
                <Card className="border">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="epreuve1">Nom de l'épreuve</Label>
                        <Input id="epreuve1" placeholder="Marathon" />
                      </div>
                      <div>
                        <Label htmlFor="distance1">Distance</Label>
                        <Input id="distance1" placeholder="42.2 km" />
                      </div>
                      <div>
                        <Label htmlFor="heure1">Heure de départ</Label>
                        <Input id="heure1" type="time" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Fichier GPX</Label>
                      <div className="border border-gray-300 rounded-lg p-3 mt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Aucun fichier sélectionné</span>
                          <Button size="sm" variant="outline">
                            Parcourir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
              
              {!hasSubscription && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Abonnement requis</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Pour publier votre course, vous devez souscrire à un abonnement Spixer.
                  </p>
                  <Button size="sm" asChild>
                    <a href="/pricing">Voir les tarifs</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-4">Créer une nouvelle course</h1>
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
              <Button onClick={handlePublish} className="bg-spixer-orange hover:bg-spixer-orange-dark">
                Publier la course
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;