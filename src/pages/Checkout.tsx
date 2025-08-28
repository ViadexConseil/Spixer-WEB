import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Shield, ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { eventsAPI, paymentsAPI, Event, getAuthToken } from "@/services/api";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe("pk_test_your_publishable_key_here");

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [coursePrice, setCoursePrice] = useState(0);
  const [email, setEmail] = useState("");
  
  // Flat commission fee of 2 EUR
  const commission = 2;

  // Get course data from location state or fetch it
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        let courseData;
        
        // Try to get from location state first
        if (location.state?.event) {
          courseData = location.state.event;
          setCoursePrice(location.state.price || 0);
        } else if (id) {
          // Fallback to fetching by ID
          courseData = await eventsAPI.get(id);
          setCoursePrice(location.state?.price || 50); // Default price if not provided
        } else {
          throw new Error("No course data available");
        }
        
        setEvent(courseData);
      } catch (error) {
        console.error("Failed to load course data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du cours",
          variant: "destructive",
        });
        navigate(-1);
      }
    };

    fetchCourseData();
  }, [id, location.state, navigate, toast]);

  const totalAmount = coursePrice + commission;

  const handlePayment = async () => {
    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre email pour continuer",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Check if user is authenticated
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour finaliser le paiement.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      // Calculate total amount in cents for Stripe (API expects amount in cents)
      const totalAmountCents = Math.round(totalAmount * 100);

      // Create Stripe payment intent using the API
      const paymentIntent = await paymentsAPI.createIntent(totalAmountCents, 'eur');

      toast({
        title: "Redirection vers le paiement",
        description: "Vous allez être redirigé vers Stripe pour finaliser le paiement.",
      });

      // For now, simulate success since we need proper Stripe setup
      // In real implementation, you would use the client_secret to confirm payment
      setTimeout(() => {
        toast({
          title: "Paiement réussi !",
          description: "Votre inscription a été confirmée.",
        });
        navigate('/profil');
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors du paiement";
      toast({
        title: "Erreur de paiement",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold">Inscription à la course</h1>
              <p className="text-muted-foreground">Paiement sécurisé par Stripe</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Course Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Détails de la course</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <img 
                    src="/lovable-uploads/d8c8f0dd-a457-4a2d-b79b-5a64a0fd5515.png" 
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{new Date(event.start_time).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{event.city}, {event.country}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Résumé de commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Prix de la course</span>
                    <span className="font-medium">{coursePrice}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Commission plateforme</span>
                    <span className="font-medium">{commission}€</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total</span>
                    <span>{totalAmount}€</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={loading || !email}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        S&apos;inscrire pour {totalAmount}€
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Paiement sécurisé par Stripe</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Votre inscription inclut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Dossard personnalisé</p>
                      <p className="text-sm text-muted-foreground">Avec votre nom et numéro unique</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Suivi en temps réel</p>
                      <p className="text-sm text-muted-foreground">Chronométrage et classement live</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Certificat de participation</p>
                      <p className="text-sm text-muted-foreground">Téléchargeable après la course</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;