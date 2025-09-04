import { useState, useEffect, FormEvent } from "react";
import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";
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
const stripePromise = loadStripe("pk_test_51RxRpNRxbofe5B5pL2u8bFHnN0xlgQbmFSd9pdNQifKb8jzxLysUsovPbeqP6Ck3wrh6UxkdoAg4rG41MfKHDBVg00xYFuOAbm");

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const { id } = useParams();
  
  const [event, setEvent] = useState<Event | null>(location.state?.event || null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  // Course pricing
  const coursePrice = 15; // €15 for the course
  const commission = 3;   // €3 commission
  const totalAmount = coursePrice + commission;

  useEffect(() => {
    if (!event && id) {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          const fetchedEvent = await eventsAPI.get(id);
          setEvent(fetchedEvent);
        } catch (error) {
          console.error('Error fetching event:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les détails de l'événement.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id, event, toast]);

  // Initialize Stripe and create payment intent
  useEffect(() => {
    const initializePayment = async () => {
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

      try {
        // Initialize Stripe
        const stripeInstance = await stripePromise;
        if (!stripeInstance) {
          throw new Error('Impossible d\'initialiser Stripe');
        }
        setStripe(stripeInstance);

        // Create payment intent
        const totalAmountCents = Math.round(totalAmount * 100);
        const paymentIntent = await paymentsAPI.createIntent(totalAmountCents, 'eur');
        
        if (!paymentIntent.client_secret) {
          throw new Error('Client secret non reçu');
        }
        
        setClientSecret(paymentIntent.client_secret);

        // Create elements instance
        const elementsInstance = stripeInstance.elements({
          clientSecret: paymentIntent.client_secret,
        });
        setElements(elementsInstance);

        // Create and mount payment element
        const paymentElement = elementsInstance.create('payment');
        paymentElement.mount('#payment-element');

        console.log('Stripe payment setup completed successfully');
        
      } catch (error) {
        console.error('Payment initialization error:', error);
        const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de l'initialisation du paiement";
        toast({
          title: "Erreur d'initialisation",
          description: errorMessage,
          variant: "destructive",
        });
        setMessage(errorMessage);
      }
    };

    if (event) {
      initializePayment();
    }
  }, [event, navigate, toast, totalAmount]);

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email.",
        variant: "destructive",
      });
      return;
    }

    if (!stripe || !elements) {
      toast({
        title: "Erreur",
        description: "Stripe n'est pas encore initialisé. Veuillez patienter.",
        variant: "destructive",
      });
      return;
    }

    setPaymentLoading(true);
    setMessage("");

    try {
      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/profile`,
          payment_method_data: {
            billing_details: {
              email: email,
            },
          },
        },
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || 'Erreur de paiement');
          toast({
            title: "Erreur de paiement",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setMessage("Une erreur inattendue s'est produite.");
          toast({
            title: "Erreur",
            description: "Une erreur inattendue s'est produite lors du paiement.",
            variant: "destructive",
          });
        }
      } else {
        // Payment successful - will redirect to return_url
        toast({
          title: "Paiement en cours",
          description: "Votre paiement est en cours de traitement...",
        });
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors du paiement";
      setMessage(errorMessage);
      toast({
        title: "Erreur de paiement",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Événement non trouvé.</p>
              <Button onClick={() => navigate('/events')} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux événements
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Finaliser l'inscription</h1>
            <p className="text-muted-foreground mt-2">
              Complétez votre inscription pour participer à cet événement
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Event Details */}
            <Card className="h-fit">
              <CardContent className="space-y-4">
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <img 
                    src={event.images?.[0] || event.image_url || "/lovable-uploads/d8c8f0dd-a457-4a2d-b79b-5a64a0fd5515.png"} 
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <Badge className="absolute top-4 right-4 bg-white/90 text-black">
                    Premium
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">{event.name}</h2>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(event.start_time).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.city}, {event.country}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      Événement sportif
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Résumé de commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cours</span>
                      <span className="font-medium">{coursePrice}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Commission</span>
                      <span className="font-medium">{commission}€</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{totalAmount}€</span>
                    </div>
                  </div>

                  <form onSubmit={handlePayment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Adresse email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    {/* Stripe Payment Element */}
                    <div className="space-y-2">
                      <Label>Informations de paiement</Label>
                      <div id="payment-element" className="p-3 border rounded-md bg-background">
                        {/* Stripe Elements will be mounted here */}
                      </div>
                      {message && (
                        <p className="text-sm text-destructive">{message}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={paymentLoading || !stripe || !elements}
                    >
                      {paymentLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Payer {totalAmount}€
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Security Features */}
                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Shield className="mr-2 h-4 w-4 text-green-600" />
                      Paiement sécurisé par Stripe
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Check className="mr-2 h-4 w-4 text-green-600" />
                      Données chiffrées SSL
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Check className="mr-2 h-4 w-4 text-green-600" />
                      Garantie de remboursement
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;