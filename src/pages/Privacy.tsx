import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, UserCheck, Database, Globe, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";

const Privacy = () => {
  const privacyPolicies = [
    {
      icon: Database,
      title: "Collecte des données",
      description: "Nous collectons uniquement les données nécessaires au fonctionnement de nos services.",
      details: [
        "Informations de profil (nom, email, préférences)",
        "Données de performance sportive",
        "Informations de géolocalisation pour les événements",
        "Données d'utilisation anonymisées"
      ]
    },
    {
      icon: Lock,
      title: "Protection des données",
      description: "Vos données sont sécurisées avec les meilleures pratiques de l'industrie.",
      details: [
        "Chiffrement SSL/TLS pour toutes les communications",
        "Stockage sécurisé avec chiffrement au repos",
        "Accès limité aux données par notre équipe",
        "Audits de sécurité réguliers"
      ]
    },
    {
      icon: UserCheck,
      title: "Vos droits",
      description: "Vous avez un contrôle total sur vos données personnelles.",
      details: [
        "Droit d'accès à vos données",
        "Droit de rectification",
        "Droit à l'effacement",
        "Droit à la portabilité des données"
      ]
    },
    {
      icon: Eye,
      title: "Transparence",
      description: "Nous sommes transparents sur l'utilisation de vos données.",
      details: [
        "Politique de confidentialité claire",
        "Notifications en cas de changement",
        "Rapport de transparence annuel",
        "Contact direct avec notre équipe"
      ]
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "privacy@spixer.fr",
      description: "Pour toute question sur la confidentialité"
    },
    {
      icon: Globe,
      title: "Adresse",
      value: "Paris, France",
      description: "Siège social"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 page-content">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-spixer-blue to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Confidentialité & Sécurité
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-spixer-blue to-spixer-orange bg-clip-text text-transparent mb-6">
              Votre confidentialité d'abord
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Chez Spixer, nous prenons la protection de vos données personnelles très au sérieux. 
              Découvrez comment nous protégeons votre vie privée.
            </p>
          </div>

          {/* Privacy Policies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {privacyPolicies.map((policy, index) => {
              const Icon = policy.icon;
              return (
                <Card key={index} className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-spixer-blue to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{policy.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">{policy.description}</p>
                    <ul className="space-y-3">
                      {policy.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-spixer-orange rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* RGPD Section */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 mb-16">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Conformité RGPD</h2>
                  <p className="text-gray-700 mb-6">
                    Spixer est entièrement conforme au Règlement Général sur la Protection des Données (RGPD) 
                    de l'Union Européenne. Nous respectons tous vos droits en matière de protection des données.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">Consentement explicite</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">Minimisation des données</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">Sécurité renforcée</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <img 
                    src="/lovable-uploads/62c5c1e4-dbde-497d-886c-fee818178bf0.png" 
                    alt="RGPD Compliance" 
                    className="w-full max-w-sm mx-auto rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-spixer-blue to-blue-600 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Contactez notre équipe confidentialité</h3>
                <div className="space-y-6">
                  {contactInfo.map((contact, index) => {
                    const Icon = contact.icon;
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{contact.title}</h4>
                          <p className="text-blue-100 font-medium">{contact.value}</p>
                          <p className="text-blue-200 text-sm">{contact.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Questions fréquentes</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Comment supprimer mes données ?</h4>
                    <p className="text-gray-600 text-sm">
                      Vous pouvez demander la suppression de vos données depuis votre profil ou en nous contactant.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Où sont stockées mes données ?</h4>
                    <p className="text-gray-600 text-sm">
                      Vos données sont stockées sur des serveurs sécurisés en Europe, conformément au RGPD.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Partagez-vous mes données ?</h4>
                    <p className="text-gray-600 text-sm">
                      Nous ne partageons jamais vos données personnelles avec des tiers sans votre consentement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last Updated */}
          <div className="text-center mt-16 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Dernière mise à jour : 28 août 2025
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;