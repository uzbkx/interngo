"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  name: string;
  image?: string;
}

interface LogosCarouselProps {
  heading?: string;
  logos?: Logo[];
}

const LogosCarousel = ({ heading, logos = [] }: LogosCarouselProps) => {
  return (
    <section className="py-8 border-b">
      {heading && (
        <p className="text-center text-xs text-muted-foreground mb-4">{heading}</p>
      )}
      <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
        <Carousel
          opts={{ loop: true }}
          plugins={[AutoScroll({ playOnInit: true, speed: 0.8 })]}
        >
          <CarouselContent className="ml-0">
            {logos.map((logo) => (
              <CarouselItem
                key={logo.id}
                className="flex basis-1/4 justify-center pl-0 sm:basis-1/5 md:basis-1/7 lg:basis-1/9"
              >
                <div className="mx-2 flex shrink-0 items-center justify-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity">
                  {logo.image ? (
                    <>
                      <img
                        src={logo.image}
                        alt={logo.name}
                        className="h-6 w-6 object-contain"
                      />
                      <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                        {logo.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                      {logo.name}
                    </span>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />
      </div>
    </section>
  );
};

export { LogosCarousel };
