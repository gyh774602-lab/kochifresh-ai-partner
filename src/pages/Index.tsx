import { BannerSlider } from "@/components/BannerSlider";
import { LoyaltyProgressBar } from "@/components/LoyaltyProgressBar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import { useWishlist } from "@/hooks/useWishlist";

const Index = () => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const handleWishlistToggle = (productId: string) => {
    toggleWishlist(productId);
  };

  const featuredProducts = PRODUCTS.filter(p => p.isFeatured);
  const allProducts = PRODUCTS.filter(p => p.isActive);

  return (
    <div className="space-y-8">
      {/* Hero Banner Slider */}
      <section className="container mx-auto px-4 pt-6">
        <BannerSlider />
      </section>

      {/* Loyalty Progress Bar */}
      <section className="container mx-auto px-4">
        <LoyaltyProgressBar />
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {CATEGORIES.map((category) => (
              <div key={category.id} className="bg-card rounded-lg p-3 md:p-4 border border-border hover:border-ec-green/30 transition-colors cursor-pointer">
                <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-sm text-center">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked fresh vegetables for you</p>
            </div>
            <Button variant="outline" asChild>
              <a href="#all-products">View All</a>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={isInWishlist(product.id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section id="all-products" className="container mx-auto px-4">
        <div className="space-y-4 md:space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Fresh Products</h2>
            <p className="text-muted-foreground">Fresh vegetables delivered to your doorstep in Kochi</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {allProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={isInWishlist(product.id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
