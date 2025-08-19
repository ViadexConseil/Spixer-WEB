import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  Clock, 
  Zap,
  ArrowRight,
  CheckCircle,
  Globe,
  Users,
  Headphones
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    contactType: "general"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        contactType: "general"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactTypes = [
    {
      id: "general",
      icon: MessageCircle,
      title: "Question générale",
      description: "Informations sur nos services",
      color: "bg-gradient-to-br from-blue-400 to-blue-600"
    },
    {
      id: "support",
      icon: Headphones,
      title: "Support technique",
      description: "Aide avec la plateforme",
      color: "bg-gradient-to-br from-green-400 to-green-600"
    },
    {
      id: "partnership",
      icon: Users,
      title: "Partenariat",
      description: "Collaboration commerciale",
      color: "bg-gradient-to-br from-purple-400 to-purple-600"
    },
    {
      id: "media",
      icon: Globe,
      title: "Presse & Média",
      description: "Relations presse",
      color: "bg-gradient-to-br from-orange-400 to-orange-600"
    }
  ];

  const quickInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      value: "+33 1 23 45 67 89",
      subtext: "Lun-Ven, 9h-18h"
    },
    {
      icon: Mail,
      title: "Email",
      value: "contact@spixer.fr",
      subtext: "Réponse sous 24h"
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "Paris, France",
      subtext: "Rendez-vous sur demande"
    },
    {
      icon: Clock,
      title: "Disponibilité",
      value: "24/7 en ligne",
      subtext: "Support continu"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 page-content">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-spixer-orange to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Contactez-nous
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-spixer-blue to-spixer-orange bg-clip-text text-transparent mb-6">
              Parlons de votre projet
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Une question, une idée, un projet ? Notre équipe est là pour vous accompagner 
              dans votre aventure sportive.
            </p>
          </div>

          {/* Contact Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card 
                  key={type.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 ${
                    formData.contactType === type.id ? 'ring-2 ring-spixer-orange shadow-lg' : ''
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, contactType: type.id }))}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{type.title}</h3>
                    <p className="text-gray-600 text-sm">{type.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-4">Envoyez-nous un message</h2>
                    <p className="text-gray-600">
                      Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base font-medium">
                          Nom complet *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Votre nom"
                          required
                          className="h-12 border-2 border-gray-200 focus:border-spixer-orange transition-colors"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-medium">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="votre@email.com"
                          required
                          className="h-12 border-2 border-gray-200 focus:border-spixer-orange transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-base font-medium">
                        Sujet *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Sujet de votre message"
                        required
                        className="h-12 border-2 border-gray-200 focus:border-spixer-orange transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-base font-medium">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Décrivez votre demande en détail..."
                        required
                        rows={6}
                        className="border-2 border-gray-200 focus:border-spixer-orange transition-colors resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 bg-gradient-to-r from-spixer-orange to-orange-500 hover:from-orange-500 hover:to-spixer-orange text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-3" />
                          Envoyer le message
                          <ArrowRight className="w-5 h-5 ml-3" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Quick Info & Features */}
            <div className="order-1 lg:order-2 space-y-8">
              {/* Quick Contact Info */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-spixer-blue to-blue-600 text-white overflow-hidden">
                <CardContent className="p-8 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <h3 className="text-2xl font-bold mb-6 relative z-10">Informations de contact</h3>
                  <div className="space-y-6 relative z-10">
                    {quickInfo.map((info, index) => {
                      const Icon = info.icon;
                      return (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{info.title}</h4>
                            <p className="text-blue-100 font-medium">{info.value}</p>
                            <p className="text-blue-200 text-sm">{info.subtext}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Pourquoi nous choisir ?</h3>
                  <div className="space-y-4">
                    {[
                      "Réponse garantie sous 24h",
                      "Équipe d'experts dédiée",
                      "Support technique premium",
                      "Accompagnement personnalisé"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Quick Access */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-yellow-50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Questions fréquentes</h3>
                  <p className="text-gray-600 mb-6">
                    Consultez notre FAQ pour obtenir des réponses immédiates aux questions les plus courantes.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-spixer-orange text-spixer-orange hover:bg-spixer-orange hover:text-white transition-all duration-300"
                  >
                    Voir la FAQ
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;