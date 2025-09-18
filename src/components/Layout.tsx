import { useState, useEffect } from "react";
import { Header } from "./Header";
import { StickyFooter } from "./StickyFooter";
import { PincodeModal } from "./PincodeModal";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [showPincodeModal, setShowPincodeModal] = useState(false);

  useEffect(() => {
    // Check if user has already set pincode
    const savedPincode = localStorage.getItem("ecfresh_pincode");
    if (!savedPincode) {
      setShowPincodeModal(true);
    }
  }, []);

  const handlePincodeSet = () => {
    setShowPincodeModal(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pb-20">
        {children}
      </main>
      <StickyFooter />
      
      <PincodeModal 
        isOpen={showPincodeModal} 
        onClose={handlePincodeSet}
      />
    </div>
  );
};