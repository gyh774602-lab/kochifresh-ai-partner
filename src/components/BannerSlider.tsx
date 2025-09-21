import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBanners } from "@/hooks/useSupabaseData";

export const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { banners: activeBanners, loading } = useBanners();

  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  if (loading) {
    return (
      <div className="w-full mx-2 md:mx-0 mb-4">
        <div className="bg-muted animate-pulse rounded-lg aspect-[16/4]"></div>
      </div>
    );
  }

  if (!activeBanners.length) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-primary">
      {/* Banner Container */}
      <div 
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {activeBanners.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0">
            <div className="aspect-[16/4] relative bg-gradient-primary">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${banner.image})` }}
              />
              
              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-6">
                  <div className="max-w-2xl text-primary-foreground">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="text-lg md:text-xl mb-4 md:mb-6 opacity-90">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.link && (
                      <Button 
                        size="lg"
                        className="bg-ec-orange hover:bg-ec-orange-dark text-white shadow-ec-orange"
                        asChild
                      >
                        <a href={banner.link}>
                          Shop Now
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-foreground hover:bg-white/20"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost" 
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground hover:bg-white/20"
            onClick={nextSlide}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index 
                  ? "bg-primary-foreground" 
                  : "bg-primary-foreground/40"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};