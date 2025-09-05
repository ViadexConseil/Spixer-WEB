
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, User, Settings, Shield, LogOut, UserCircle, BarChart3, Users } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent background scrolling when menu is open
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-2 sm:py-3 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-primary/10" 
          : "bg-white/90 backdrop-blur-sm shadow-sm"
      )}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6">
        <a 
          href="#" 
          className="flex items-center space-x-2 flex-shrink-0"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          aria-label="Spixer"
        >
          <img 
            src="/lovable-uploads/ea09aba0-54c8-4977-ac16-dc239a0a7184.png" 
            alt="Spixer Logo" 
            className="h-12 sm:h-14 md:h-16" 
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <Link 
            to="/" 
            className="nav-link text-sm xl:text-base"
          >
            Accueil
          </Link>
          <Link to="/events" className="nav-link text-sm xl:text-base">Événements</Link>
          <Link to="/clubs" className="nav-link text-sm xl:text-base">Clubs</Link>
          <Link to="/contact" className="nav-link text-sm xl:text-base">Contact</Link>
          
          {!user ? (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Se connecter
              </Link>
              <Link to="/login" className="border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                S'inscrire
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border shadow-lg" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Mon compte</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Gérer vos paramètres
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                {hasRole('admin') && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Administration</span>
                  </DropdownMenuItem>
                )}
                {hasRole('organizer') && (
                  <DropdownMenuItem onClick={() => navigate('/organizer')}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Organisateur</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/privacy')}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Confidentialité</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile menu button */}
        <button 
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={cn(
        "fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-in-out",
        isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={toggleMenu}
        />
        
        {/* Menu Panel */}
        <div className={cn(
          "absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transition-transform duration-300 ease-in-out flex flex-col",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <img 
              src="/lovable-uploads/ea09aba0-54c8-4977-ac16-dc239a0a7184.png" 
              alt="Spixer Logo" 
              className="h-8" 
            />
            <button 
              onClick={toggleMenu}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {[
                { label: "Accueil", to: "/" },
                { label: "Événements", to: "/events" },
                { label: "Clubs", to: "/clubs" },
                { label: "Contact", to: "/contact" }
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setIsMenuOpen(false);
                    document.body.style.overflow = '';
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile User Section */}
            <div className="p-4 border-t">
              {!user ? (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                      document.body.style.overflow = '';
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                      document.body.style.overflow = '';
                    }}
                    className="w-full border border-primary text-primary hover:bg-primary hover:text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    S'inscrire
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm text-gray-600 border-b">
                    Mon compte
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsMenuOpen(false);
                      document.body.style.overflow = '';
                    }}
                    className="w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profil
                  </button>

                  {hasRole('admin') && (
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setIsMenuOpen(false);
                        document.body.style.overflow = '';
                      }}
                      className="w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <BarChart3 className="mr-3 h-4 w-4" />
                      Administration
                    </button>
                  )}

                  {hasRole('organizer') && (
                    <button
                      onClick={() => {
                        navigate('/organizer');
                        setIsMenuOpen(false);
                        document.body.style.overflow = '';
                      }}
                      className="w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Users className="mr-3 h-4 w-4" />
                      Organisateur
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigate('/settings');
                      setIsMenuOpen(false);
                      document.body.style.overflow = '';
                    }}
                    className="w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Paramètres
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                      document.body.style.overflow = '';
                    }}
                    className="w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
