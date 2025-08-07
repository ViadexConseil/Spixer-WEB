import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const Inscription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for the course
  const course = {
    id: id,
    title: "Marathon de Paris",
    date: "2024-04-07",
    lieu: "Paris, France",
    distance: "42.2 km",
    image: "/lovable-uploads/77a7ef3b-a09f-4099-8c96-d468f4ded307.png"
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    gender: "",
    phone: "",
    preferredBib: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Note: L'API Spixer actuelle ne gère que l'auth, pas les inscriptions aux courses
      // Il faudrait utiliser registrationsAPI.create() quand l'endpoint sera disponible
      
      // Simulation d'inscription avec validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.birthDate || !formData.gender) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: Remplacer par l'appel API réel quand disponible
      // const response = await registrationsAPI.create({
      //   stage_id: stageId || id,
      //   user_id: "current-user-id", // À récupérer depuis le token JWT
      //   type: "runner",
      //   ...formData
      // });

      toast({
        title: "Inscription réussie !",
        description: `Merci ${formData.firstName} ${formData.lastName}, votre inscription a été confirmée.`,
      });

      // Redirect back to course detail
      navigate(`/courses/${id}`);
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de finaliser votre inscription. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 page-content">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center gap-2"
            onClick={() => navigate(`/courses/${id}`)}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la course
          </Button>

          {/* Course info header */}
          <div className="bg-white rounded-2xl shadow-elegant overflow-hidden mb-8">
            <div className="relative h-32 md:h-40">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 text-white">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
                  <div className="flex gap-4 text-sm">
                    <span>{new Date(course.date).toLocaleDateString('fr-FR')}</span>
                    <span>{course.lieu}</span>
                    <Badge className="bg-spixer-orange">{course.distance}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration form */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Inscription à la course</CardTitle>
                <p className="text-center text-gray-600">
                  Remplissez le formulaire ci-dessous pour vous inscrire
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Prénom *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Votre prénom"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nom *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Adresse email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre.email@example.com"
                      required
                    />
                  </div>

                  {/* Birth Date and Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date de naissance *
                      </Label>
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Sexe *</Label>
                      <Select onValueChange={handleSelectChange} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="homme">Homme</SelectItem>
                          <SelectItem value="femme">Femme</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Optional fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Téléphone (optionnel)
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+33 1 23 45 67 89"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preferredBib" className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Dossard souhaité (optionnel)
                      </Label>
                      <Input
                        id="preferredBib"
                        name="preferredBib"
                        type="number"
                        value={formData.preferredBib}
                        onChange={handleInputChange}
                        placeholder="Ex: 42"
                        min="1"
                        max="9999"
                      />
                    </div>
                  </div>

                  {/* Terms and conditions */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      En vous inscrivant, vous acceptez les conditions générales et le règlement de la course.
                      Le paiement sera traité dans une prochaine étape.
                    </p>
                  </div>

                  {/* Submit button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-spixer-orange hover:bg-spixer-orange-dark py-3 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Inscription en cours..." : "S'inscrire"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inscription;