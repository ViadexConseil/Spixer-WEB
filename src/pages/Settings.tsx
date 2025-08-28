import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User, Shield, Bell, Palette } from "lucide-react";
import Navbar from "@/components/Navbar";
import { accountAPI, authAPI, userInformationsAPI } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Email change state
  const [emailData, setEmailData] = useState({
    newEmail: ""
  });

  // Notifications settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    resultAlerts: true
  });

  // User profile data
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    location: ""
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.user?.[0]) {
        const user = response.user[0];
        setProfileData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          bio: user.bio || "",
          location: user.location || ""
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await accountAPI.changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été modifié avec succès",
      });
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la modification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await accountAPI.requestEmailChange(emailData.newEmail);
      
      toast({
        title: "Email de vérification envoyé",
        description: "Vérifiez votre nouvelle adresse email pour confirmer le changement",
      });
      
      setEmailData({ newEmail: "" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la demande",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await userInformationsAPI.update(profileData);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la mise à jour",
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
              <p className="text-gray-600">Gérez vos préférences et paramètres de compte</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">
                  <User className="w-4 h-4 mr-2" />
                  Profil
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="w-4 h-4 mr-2" />
                  Sécurité
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="appearance">
                  <Palette className="w-4 h-4 mr-2" />
                  Apparence
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations du profil</CardTitle>
                    <CardDescription>
                      Mettez à jour vos informations personnelles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">Prénom</Label>
                          <Input
                            id="first_name"
                            value={profileData.first_name}
                            onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                            placeholder="Votre prénom"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Nom</Label>
                          <Input
                            id="last_name"
                            value={profileData.last_name}
                            onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                            placeholder="Votre nom"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Biographie</Label>
                        <Input
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          placeholder="Parlez-nous de vous..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Localisation</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          placeholder="Votre ville, pays"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-spixer-orange hover:bg-spixer-orange-dark"
                      >
                        {isLoading ? "Mise à jour..." : "Mettre à jour le profil"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <div className="space-y-6">
                  {/* Change Password */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Modifier le mot de passe</CardTitle>
                      <CardDescription>
                        Changez votre mot de passe pour sécuriser votre compte
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="currentPassword"
                              type={showPassword ? "text" : "password"}
                              className="pl-10 pr-10"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              className="pl-10 pr-10"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            required
                          />
                        </div>
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="bg-spixer-orange hover:bg-spixer-orange-dark"
                        >
                          {isLoading ? "Modification..." : "Modifier le mot de passe"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Change Email */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Modifier l'adresse email</CardTitle>
                      <CardDescription>
                        Changez votre adresse email de connexion
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleEmailChange} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newEmail">Nouvelle adresse email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="newEmail"
                              type="email"
                              className="pl-10"
                              placeholder="nouvelle@email.com"
                              value={emailData.newEmail}
                              onChange={(e) => setEmailData({ newEmail: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="bg-spixer-orange hover:bg-spixer-orange-dark"
                        >
                          {isLoading ? "Envoi..." : "Demander le changement"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences de notifications</CardTitle>
                    <CardDescription>
                      Configurez vos notifications et alertes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notifications par email</Label>
                        <p className="text-sm text-gray-600">Recevez les mises à jour par email</p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, emailNotifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notifications push</Label>
                        <p className="text-sm text-gray-600">Notifications sur votre appareil</p>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, pushNotifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Rappels d'événements</Label>
                        <p className="text-sm text-gray-600">Alertes avant vos courses</p>
                      </div>
                      <Switch
                        checked={notifications.eventReminders}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, eventReminders: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Alertes de résultats</Label>
                        <p className="text-sm text-gray-600">Notifications des classements</p>
                      </div>
                      <Switch
                        checked={notifications.resultAlerts}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, resultAlerts: checked })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences d'apparence</CardTitle>
                    <CardDescription>
                      Personnalisez l'apparence de l'interface
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base">Thème</Label>
                        <p className="text-sm text-gray-600 mb-2">Choisissez votre thème préféré</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <div className="w-full h-20 bg-white border rounded mb-2"></div>
                            <p className="text-sm font-medium">Clair</p>
                          </div>
                          <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <div className="w-full h-20 bg-gray-900 rounded mb-2"></div>
                            <p className="text-sm font-medium">Sombre</p>
                          </div>
                          <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <div className="w-full h-20 bg-gradient-to-br from-white to-gray-900 rounded mb-2"></div>
                            <p className="text-sm font-medium">Auto</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;