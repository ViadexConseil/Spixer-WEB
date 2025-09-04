import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import Navigation from "@/components/Navigation";

const Pricing = () => {
  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "",
      description: "Pour découvrir Spixer",
      popular: false,
      features: [
        "1 course par mois",
        "Jusqu'à 50 participants",
        "Suivi basique",
        "Support email"
      ],
      limitations: [
        "Pas de vidéo en direct",
        "Pas d'export des données"
      ]
    },
    {
      name: "Pro",
      price: "29€",
      period: "",
      description: "Pour les organisateurs réguliers",
      popular: true,
      features: [
        "Courses illimitées",
        "Jusqu'à 500 participants",
        "Suivi vidéo intelligent",
        "Classements en temps réel",
        "Export des données",
        "Support prioritaire",
        "Statistiques avancées"
      ],
      limitations: []
    },
    {
      name: "Élite",
      price: "99€",
      period: "",
      description: "Pour les grands événements",
      popular: false,
      features: [
        "Tout du plan Pro",
        "Participants illimités",
        "API complète",
        "Branding personnalisé",
        "Support téléphonique",
        "Formation dédiée",
        "Gestionnaire de compte"
      ],
      limitations: []
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 page-content">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title mb-4">Tarifs par course</h1>
          <p className="section-subtitle mx-auto">
            Tarification simple et transparente pour vos événements sportifs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-spixer-orange' : ''} hover-lift`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-spixer-orange text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Populaire
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-spixer-orange">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <li key={limitationIndex} className="flex items-center text-gray-500">
                      <span className="w-5 h-5 mr-3 flex-shrink-0 text-center">×</span>
                      <span className="text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-spixer-orange hover:bg-spixer-orange-dark' 
                      : 'bg-spixer-blue hover:bg-spixer-blue-dark'
                  }`}
                >
                  {plan.price === "0€" ? "Commencer gratuitement" : "Choisir ce plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ/Features Comparison */}
        <div className="bg-white rounded-2xl shadow-elegant p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Comparatif des fonctionnalités</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Fonctionnalité</th>
                  <th className="text-center py-3 px-4">Gratuit</th>
                  <th className="text-center py-3 px-4">Pro</th>
                  <th className="text-center py-3 px-4">Élite</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-3 px-4">Nombre de courses</td>
                  <td className="text-center py-3 px-4">1/mois</td>
                  <td className="text-center py-3 px-4">Illimité</td>
                  <td className="text-center py-3 px-4">Illimité</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Participants max</td>
                  <td className="text-center py-3 px-4">50</td>
                  <td className="text-center py-3 px-4">500</td>
                  <td className="text-center py-3 px-4">Illimité</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Suivi vidéo intelligent</td>
                  <td className="text-center py-3 px-4">×</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">API complète</td>
                  <td className="text-center py-3 px-4">×</td>
                  <td className="text-center py-3 px-4">×</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Support</td>
                  <td className="text-center py-3 px-4">Email</td>
                  <td className="text-center py-3 px-4">Prioritaire</td>
                  <td className="text-center py-3 px-4">Téléphone</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Legal Info */}
        <div className="text-center mt-12 text-sm text-gray-600">
          <p>
            Tous les prix sont hors taxes.
            <br />
            <a href="#" className="text-spixer-orange hover:underline">Conditions générales</a> • 
            <a href="#" className="text-spixer-orange hover:underline ml-1">Politique de confidentialité</a>
          </p>
        </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;