import React from "react";
import { TrendingUp, Users, Calendar, Trophy } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";

const StatsOverview = () => {
  const { events } = useEvents();

  // Only show real data from the API
  const stats = [
    {
      label: "Événements disponibles",
      value: events.length.toString(),
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      label: "Organisateurs actifs",
      value: new Set(events.map(e => e.organiser_email)).size.toString(),
      icon: Users,
      color: "text-green-600"
    },
    {
      label: "Clubs partenaires",
      value: new Set(events.filter(e => e.club_id).map(e => e.club_id)).size.toString(),
      icon: Trophy,
      color: "text-purple-600"
    },
    {
      label: "Événements récents",
      value: events.filter(e => {
        const eventDate = new Date(e.start_time);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return eventDate >= thirtyDaysAgo;
      }).length.toString(),
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsOverview;