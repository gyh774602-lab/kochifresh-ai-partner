import { useState } from "react";
import { BannerSlider } from "@/components/BannerSlider";
import { LoyaltyProgressBar } from "@/components/LoyaltyProgressBar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import { Truck, Shield, Clock, Headphones } from "lucide-react";

const Index = () => {
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(new Set());
  
  const handleWishlistToggle = (productId: string) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
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

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: "Free Delivery", desc: "Above ₹300" },
            { icon: Clock, title: "Fresh Daily", desc: "Same day delivery" },
            { icon: Shield, title: "Quality Assured", desc: "Farm fresh guarantee" },
            { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
              <div className="bg-ec-green text-primary-foreground p-2 rounded-lg flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
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
                isWishlisted={wishlistedItems.has(product.id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Products by Category */}
      <section id="all-products" className="container mx-auto px-4">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Shop by Category</h2>
            <p className="text-muted-foreground">Fresh vegetables delivered to your doorstep in Kochi</p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
              <TabsTrigger value="all">All Products</TabsTrigger>
              {CATEGORIES.slice(0, 4).map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="hidden lg:flex">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistedItems.has(product.id)}
                    onWishlistToggle={handleWishlistToggle}
                  />
                ))}
              </div>
            </TabsContent>

            {CATEGORIES.map((category) => {
              const categoryProducts = allProducts.filter(p => p.categoryId === category.id);
              return (
                <TabsContent key={category.id} value={category.id} className="space-y-6 mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isWishlisted={wishlistedItems.has(product.id)}
                        onWishlistToggle={handleWishlistToggle}
                      />
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-gradient-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            Start Your Fresh Journey Today
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of happy customers in Kochi who trust ECFresh for their daily vegetable needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <Button size="lg" className="bg-ec-orange hover:bg-ec-orange-dark">
              Order Now
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Download App
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
