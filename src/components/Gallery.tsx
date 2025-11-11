import { useState } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
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
} from "@/components/ui/carousel";

const Gallery = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const projects = [
    {
      name: "Commercial Glass Balustrading",
      style: "Frameless Glass",
      category: "commercial",
      mainImage: gallery1,
      images: [gallery1],
      alt: "Commercial glass balustrading on modern building",
    },
    {
      name: "Mini Posts",
      style: "Pool Fence",
      category: "poolfence",
      mainImage: gallery5,
      images: [gallery5],
      alt: "Mini post pool fence installation",
    },
  ];

  return (
    <section id="gallery" className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 uppercase">
            Our Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of completed installations
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
          {projects.map((project, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] overflow-hidden group cursor-pointer"
              onClick={() => setSelectedProject(index)}
            >
              <img
                src={project.mainImage}
                alt={project.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-overlay/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-primary-foreground text-lg font-semibold">
                  View Project
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Project Dialog */}
        <Dialog open={selectedProject !== null} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedProject !== null && projects[selectedProject].name}
              </DialogTitle>
              {selectedProject !== null && projects[selectedProject].style && (
                <p className="text-muted-foreground">
                  Style: {projects[selectedProject].style}
                </p>
              )}
            </DialogHeader>
            
            {selectedProject !== null && (
              <Carousel className="w-full">
                <CarouselContent>
                  {projects[selectedProject].images.map((image, idx) => (
                    <CarouselItem key={idx}>
                      <div className="aspect-[16/10] overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`${projects[selectedProject].name} - Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {projects[selectedProject].images.length > 1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
