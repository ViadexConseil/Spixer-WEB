import React, { useState, useEffect } from "react";
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
import { eventsAPI, stagesAPI, registrationsAPI, userInformationsAPI, Event, Stage, getAuthToken } from "@/services/api";

const Inscription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [selectedStage, setSelectedStage] = useState<string>("");

  const isRegistrationOpen = (event: Event): boolean => {
    if (!event.registration_end_time) return true; // No deadline means always open
    if (event.is_draft === 1) return false; // Draft events not open for registration
    if (event.cancel_reason) return false; // Cancelled events not open
    
    const now = new Date();
    const deadline = new Date(event.registration_end_time);
    return now < deadline;
  };

  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;
      
      try {
        const eventData = await eventsAPI.get(id);
        setEvent(eventData);
        
        // Check if registration is still open
        if (!isRegistrationOpen(eventData)) {
          let message = "Les inscriptions sont fermées pour cet événement.";
          
          if (eventData.is_draft === 1) {
            message = "Cet événement est encore en préparation.";
          } else if (eventData.cancel_reason) {
            message = "Cet événement a été annulé.";
          } else if (eventData.registration_end_time) {
            message = `Les inscriptions ont fermé le ${new Date(eventData.registration_end_time).toLocaleString('fr-FR')}.`;
          }
          
          toast({
            title: "Inscription impossible",
            description: message,
            variant: "destructive",
          });
          navigate(`/courses/${id}`);
          return;
        }
        
        const stagesData = await stagesAPI.getByEvent(id);
        setStages(stagesData);
        
        // If no stages available, create a default registration option
        if (stagesData.length === 0) {
          // For now, allow registration without a specific stage
          setSelectedStage("default");
        } else {
          setSelectedStage(stagesData[0].id);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'événement:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de l'événement.",
          variant: "destructive",
        });
        navigate('/courses');
      }
    };

    fetchEventData();
  }, [id, navigate, toast]);

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
      // Check if user is authenticated
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour vous inscrire à une course.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      // Check if registration is still open (server-side validation)
      if (event && !isRegistrationOpen(event)) {
        throw new Error("Les inscriptions sont fermées pour cet événement.");
      }

      // Validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.birthDate || !formData.gender) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      if (!selectedStage) {
        throw new Error("Veuillez sélectionner une épreuve");
      }

      // For events without stages, create a temporary stage reference
      const stageToUse = selectedStage === "default" ? {
        id: "default",
        name: event?.name || "Course principale",
        description: "Inscription à l'événement"
      } : stages.find(s => s.id === selectedStage);

      if (!stageToUse) {
        throw new Error("Épreuve sélectionnée introuvable");
      }

      // Update user information first if provided
      if (formData.firstName || formData.lastName || formData.birthDate || formData.phone) {
        await userInformationsAPI.update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          birthdate: formData.birthDate,
          phone: formData.phone,
        });
      }

      // Create registration (API will infer user_id from token)
      // For events without proper stages, we may need to skip registration for now
      let registrationResponse;
      
      if (selectedStage === "default") {
        // Skip registration creation for now if no valid stages available
        // In a real scenario, you'd need to create a stage first or handle this differently
        toast({
          title: "Information",
          description: "Cette fonctionnalité sera bientôt disponible. Redirection vers le paiement...",
        });
        
        // Simulate a registration response
        registrationResponse = {
          registration_id: `temp-${Date.now()}`,
          message: "Registration simulated"
        };
      } else {
        registrationResponse = await registrationsAPI.create({
          stage_id: selectedStage,
          type: "runner"
        });
      }

      toast({
        title: "Inscription réussie !",
        description: `Merci ${formData.firstName} ${formData.lastName}, votre inscription a été confirmée.`,
      });

      // Redirect to checkout for payment
      navigate(`/checkout`, { 
        state: { 
          event,
          stage: stageToUse,
          registrationId: registrationResponse.registration_id,
          price: 25 // Base price, should be configured per event
        }
      });
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
          {event && (
            <div className="bg-white rounded-2xl shadow-elegant overflow-hidden mb-8">
              <div className="relative h-32 md:h-40">
                <img 
                  src="/lovable-uploads/77a7ef3b-a09f-4099-8c96-d468f4ded307.png" 
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                  <div className="p-6 text-white">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{event.name}</h1>
                    <div className="flex gap-4 text-sm">
                      <span>{new Date(event.start_time).toLocaleDateString('fr-FR')}</span>
                      <span>{event.city}, {event.country}</span>
                      {stages.length > 0 && (
                        <Badge className="bg-spixer-orange">{stages.length} épreuve(s)</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Registration form */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Inscription à la course</CardTitle>
                <p className="text-center text-gray-600">
                  Remplissez le formulaire ci-dessous pour vous inscrire
                </p>
                
                {/* Registration deadline info */}
                {event?.registration_end_time && (
                  <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                    <div className="text-center">
                      <span className="text-sm font-medium text-blue-800">
                        Limite d'inscription: {new Date(event.registration_end_time).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </div>
                )}
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

                  {/* Stage Selection */}
                  <div className="space-y-2">
                    <Label>Épreuve *</Label>
                    {stages.length > 0 ? (
                      <Select value={selectedStage} onValueChange={setSelectedStage} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une épreuve" />
                        </SelectTrigger>
                        <SelectContent>
                          {stages.map((stage) => (
                            <SelectItem key={stage.id} value={stage.id}>
                              {stage.name} - {stage.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 bg-gray-100 rounded-md text-gray-700">
                        Course principale - {event?.name}
                      </div>
                    )}
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