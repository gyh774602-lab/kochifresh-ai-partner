import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, Heart, User, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: ShoppingCart, label: "Cart", path: "/cart" },
  { icon: Heart, label: "Wishlist", path: "/wishlist" },
  { icon: User, label: "Account", path: "/account" },
  { icon: MoreHorizontal, label: "More", path: "/more" },
];

export const StickyFooter = () => {
  const location = useLocation();
  const { cart } = useCart();
  
  const cartItemCount = cart.items.reduce((sum, item) => sum + (item.isSelected ? item.quantity : 0), 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden z-40">
      <div className="flex items-center justify-around py-2">
        {menuItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "text-ec-green bg-ec-green/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {label === "Cart" && cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-ec-orange"
                  >
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};