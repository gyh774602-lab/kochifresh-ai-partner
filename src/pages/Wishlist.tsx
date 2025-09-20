import { Link } from "react-router-dom";
import { Heart, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { PRODUCTS } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlistedProducts = PRODUCTS.filter(product => 
    isInWishlist(product.id)
  );

  const handleAddToCart = (product: any) => {
    const defaultVariant = product.variants.find((v: any) => v.isDefault) || product.variants[0];
    if (!defaultVariant.isInStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, defaultVariant, 1);
    toast({
      title: "Added to Cart! 🛒",
      description: `${product.name} added to your cart`,
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from Wishlist",
      description: "Product removed from your wishlist",
    });
  };

  if (wishlistedProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-[60vh] flex flex-col justify-center">
        <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-6">
          Start adding your favorite vegetables!
        </p>
        <Link to="/">
          <Button size="lg" className="bg-ec-green hover:bg-ec-green-dark">
            Shop Now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Wishlist ({wishlistedProducts.length})</h1>
        </div>

        {/* Wishlist Items */}
        <div className="grid gap-4">
          {wishlistedProducts.map((product) => {
            const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
            const discountPercent = defaultVariant.originalPrice 
              ? Math.round(((defaultVariant.originalPrice - defaultVariant.price) / defaultVariant.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="bg-card rounded-lg p-4 border border-border"
              >
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <Link to={`/product/${product.slug}`} className="flex-shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="font-semibold hover:text-ec-green transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {product.shortDescription}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-semibold text-ec-green">
                            ₹{defaultVariant.price}
                          </span>
                          {defaultVariant.originalPrice && defaultVariant.originalPrice > defaultVariant.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{defaultVariant.originalPrice}
                            </span>
                          )}
                          {discountPercent > 0 && (
                            <span className="text-xs bg-ec-orange text-primary-foreground px-2 py-1 rounded">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                          Default: {defaultVariant.weight}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-4">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={!defaultVariant.isInStock}
                        className="bg-ec-green hover:bg-ec-green-dark flex-1 sm:flex-none"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {defaultVariant.isInStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      
                      <Link to={`/product/${product.slug}`}>
                        <Button variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link to="/">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;