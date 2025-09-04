import React from "react";
import { TrendingUp, Users, Calendar, Trophy } from "lucide-react";

const StatsOverview = () => {
  const stats = [
    {
      label: "Événements actifs",
      value: "156",
      change: "+12%",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      label: "Participants inscrits",
      value: "12.5K",
      change: "+8%", 
      icon: Users,
      color: "text-green-600"
    },
    {
      label: "Clubs partenaires",
      value: "89",
      change: "+15%",
      icon: Trophy,
      color: "text-purple-600"
    },
    {
      label: "Taux de satisfaction",
      value: "98%",
      change: "+2%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-8 border-b">
      <div className="container px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted mb-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className={`text-xs ${stat.color} flex items-center justify-center gap-1`}>
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsOverview;