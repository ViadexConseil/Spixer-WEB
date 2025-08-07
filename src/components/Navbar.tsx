
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Navbar = () => {
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
          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
          >
            Accueil
          </a>
          <a href="/courses" className="nav-link hover:text-spixer-blue transition-colors">Courses</a>
          <a href="#services" className="nav-link hover:text-spixer-blue transition-colors">À Propos</a>
          <a href="#partenaires" className="nav-link hover:text-spixer-blue transition-colors">Contact</a>
          <a href="/login" className="bg-spixer-blue hover:bg-spixer-blue-dark text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
            Se connecter
          </a>
          <a href="/login" className="border border-spixer-blue text-spixer-blue hover:bg-spixer-blue hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
            Créer un compte
          </a>
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
          <a 
            href="#" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Accueil
          </a>
          <a 
            href="/courses" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Courses
          </a>
          <a 
            href="#services" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            À Propos
          </a>
          <a 
            href="#partenaires" 
            className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Contact
          </a>
          <div className="flex flex-col space-y-4 w-full mt-8">
            <a href="/login" className="bg-spixer-blue hover:bg-spixer-blue-dark text-white py-3 px-6 rounded-full font-medium transition-colors text-center">
              Se connecter
            </a>
            <a href="/login" className="border border-spixer-blue text-spixer-blue hover:bg-spixer-blue hover:text-white py-3 px-6 rounded-full font-medium transition-colors text-center">
              Créer un compte
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
