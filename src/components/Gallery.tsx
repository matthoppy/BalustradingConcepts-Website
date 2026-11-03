import { useState, useEffect, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { allProjects, projectAlt, siteImages, type PlacedProject, type ProjectTypeId } from "@/content/siteImages";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

/**
 * The projects come from src/content/site-images.json, which the admin
 * dashboard (/admin → Projects) edits and commits; the photos live under
 * public/images/site/.
 */
const projects: PlacedProject[] = allProjects(siteImages);

const keyOf = (p: PlacedProject) => `${p.type}-${p.index}`;

const Gallery = ({ filter }: { filter?: ProjectTypeId | string }) => {
  const isMobile = useIsMobile();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(12);
  const [randomizedProjects, setRandomizedProjects] = useState<PlacedProject[]>([]);

  // Set initial visible count based on screen size
  useEffect(() => {
    setVisibleCount(isMobile ? 3 : 12);
  }, [isMobile]);

  useEffect(() => {
    if (!carouselApi) return;

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

  // Randomize projects on mount
  useEffect(() => {
    const shuffled = [...projects].sort(() => Math.random() - 0.5);
    setRandomizedProjects(shuffled);
  }, []);

  // Filter projects if filter prop is provided
  const filteredProjects = filter
    ? randomizedProjects.filter((p) => p.type === filter)
    : randomizedProjects;

  // Slice to show only visible projects
  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const selected = useMemo(() => projects.find((p) => keyOf(p) === selectedKey) || null, [selectedKey]);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 uppercase">
            Our Projects
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Explore our portfolio of completed installations
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleProjects.map((p) => (
            <div
              key={keyOf(p)}
              className="relative aspect-[4/3] overflow-hidden group cursor-pointer"
              onClick={() => setSelectedKey(keyOf(p))}
            >
              <img
                src={p.project.photos[0]}
                alt={projectAlt(p.project)}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-overlay/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-primary-foreground text-lg font-semibold">
                  View Project
                </span>
              </div>
              {p.project.photos.length > 1 && (
                <span className="absolute bottom-2 right-2 rounded bg-overlay/70 px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  {p.project.photos.length} photos
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-colors duration-300"
            >
              Load More Projects
            </button>
          </div>
        )}

        {/* Project Dialog */}
        <Dialog open={selected !== null} onOpenChange={() => setSelectedKey(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selected?.project.title}
              </DialogTitle>
              {selected?.project.style && (
                <p className="text-muted-foreground">
                  Style: {selected.project.style}
                </p>
              )}
            </DialogHeader>

            {selected && (
              <div className="relative">
                <Carousel className="w-full" setApi={setCarouselApi}>
                  <CarouselContent>
                    {selected.project.photos.map((image, idx) => (
                      <CarouselItem key={image}>
                        <div className="aspect-[16/10] overflow-hidden rounded-lg">
                          <img
                            src={image}
                            alt={`${selected.project.title} - Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {selected.project.photos.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4 h-12 w-12 border-2 border-primary bg-background/95 hover:bg-primary hover:text-primary-foreground" />
                      <CarouselNext className="right-4 h-12 w-12 border-2 border-primary bg-background/95 hover:bg-primary hover:text-primary-foreground" />
                    </>
                  )}
                </Carousel>
                {selected.project.photos.length > 1 && (
                  <div className="text-center mt-4 text-sm text-muted-foreground font-medium">
                    Image {current} of {count}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
