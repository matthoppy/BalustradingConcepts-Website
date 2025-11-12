import { useState, useEffect } from "react";
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
import gallery17 from "@/assets/gallery-17.jpg";
import gallery18 from "@/assets/gallery-18.jpg";
import gallery19 from "@/assets/gallery-19.jpg";
import gallery20 from "@/assets/gallery-20.jpg";
import gallery21 from "@/assets/gallery-21.jpg";
import gallery22 from "@/assets/gallery-22.jpg";
import gallery23 from "@/assets/gallery-23.jpg";
import gallery24 from "@/assets/gallery-24.jpg";
import gallery25 from "@/assets/gallery-25.jpg";
import gallery26 from "@/assets/gallery-26.jpg";
import gallery27 from "@/assets/gallery-27.jpg";
import gallery28 from "@/assets/gallery-28.jpg";
import gallery29 from "@/assets/gallery-29.jpg";
import gallery30 from "@/assets/gallery-30.jpg";
import gallery31 from "@/assets/gallery-31.jpg";
import gallery32 from "@/assets/gallery-32.jpg";
import gallery33 from "@/assets/gallery-33.jpg";
import gallery34 from "@/assets/gallery-34.jpg";
import gallery35 from "@/assets/gallery-35.jpg";
import gallery36 from "@/assets/gallery-36.jpg";
import gallery37 from "@/assets/gallery-37.jpg";
import gallery38 from "@/assets/gallery-38.jpg";
import gallery39 from "@/assets/gallery-39.jpg";
import gallery40 from "@/assets/gallery-40.jpg";
import gallery41 from "@/assets/gallery-41.jpg";
import gallery42 from "@/assets/gallery-42.jpg";
import gallery43 from "@/assets/gallery-43.jpg";
import gallery44 from "@/assets/gallery-44.jpg";
import gallery45 from "@/assets/gallery-45.jpg";
import gallery46 from "@/assets/gallery-46.jpg";
import gallery47 from "@/assets/gallery-47.jpg";
import gallery48 from "@/assets/gallery-48.jpg";
import gallery49 from "@/assets/gallery-49.jpg";
import gallery50 from "@/assets/gallery-50.jpg";
import gallery51 from "@/assets/gallery-51.jpg";
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

const Gallery = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

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
    {
      name: "Fineline Safa Slat Balustrade",
      style: "Fineline Safa",
      category: "balustrade",
      mainImage: gallery17,
      images: [gallery17, gallery18, gallery19, gallery20],
      alt: "Fineline Safa slat type balustrade installation",
    },
    {
      name: "Titirangi Glass Balustrade",
      style: "Mini Post",
      category: "balustrade",
      mainImage: gallery21,
      images: [gallery21, gallery22, gallery23, gallery24],
      alt: "Mini Post glass balustrade at Titirangi property",
    },
    {
      name: "Siena Glass Balustrade",
      style: "Siena",
      category: "balustrade",
      mainImage: gallery25,
      images: [gallery25, gallery26],
      alt: "Siena style glass balustrade installation",
    },
    {
      name: "Glass Standoff Balustrade",
      style: "Standoff",
      category: "balustrade",
      mainImage: gallery27,
      images: [gallery27, gallery28],
      alt: "Glass standoff style balustrade installation on timber deck",
    },
    {
      name: "Glass Channel Balustrade",
      style: "Panorama with Etchlite",
      category: "balustrade",
      mainImage: gallery29,
      images: [gallery29, gallery30, gallery31, gallery32],
      alt: "Panorama glass channel balustrade with Etchlite frosted glass",
    },
    {
      name: "Helensville Library",
      style: "Ascot with Handrail",
      category: "commercial",
      mainImage: gallery33,
      images: [gallery33, gallery34, gallery35, gallery36, gallery37],
      alt: "Ascot commercial balustrade with handrail at Helensville Library",
    },
    {
      name: "Commercial Fencing",
      style: "Assure Panels",
      category: "commercial",
      mainImage: gallery38,
      images: [gallery38, gallery39, gallery40],
      alt: "Assure panel commercial fencing installation",
    },
    {
      name: "Taupo Bay Bach",
      style: "Spectra",
      category: "balustrade",
      mainImage: gallery41,
      images: [gallery41, gallery42, gallery43, gallery44, gallery45],
      alt: "Spectra glass balustrade at beachfront Taupo Bay bach",
    },
    {
      name: "Millwater Project",
      style: "Windsor balustrade and Assure Panels + Gates",
      category: "balustrade",
      mainImage: gallery46,
      images: [gallery46, gallery47, gallery48],
      alt: "Windsor balustrade with Assure panels and gates at Millwater",
    },
    {
      name: "Privacy Screen",
      style: "Extreme Etchlite glass",
      category: "commercial",
      mainImage: gallery49,
      images: [gallery49, gallery50, gallery51],
      alt: "Extreme Etchlite glass privacy screen installation",
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
              <div className="relative">
                <Carousel className="w-full" setApi={setCarouselApi}>
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
                      <CarouselPrevious className="left-4 h-12 w-12 border-2 border-primary bg-background/95 hover:bg-primary hover:text-primary-foreground" />
                      <CarouselNext className="right-4 h-12 w-12 border-2 border-primary bg-background/95 hover:bg-primary hover:text-primary-foreground" />
                    </>
                  )}
                </Carousel>
                {projects[selectedProject].images.length > 1 && (
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
