import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Calendar, Users, Trophy, User, Settings, LogOut, Menu, X, Bell, Search, Plus, Shield, BarChart3, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    logout,
    hasRole
  } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !"
    });
  };
  const navigationItems = [{
    label: "Accueil",
    href: "/",
    icon: Home,
    active: location.pathname === "/"
  }, {
    label: "Événements",
    href: "/events",
    icon: Calendar,
    active: location.pathname.startsWith("/events"),
    badge: "12"
  }, {
    label: "Clubs",
    href: "/clubs",
    icon: Users,
    active: location.pathname.startsWith("/clubs")
  }];
  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/ea09aba0-54c8-4977-ac16-dc239a0a7184.png" alt="Spixer" className="h-8 w-auto" />
        </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
          {navigationItems.map(item => <Link key={item.href} to={item.href} className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors", item.active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge && <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {item.badge}
                </Badge>}
            </Link>)}
        </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-auto">
          {/* Search */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          {user && <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
              3
            </Badge>
          </Button>}

          {/* Create Event */}
          {user && <Button size="sm" asChild>
              <Link to="/create-event">
                <Plus className="h-4 w-4 mr-1" />
                Créer
              </Link>
            </Button>}

          {/* User Menu */}
          {user ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username || user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                {hasRole('admin') && <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Administration</span>
                  </DropdownMenuItem>}
                {hasRole('organizer') && <DropdownMenuItem onClick={() => navigate('/organizer')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Organisateur</span>
                  </DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Connexion</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/login">S'inscrire</Link>
              </Button>
            </div>}

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && <div className="md:hidden border-t bg-background">
          <nav className="container px-4 py-4 space-y-2">
            {navigationItems.map(item => <Link key={item.href} to={item.href} onClick={() => setIsMenuOpen(false)} className={cn("flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors", item.active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.badge && <Badge variant="secondary" className="ml-auto px-1.5 py-0.5 text-xs">
                    {item.badge}
                  </Badge>}
              </Link>)}
            
            {user && <div className="pt-4 border-t space-y-2">
                <div className="px-3 py-2 text-sm text-muted-foreground border-b">
                  Mes tableaux de bord
                </div>
                {hasRole('admin') && <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Shield className="h-4 w-4 mr-2" />
                      Administration
                    </Link>
                  </Button>}
                {hasRole('organizer') && <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/organizer" onClick={() => setIsMenuOpen(false)}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Organisateur
                    </Link>
                  </Button>}
              </div>}
            
            {!user && <div className="pt-4 border-t space-y-2">
                <Button className="w-full" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Se connecter
                  </Link>
                </Button>
              </div>}
          </nav>
        </div>}
    </header>;
};
export default Navigation;