import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, Heart, Star, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "@/hooks/use-toast";
import { Product, ProductVariant } from "@/lib/types";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const product = PRODUCTS.find(p => p.slug === slug);
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product?.variants.find(v => v.isDefault) || product?.variants[0] || {} as ProductVariant
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link to="/" className="text-ec-green hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const relatedProducts = PRODUCTS.filter(p => 
    p.categoryId === product.categoryId && p.id !== product.id && p.isActive
  ).slice(0, 4);

  const discountPercent = selectedVariant.originalPrice 
    ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedVariant.isInStock) {
      toast({
        title: "Out of Stock",
        description: "This variant is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, selectedVariant, quantity);
    toast({
      title: "Added to Cart! 🛒",
      description: `${product.name} (${selectedVariant.weight}) × ${quantity} added to your cart`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to cart or checkout
    window.location.href = "/cart";
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
    toast({
      title: isInWishlist(product.id) ? "Removed from Wishlist" : "Added to Wishlist ❤️",
      description: isInWishlist(product.id) ? "Product removed from your wishlist" : "Product saved to your wishlist",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border z-40 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="p-2 -ml-2">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWishlistToggle}
              className={isInWishlist(product.id) ? 'text-red-500' : 'text-muted-foreground'}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Product Image */}
        <div className="aspect-square bg-muted relative">
          <img
            src={product.images[selectedImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discountPercent > 0 && (
            <Badge className="absolute top-4 left-4 bg-ec-orange hover:bg-ec-orange-dark text-white">
              {discountPercent}% OFF
            </Badge>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.shortDescription}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating}</span>
            </div>
            <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-ec-green">₹{selectedVariant.price}</span>
            {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
              <span className="text-lg text-muted-foreground line-through">
                ₹{selectedVariant.originalPrice}
              </span>
            )}
          </div>

          {/* Variants */}
          <div>
            <h3 className="font-semibold mb-2">Select Weight</h3>
            <div className="flex gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    selectedVariant.id === variant.id
                      ? "bg-ec-green text-primary-foreground border-ec-green"
                      : "bg-background border-border hover:border-ec-green/50"
                  } ${!variant.isInStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!variant.isInStock}
                >
                  {variant.weight}
                  <br />
                  <span className="text-xs">₹{variant.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-xl overflow-hidden relative">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discountPercent > 0 && (
                  <Badge className="absolute top-4 left-4 bg-ec-orange hover:bg-ec-orange-dark text-white">
                    {discountPercent}% OFF
                  </Badge>
                )}
              </div>
              
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index ? 'border-ec-green' : 'border-border'
                      }`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <p className="text-muted-foreground text-lg">{product.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-ec-green">₹{selectedVariant.price}</span>
                {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{selectedVariant.originalPrice}
                  </span>
                )}
              </div>

              {/* Variants */}
              <div>
                <h3 className="font-semibold mb-3">Select Weight</h3>
                <div className="flex gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-6 py-3 rounded-lg border transition-colors ${
                        selectedVariant.id === variant.id
                          ? "bg-ec-green text-primary-foreground border-ec-green"
                          : "bg-background border-border hover:border-ec-green/50"
                      } ${!variant.isInStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!variant.isInStock}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{variant.weight}</div>
                        <div className="text-sm">₹{variant.price}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-semibold text-xl w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant.isInStock}
                  className="flex-1 bg-ec-green hover:bg-ec-green-dark"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={!selectedVariant.isInStock}
                  className="flex-1 bg-ec-orange hover:bg-ec-orange-dark"
                >
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistToggle}
                  className={isInWishlist(product.id) ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar - Mobile */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-background border-t border-border p-4 z-30">
        <div className="flex gap-3">
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={!selectedVariant.isInStock}
            className="flex-1 bg-ec-green hover:bg-ec-green-dark"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
          <Button
            size="lg"
            onClick={handleBuyNow}
            disabled={!selectedVariant.isInStock}
            className="flex-1 bg-ec-orange hover:bg-ec-orange-dark"
          >
            Buy Now
          </Button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container mx-auto px-4 py-8 lg:py-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                isWishlisted={isInWishlist(relatedProduct.id)}
                onWishlistToggle={toggleWishlist}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;