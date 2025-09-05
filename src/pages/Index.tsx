
import React from "react";
import Navigation from "@/components/Navigation";
import QuickActions from "@/components/QuickActions";
import StatsOverview from "@/components/StatsOverview";
import RecentActivity from "@/components/RecentActivity";
import NosServices from "@/components/NosServices";
import Footer from "@/components/Footer";
import { ApiStatus } from "@/components/ApiStatus";
import { useApiHealth } from "@/hooks/useApiHealth";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isHealthy, status } = useApiHealth();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* API Status Indicator - Only show if unhealthy */}
      {!isHealthy && status !== 'checking' && (
        <div className="fixed top-20 right-4 z-50">
          <ApiStatus showDetails />
        </div>
      )}

      <main>
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-24 border-b overflow-hidden">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm border bg-muted/50">
                🚀 Nouvelle version disponible - Découvrez les nouveautés
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Chronométrage sportif 
                <br className="hidden sm:inline" />
                <span className="text-primary"> intelligent</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                La première plateforme de chronométrage avec reconnaissance automatique 
                et suivi temps réel alimenté par l'IA
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 px-4 sm:px-0">
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8 py-3 rounded-lg font-medium text-sm sm:text-base transition-colors">
                  Commencer gratuitement
                </button>
                <button className="border text-foreground hover:bg-muted px-6 sm:px-8 py-3 rounded-lg font-medium text-sm sm:text-base transition-colors">
                  Voir une démonstration
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Quick Actions - Show different content based on auth */}
        <QuickActions />

        {/* Recent Activity */}
        <RecentActivity />

        {/* Services Section */}
        <NosServices />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
