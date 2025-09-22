import React from "react";
import { TrendingUp, Users, Calendar, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { eventsAPI, Event } from "@/services/api";

const StatsOverview = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await eventsAPI.list();
        setEvents(fetchedEvents);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchEvents();
  }, []);

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
    <section className="py-6 sm:py-8 border-b">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted mb-2 sm:mb-3`}>
                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
              </div>
              
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground px-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsOverview;