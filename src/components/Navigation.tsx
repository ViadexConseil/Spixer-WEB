import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Calendar, 
  Users, 
  Trophy, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  const navigationItems = [
    {
      label: "Accueil",
      href: "/",
      icon: Home,
      active: location.pathname === "/"
    },
    {
      label: "Événements",
      href: "/events", 
      icon: Calendar,
      active: location.pathname.startsWith("/events"),
      badge: "12"
    },
    {
      label: "Clubs",
      href: "/clubs",
      icon: Users,
      active: location.pathname.startsWith("/clubs")
    },
    {
      label: "Résultats",
      href: "/results",
      icon: Trophy,
      active: location.pathname.startsWith("/results")
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/ea09aba0-54c8-4977-ac16-dc239a0a7184.png" 
            alt="Spixer" 
            className="h-8 w-auto" 
          />
        </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                item.active 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-auto">
          {/* Search */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          {user && (
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                3
              </Badge>
            </Button>
          )}

          {/* Create Event */}
          {user && (
            <Button size="sm" asChild>
              <Link to="/create-event">
                <Plus className="h-4 w-4 mr-1" />
                Créer
              </Link>
            </Button>
          )}

          {/* User Menu */}
          {user ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Connexion</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/login">S'inscrire</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  item.active 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto px-1.5 py-0.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
            
            {!user && (
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Se connecter
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;