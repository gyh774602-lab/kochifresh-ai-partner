import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, ProductVariant } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onWishlistToggle?: (productId: string) => void;
}

export const ProductCard = ({ product, isWishlisted = false, onWishlistToggle }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants.find(v => v.isDefault) || product.variants[0]
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedVariant.isInStock) {
      toast({
        title: "Out of Stock",
        description: "This variant is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, selectedVariant, 1);
    toast({
      title: "Added to Cart! 🛒",
      description: `${product.name} (${selectedVariant.weight}) added to your cart`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle?.(product.id);
  };

  const discountPercent = selectedVariant.originalPrice 
    ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.slug}`} className="group">
      <div className="bg-card rounded-xl border border-border hover:border-ec-green/30 transition-all duration-300 hover:shadow-lg hover:shadow-ec-green/10 overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <Badge className="absolute top-3 left-3 bg-ec-orange hover:bg-ec-orange-dark text-white">
              {discountPercent}% OFF
            </Badge>
          )}
          
          {/* Featured Badge */}
          {product.isFeatured && (
            <Badge className="absolute top-3 right-3 bg-ec-green hover:bg-ec-green-dark">
              Featured
            </Badge>
          )}

          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-3 right-3 ${product.isFeatured ? 'top-12' : ''} bg-background/80 hover:bg-background ${
              isWishlisted ? 'text-red-500' : 'text-muted-foreground'
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Product Info */}
          <div className="space-y-1">
            <h3 className="font-semibold line-clamp-1 group-hover:text-ec-green transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.shortDescription}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Variants */}
          <div className="flex gap-1">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariant(variant);
                }}
                className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                  selectedVariant.id === variant.id
                    ? "bg-ec-green text-primary-foreground border-ec-green"
                    : "bg-background border-border hover:border-ec-green/50"
                } ${!variant.isInStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!variant.isInStock}
              >
                {variant.weight}
              </button>
            ))}
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-ec-green">
                  ₹{selectedVariant.price}
                </span>
                {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{selectedVariant.originalPrice}
                  </span>
                )}
              </div>
              {product.preparationTime && (
                <p className="text-xs text-muted-foreground">
                  {product.preparationTime}
                </p>
              )}
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!selectedVariant.isInStock}
              className="bg-ec-green hover:bg-ec-green-dark shadow-ec-green/20 hover:shadow-ec-green/30"
            >
              {selectedVariant.isInStock ? (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </>
              ) : (
                'Out of Stock'
              )}
            </Button>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};