import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  HelpCircle, 
  Zap,
  Users,
  CreditCard,
  Settings,
  Shield,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  Star
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const categories = [
    { id: "all", name: "Toutes", icon: HelpCircle, count: 0 },
    { id: "account", name: "Compte", icon: Users, count: 5 },
    { id: "payment", name: "Paiement", icon: CreditCard, count: 4 },
    { id: "events", name: "Événements", icon: Zap, count: 6 },
    { id: "technical", name: "Technique", icon: Settings, count: 3 },
    { id: "security", name: "Sécurité", icon: Shield, count: 2 }
  ];

  const faqData = [
    // Account
    {
      category: "account",
      question: "Comment créer un compte sur Spixer ?",
      answer: "Pour créer un compte, cliquez sur 'Créer un compte' dans la barre de navigation. Remplissez le formulaire avec vos informations personnelles et suivez les instructions de validation par email. C'est simple et rapide !",
      popular: true
    },
    {
      category: "account",
      question: "Comment modifier mes informations personnelles ?",
      answer: "Rendez-vous dans votre profil en cliquant sur votre avatar, puis sélectionnez 'Mon profil'. Vous pourrez modifier toutes vos informations personnelles et les sauvegarder."
    },
    {
      category: "account",
      question: "J'ai oublié mon mot de passe, que faire ?",
      answer: "Sur la page de connexion, cliquez sur 'Mot de passe oublié'. Saisissez votre email et vous recevrez un lien pour réinitialiser votre mot de passe."
    },
    {
      category: "account",
      question: "Puis-je supprimer mon compte ?",
      answer: "Oui, vous pouvez supprimer votre compte depuis les paramètres de votre profil. Attention, cette action est irréversible et toutes vos données seront perdues."
    },
    {
      category: "account",
      question: "Comment changer mon adresse email ?",
      answer: "Dans votre profil, section 'Informations personnelles', vous pouvez modifier votre adresse email. Une confirmation sera envoyée à votre nouvelle adresse."
    },

    // Payment
    {
      category: "payment",
      question: "Quels moyens de paiement acceptez-vous ?",
      answer: "Nous acceptons toutes les cartes bancaires (Visa, MasterCard, American Express) via notre plateforme sécurisée Stripe. Tous les paiements sont cryptés et sécurisés.",
      popular: true
    },
    {
      category: "payment",
      question: "Quel est le montant de la commission Spixer ?",
      answer: "Notre commission est de 2€ par inscription, en plus du prix de l'événement. Cette commission nous permet de maintenir et améliorer notre plateforme."
    },
    {
      category: "payment",
      question: "Puis-je obtenir un remboursement ?",
      answer: "Les remboursements dépendent des conditions de l'organisateur de l'événement. Consultez les conditions spécifiques de chaque course lors de votre inscription."
    },
    {
      category: "payment",
      question: "Ma carte a été refusée, pourquoi ?",
      answer: "Vérifiez les informations de votre carte (numéro, date d'expiration, CVV) et que vous avez suffisamment de fonds. Si le problème persiste, contactez votre banque."
    },

    // Events
    {
      category: "events",
      question: "Comment m'inscrire à une course ?",
      answer: "Trouvez la course qui vous intéresse, cliquez sur 'Participer', remplissez le formulaire d'inscription et procédez au paiement. Vous recevrez une confirmation par email.",
      popular: true
    },
    {
      category: "events",
      question: "Comment créer mon propre événement ?",
      answer: "Cliquez sur 'Créer une course' dans votre profil. Suivez l'assistant de création en 4 étapes : détails de l'événement, zones logistiques, épreuves et publication."
    },
    {
      category: "events",
      question: "Puis-je modifier mon inscription après paiement ?",
      answer: "Les modifications dépendent des conditions de l'organisateur. Contactez directement l'organisateur ou notre support pour les demandes de modification."
    },
    {
      category: "events",
      question: "Comment suivre mes résultats en temps réel ?",
      answer: "Pendant la course, rendez-vous sur la page de l'événement, onglet 'Classement' pour suivre votre progression et celle des autres participants en temps réel."
    },
    {
      category: "events",
      question: "Que faire si je ne peux plus participer ?",
      answer: "Contactez l'organisateur de l'événement le plus tôt possible. Les conditions d'annulation varient selon chaque organisateur."
    },
    {
      category: "events",
      question: "Comment obtenir mon certificat de participation ?",
      answer: "Après la course, votre certificat sera disponible dans votre profil, section 'Mes participations'. Vous pourrez le télécharger au format PDF."
    },

    // Technical
    {
      category: "technical",
      question: "L'application ne fonctionne pas, que faire ?",
      answer: "Essayez de rafraîchir la page ou de vider le cache de votre navigateur. Si le problème persiste, contactez notre support technique."
    },
    {
      category: "technical",
      question: "Sur quels navigateurs fonctionne Spixer ?",
      answer: "Spixer fonctionne sur tous les navigateurs modernes : Chrome, Firefox, Safari, Edge. Nous recommandons d'utiliser la dernière version pour une expérience optimale."
    },
    {
      category: "technical",
      question: "Y a-t-il une application mobile ?",
      answer: "Actuellement, Spixer est une application web responsive qui fonctionne parfaitement sur mobile. Une application native est en développement."
    },

    // Security
    {
      category: "security",
      question: "Mes données personnelles sont-elles sécurisées ?",
      answer: "Oui, nous utilisons les dernières technologies de cryptage et respectons le RGPD. Vos données ne sont jamais partagées avec des tiers sans votre consentement.",
      popular: true
    },
    {
      category: "security",
      question: "Comment signaler un problème de sécurité ?",
      answer: "Contactez immédiatement notre équipe sécurité à security@spixer.fr. Nous prenons tous les signalements très au sérieux."
    }
  ];

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Update category counts
  const updatedCategories = categories.map(cat => ({
    ...cat,
    count: cat.id === "all" ? faqData.length : faqData.filter(faq => faq.category === cat.id).length
  }));

  const popularFAQs = faqData.filter(faq => faq.popular);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 page-content">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-spixer-orange to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              Questions fréquentes
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-spixer-blue to-spixer-orange bg-clip-text text-transparent mb-6">
              Centre d'aide
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Trouvez rapidement les réponses à vos questions les plus fréquentes
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher dans la FAQ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-spixer-orange rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Popular Questions */}
          {!searchTerm && selectedCategory === "all" && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-500" />
                Questions populaires
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularFAQs.map((faq, index) => (
                  <Card key={`popular-${index}`} className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">Populaire</Badge>
                      </div>
                      <h3 className="font-semibold text-lg mt-3 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-xl sticky top-6">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-6">Catégories</h3>
                  <div className="space-y-2">
                    {updatedCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                            selectedCategory === category.id
                              ? 'bg-gradient-to-r from-spixer-orange to-orange-500 text-white shadow-lg'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={`${
                              selectedCategory === category.id 
                                ? 'bg-white/20 text-white border-white/30' 
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {category.count}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredFAQs.length === 0 ? (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-12 text-center">
                      <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Aucun résultat trouvé
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Essayez de modifier vos critères de recherche ou parcourez les catégories.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("all");
                        }}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  filteredFAQs.map((faq, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleItem(index)}
                          className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            {faq.popular && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs mt-1">
                                Populaire
                              </Badge>
                            )}
                            <h3 className="font-semibold text-lg text-gray-900 flex-1">
                              {faq.question}
                            </h3>
                          </div>
                          <div className="ml-4">
                            {openItems.includes(index) ? (
                              <ChevronUp className="w-5 h-5 text-spixer-orange" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </button>
                        
                        {openItems.includes(index) && (
                          <div className="px-6 pb-6 animate-fade-in">
                            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-spixer-orange">
                              <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16">
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-spixer-blue to-blue-600 text-white overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h2>
                  <p className="text-blue-100 mb-8 text-lg">
                    Notre équipe support est là pour vous aider. Contactez-nous et nous vous répondrons rapidement.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      asChild
                      size="lg" 
                      className="bg-white text-spixer-blue hover:bg-gray-100 shadow-lg"
                    >
                      <Link to="/contact" className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Nous contacter
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-white/80 text-white bg-white/10 hover:bg-white hover:text-spixer-blue backdrop-blur-sm"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      support@spixer.fr
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;