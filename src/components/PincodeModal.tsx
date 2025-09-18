import { useState } from "react";
import { MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { KOCHI_PINCODES } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

interface PincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PincodeModal = ({ isOpen, onClose }: PincodeModalProps) => {
  const [inputPincode, setInputPincode] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");

  const handlePincodeSubmit = () => {
    const pincode = selectedPincode || inputPincode.trim();
    
    if (!pincode) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid pincode",
        variant: "destructive",
      });
      return;
    }

    // Check if pincode is in Kochi list
    const validPincode = KOCHI_PINCODES.find(p => p.code === pincode && p.isActive);
    
    if (!validPincode) {
      toast({
        title: "Service Not Available",
        description: "Sorry, we don't deliver to this pincode yet. We currently serve Kochi areas only.",
        variant: "destructive",
      });
      return;
    }

    // Save pincode to localStorage
    localStorage.setItem("ecfresh_pincode", pincode);
    localStorage.setItem("ecfresh_area", validPincode.area);
    
    toast({
      title: "Pincode Set Successfully! 🎉",
      description: `We deliver to ${validPincode.area}. Start shopping now!`,
    });
    
    onClose();
  };

  const popularAreas = KOCHI_PINCODES.slice(0, 8); // Show first 8 areas

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg" onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-primary text-primary-foreground p-3 rounded-full">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            Choose Your Location
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            We deliver fresh vegetables across Kochi. Select your pincode to continue.
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Manual Pincode Entry */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Enter your pincode</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g., 682001"
                value={inputPincode}
                onChange={(e) => setInputPincode(e.target.value)}
                maxLength={6}
                className="flex-1"
              />
              <Button 
                onClick={handlePincodeSubmit}
                className="bg-ec-green hover:bg-ec-green-dark"
                disabled={!inputPincode.trim() && !selectedPincode}
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or choose from popular areas
              </span>
            </div>
          </div>

          {/* Popular Areas */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Popular areas in Kochi</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {popularAreas.map((pincode) => (
                <Button
                  key={pincode.id}
                  variant={selectedPincode === pincode.code ? "default" : "outline"}
                  size="sm"
                  className={`justify-start text-left h-auto py-3 px-3 ${
                    selectedPincode === pincode.code 
                      ? "bg-ec-green hover:bg-ec-green-dark" 
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => setSelectedPincode(pincode.code)}
                >
                  <div className="text-xs">
                    <div className="font-medium">{pincode.area}</div>
                    <div className="text-muted-foreground">{pincode.code}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handlePincodeSubmit}
              className="flex-1 bg-gradient-primary hover:bg-ec-green-dark"
              disabled={!inputPincode.trim() && !selectedPincode}
            >
              Start Shopping
            </Button>
          </div>

          {/* Service Info */}
          <div className="bg-secondary/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="text-green-600">✓</span>
              Free delivery above ₹300
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="text-green-600">✓</span>
              Fresh vegetables delivered daily
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};