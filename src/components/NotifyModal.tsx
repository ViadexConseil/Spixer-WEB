import React, { useState } from "react";
import { X, Mail, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotifyModal = ({ isOpen, onClose }: NotifyModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Email invalide",
        description: "Veuillez saisir une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulation d'un appel API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Inscription réussie !",
        description: "Vous serez notifié dès que l'application sera disponible.",
      });
      
      // Reset après 2 secondes et fermer la modal
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
        onClose();
      }, 2000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {!isSubmitted ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-spixer-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-spixer-blue" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Soyez notifié du lancement
              </h3>
              <p className="text-gray-600">
                Entrez votre email pour être averti dès que Spixer sera disponible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spixer-blue focus:border-transparent outline-none transition-all"
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full bg-spixer-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-spixer-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Inscription..." : "Me notifier"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              C'est noté !
            </h3>
            <p className="text-gray-600">
              Vous serez notifié dès que l'application sera disponible.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotifyModal;