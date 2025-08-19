import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe("pk_test_your_publishable_key_here");

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("premium");

  const plans = {
    basic: {
      name: "Plan Basique",
      price: 29,
      description: "Parfait pour débuter",
      features: ["5 formations", "Support email", "Accès mobile"]
    },
    premium: {
      name: "Plan Premium",
      price: 59,
      description: "Le plus populaire",
      features: ["15 formations", "Support prioritaire", "Accès mobile", "Certificats", "Communauté privée"]
    },
    pro: {
      name: "Plan Pro",
      price: 99,
      description: "Pour les professionnels",
      features: ["Formations illimitées", "Support 24/7", "Accès mobile", "Certificats", "Communauté privée", "Coaching 1-on-1"]
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Call your backend API to create a payment session
      const response = await fetch('/api/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan,
          amount: plans[selectedPlan].price * 100, // Convert to cents
          currency: 'eur'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue lors du paiement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-2xl font-display font-bold">Checkout</h1>
              <p className="text-muted-foreground">Sécurisé par Stripe</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Plan Selection */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Choisissez votre plan</h2>
              <div className="space-y-4">
                {Object.entries(plans).map(([key, plan]) => (
                  <Card 
                    key={key}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedPlan === key 
                        ? 'ring-2 ring-primary shadow-md' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPlan(key)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{plan.price}€</div>
                          <div className="text-sm text-muted-foreground">/mois</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
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
                    <span>Plan sélectionné</span>
                    <Badge variant="secondary">{plans[selectedPlan].name}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Prix mensuel</span>
                    <span className="font-medium">{plans[selectedPlan].price}€</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total</span>
                    <span>{plans[selectedPlan].price}€</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={loading}
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
                        Payer avec Stripe
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
                <CardTitle className="text-lg">Pourquoi choisir notre plateforme ?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Formations de qualité</p>
                      <p className="text-sm text-muted-foreground">Créées par des experts reconnus</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Accès à vie</p>
                      <p className="text-sm text-muted-foreground">Pas d'abonnement, un seul paiement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Support dédié</p>
                      <p className="text-sm text-muted-foreground">Une équipe à votre écoute</p>
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