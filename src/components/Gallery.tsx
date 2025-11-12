import { useState } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";
import gallery9 from "@/assets/gallery-9.jpg";
import gallery10 from "@/assets/gallery-10.jpg";
import gallery11 from "@/assets/gallery-11.jpg";
import gallery12 from "@/assets/gallery-12.jpg";
import gallery13 from "@/assets/gallery-13.jpg";
import gallery14 from "@/assets/gallery-14.jpg";
import gallery15 from "@/assets/gallery-15.jpg";
import gallery16 from "@/assets/gallery-16.jpg";
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
      name: "Framed Glass Balustrade",
      style: "Avon",
      category: "balustrade",
      mainImage: gallery13,
      images: [gallery13, gallery14, gallery15, gallery16, gallery12],
      alt: "Avon framed glass balustrade installation",
    },
    {
      name: "Arney Crestent Job",
      style: "Finline",
      category: "balustrade",
      mainImage: gallery6,
      images: [gallery6, gallery7, gallery8, gallery9],
      alt: "Finline balustrading on deck at Arney Crestent",
    },
    {
      name: "Birkenhead",
      style: "Finline",
      category: "balustrade",
      mainImage: gallery10,
      images: [gallery10, gallery11],
      alt: "Finline balustrading at Birkenhead property",
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
