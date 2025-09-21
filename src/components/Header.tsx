import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, User, ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const savedPincode = localStorage.getItem("ecfresh_pincode");
  const cartItemCount = cart.items.reduce((sum, item) => sum + (item.isSelected ? item.quantity : 0), 0);

  const handleAuthAction = async () => {
    if (user) {
      const { error } = await signOut();
      if (error) {
        toast.error('Failed to sign out');
      } else {
        toast.success('Signed out successfully');
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="hidden md:block">🚚 Free delivery above ₹300</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{savedPincode ? `Delivering to ${savedPincode}` : 'Select Pincode'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-primary text-primary-foreground p-2 rounded-lg font-bold">
              EC
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-ec-green">ECFresh</h1>
              <p className="text-xs text-muted-foreground">Ready-to-cook vegetables</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for vegetables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 focus:ring-2 focus:ring-ec-green/20"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleAuthAction}>
                {user ? <LogOut className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                <span className="text-sm">{user ? 'Sign Out' : 'Sign In'}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="relative" asChild>
                <Link to="/cart" className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm">Cart</span>
                  {cartItemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-ec-orange"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for vegetables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={handleAuthAction}>
              {user ? <LogOut className="w-4 h-4 mr-3" /> : <User className="w-4 h-4 mr-3" />}
              {user ? 'Sign Out' : 'Sign In'}
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                <ShoppingCart className="w-4 h-4 mr-3" />
                Cart ({cartItemCount})
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};