
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
        "fixed top-0 left-0 right-0 z-50 py-2 sm:py-3 md:py-4 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-spixer-blue/10" 
          : "bg-white/90 backdrop-blur-sm shadow-sm"
      )}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <a 
          href="#" 
          className="flex items-center space-x-2"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          aria-label="Spixer"
        >
          <img 
            src="/lovable-uploads/ea09aba0-54c8-4977-ac16-dc239a0a7184.png" 
            alt="Spixer Logo" 
            className="h-16 sm:h-20 lg:h-24" 
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
        <Link 
          to="/" 
          className="nav-link"
        >
          Accueil
        </Link>
          <Link to="/courses" className="nav-link hover:text-spixer-blue transition-colors">Courses</Link>
          <Link to="/contact" className="nav-link hover:text-spixer-blue transition-colors">Contact</Link>
          
          {!user ? (
            <>
              <Link to="/login" className="bg-spixer-blue hover:bg-spixer-blue-dark text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Se connecter
              </Link>
              <Link to="/login" className="border border-spixer-blue text-spixer-blue hover:bg-spixer-blue hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Créer un compte
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Mon compte</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Gérer vos paramètres
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profil')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                {hasRole('admin') && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                {hasRole('organizer') && (
                  <DropdownMenuItem onClick={() => navigate('/organizer')}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Organizer Dashboard</span>
                  </DropdownMenuItem>
                )}
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

        {/* Mobile menu button - increased touch target */}
        <button 
          className="md:hidden text-gray-700 p-3 focus:outline-none" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation - improved for better touch experience */}
      <div className={cn(
        "fixed inset-0 z-40 bg-white flex flex-col pt-16 px-6 md:hidden transition-all duration-300 ease-in-out",
        isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      )}>
        <nav className="flex flex-col space-y-8 items-center mt-8">
          <Link 
            to="/" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Accueil
          </Link>
          <Link 
            to="/courses" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Courses
          </Link>
          <Link 
            to="/contact" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Contact
          </Link>
          <div className="flex flex-col space-y-4 w-full mt-8">
            {!user ? (
              <>
                <button 
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                    document.body.style.overflow = '';
                  }}
                  className="bg-spixer-blue hover:bg-spixer-blue-dark text-white py-3 px-6 rounded-full font-medium transition-colors text-center"
                >
                  Se connecter
                </button>
                <button 
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                    document.body.style.overflow = '';
                  }}
                  className="border border-spixer-blue text-spixer-blue hover:bg-spixer-blue hover:text-white py-3 px-6 rounded-full font-medium transition-colors text-center"
                >
                  Créer un compte
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    navigate('/profil');
                    setIsMenuOpen(false);
                    document.body.style.overflow = '';
                  }}
                  className="border border-spixer-blue text-spixer-blue hover:bg-spixer-blue hover:text-white py-3 px-6 rounded-full font-medium transition-colors text-center"
                >
                  Mon Profil
                </button>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                    document.body.style.overflow = '';
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-full font-medium transition-colors text-center"
                >
                  Se déconnecter
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
