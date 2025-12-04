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
import gallery52 from "@/assets/gallery-52.jpg";
import gallery53 from "@/assets/gallery-53.jpg";
import gallery54 from "@/assets/gallery-54.jpg";
import gallery55 from "@/assets/gallery-55.jpg";
import gallery56 from "@/assets/gallery-56.jpg";
import gallery57 from "@/assets/gallery-57.jpg";
import gallery58 from "@/assets/gallery-58.jpg";
import gallery59 from "@/assets/gallery-59.jpg";
import gallery60 from "@/assets/gallery-60.jpg";
import gallery61 from "@/assets/gallery-61.jpg";
import gallery62 from "@/assets/gallery-62.jpg";
import gallery63 from "@/assets/gallery-63.jpg";
import gallery64 from "@/assets/gallery-64.jpg";
import gallery65 from "@/assets/gallery-65.jpg";
import gallery66 from "@/assets/gallery-66.jpg";
import gallery67 from "@/assets/gallery-67.jpg";
import gallery68 from "@/assets/gallery-68.jpg";
import gallery69 from "@/assets/gallery-69.jpg";
import gallery70 from "@/assets/gallery-70.jpg";
import gallery71 from "@/assets/gallery-71.jpg";
import gallery72 from "@/assets/gallery-72.jpg";
import gallery73 from "@/assets/gallery-73.jpg";
import gallery74 from "@/assets/gallery-74.jpg";
import gallery75 from "@/assets/gallery-75.jpg";
import gallery76 from "@/assets/gallery-76.jpg";
import gallery77 from "@/assets/gallery-77.jpg";
import gallery78 from "@/assets/gallery-78.jpg";
import gallery79 from "@/assets/gallery-79.jpg";
import poolFence1 from "@/assets/pool-fence-1.jpg";
import poolFence2 from "@/assets/pool-fence-2.jpg";
import poolFence3 from "@/assets/pool-fence-3.jpg";
import poolFence4 from "@/assets/pool-fence-4.jpg";
import poolFence5 from "@/assets/pool-fence-5.jpg";
import poolFence6 from "@/assets/pool-fence-6.jpg";
import poolFence7 from "@/assets/pool-fence-7.jpg";
import poolFence8 from "@/assets/pool-fence-8.jpg";
import poolFence9 from "@/assets/pool-fence-9.jpg";
import poolFence10 from "@/assets/pool-fence-10.jpg";
import poolFence11 from "@/assets/pool-fence-11.jpg";
import poolFence12 from "@/assets/pool-fence-12.jpg";
import poolFence13 from "@/assets/pool-fence-13.jpg";
import poolFence14 from "@/assets/pool-fence-14.jpg";
import poolFence15 from "@/assets/pool-fence-15.jpg";
import poolFence16 from "@/assets/pool-fence-16.jpg";
import poolFence17 from "@/assets/pool-fence-17.jpg";
import poolFence18 from "@/assets/pool-fence-18.jpg";
import gallery80 from "@/assets/gallery-80.jpg";
import gallery81 from "@/assets/gallery-81.jpg";
import gallery82 from "@/assets/gallery-82.jpg";
import gallery83 from "@/assets/gallery-83.jpg";
import gallery84 from "@/assets/gallery-84.jpg";
import gallery85 from "@/assets/gallery-85.jpg";
import gallery86 from "@/assets/gallery-86.jpg";
import gallery87 from "@/assets/gallery-87.jpg";
import gallery88 from "@/assets/gallery-88.jpg";
import gallery89 from "@/assets/gallery-89.jpg";
import gallery90 from "@/assets/gallery-90.jpg";
import gallery91 from "@/assets/gallery-91.jpg";
import gallery92 from "@/assets/gallery-92.jpg";
import gallery93 from "@/assets/gallery-93.jpg";
import gallery94 from "@/assets/gallery-94.jpg";
import gallery95 from "@/assets/gallery-95.jpg";
import gallery96 from "@/assets/gallery-96.jpg";
import gallery97 from "@/assets/gallery-97.jpg";
import gallery98 from "@/assets/gallery-98.jpg";
import gallery99 from "@/assets/gallery-99.jpg";
import gallery100 from "@/assets/gallery-100.jpg";
import gallery101 from "@/assets/gallery-101.jpg";
import gallery102 from "@/assets/gallery-102.jpg";
import gallery103 from "@/assets/gallery-103.jpg";
import gallery104 from "@/assets/gallery-104.jpg";
import gallery105 from "@/assets/gallery-105.jpg";
import gallery106 from "@/assets/gallery-106.jpg";
import gallery107 from "@/assets/gallery-107.jpg";
import gallery108 from "@/assets/gallery-108.jpg";
import gallery109 from "@/assets/gallery-109.jpg";
import gallery110 from "@/assets/gallery-110.jpg";
import gallery111 from "@/assets/gallery-111.jpg";
import gallery112 from "@/assets/gallery-112.jpg";
import gallery113 from "@/assets/gallery-113.jpg";
import gallery114 from "@/assets/gallery-114.jpg";
import gallery115 from "@/assets/gallery-115.jpg";
import gallery116 from "@/assets/gallery-116.jpg";
import gallery117 from "@/assets/gallery-117.jpg";
import gallery118 from "@/assets/gallery-118.jpg";
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

const Gallery = ({ filter }: { filter?: string }) => {
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
      name: "Millwater Pool Fence",
      style: "Mini Posts",
      category: "poolfence",
      mainImage: poolFence8,
      images: [poolFence8, poolFence9, poolFence10, poolFence11, poolFence12, poolFence18],
      alt: "Mini Posts hidden pool fencing installation at Millwater",
    },
    {
      name: "Grey Lynn Project",
      style: "Finline",
      category: "poolfence",
      mainImage: poolFence13,
      images: [poolFence13, poolFence14, poolFence15, poolFence16, poolFence17],
      alt: "Finline hidden pool fencing at Grey Lynn residential property",
    },
    {
      name: "Pool Fencing with Deck",
      style: "Ascot and Spectra",
      category: "poolfence",
      mainImage: poolFence1,
      images: [poolFence1, poolFence2, poolFence3, poolFence4, poolFence5, poolFence6, poolFence7],
      alt: "Ascot and Spectra hidden pool fencing around elevated pool on timber deck",
    },
    {
      name: "Evril Orr Retirement Home",
      style: "Finline and Ascot Handrails",
      category: "commercial",
      mainImage: gallery102,
      images: [gallery102, gallery99, gallery100, gallery101, gallery103, gallery104, gallery105, gallery106, gallery107, gallery108, gallery109, gallery110, gallery111, gallery112, gallery113, gallery114],
      alt: "Finline and Ascot handrails at Evril Orr Retirement Home commercial project",
    },
    {
      name: "Pukekohe Project",
      style: "Finline",
      category: "commercial",
      mainImage: gallery115,
      images: [gallery115, gallery116, gallery117, gallery118],
      alt: "Finline commercial balustrading at Pukekohe Project",
    },
    {
      name: "Parnell Project",
      style: "finline",
      category: "balustrade",
      mainImage: gallery1,
      images: [gallery1, gallery76, gallery93],
      alt: "Finline balustrading at Parnell project",
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
      category: "balustrade",
      mainImage: gallery49,
      images: [gallery49, gallery50, gallery51],
      alt: "Extreme Etchlite glass privacy screen installation",
    },
    {
      name: "Commercial Handrail",
      style: "Ascot with Handrail",
      category: "commercial",
      mainImage: gallery52,
      images: [gallery52, gallery53, gallery54, gallery55],
      alt: "Ascot commercial handrail installation on stairs and deck",
    },
    {
      name: "Balustrade and Privacy Screen",
      style: "Avon and Safa Slat",
      category: "balustrade",
      mainImage: gallery56,
      images: [gallery56, gallery57, gallery58, gallery59],
      alt: "Avon balustrade and Safa Slat privacy screen installation on timber deck",
    },
    {
      name: "Aluminium Balustrade",
      style: "Windsor",
      category: "balustrade",
      mainImage: gallery60,
      images: [gallery60, gallery61, gallery62, gallery63, gallery64],
      alt: "Windsor aluminium balustrade on elevated timber deck with views",
    },
    {
      name: "Glass Balustrade with Privacy Screen",
      style: "Spectra and Safa Slat",
      category: "balustrade",
      mainImage: gallery65,
      images: [gallery65, gallery66, gallery67, gallery68, gallery69, gallery70],
      alt: "Spectra glass balustrade with Safa Slat privacy screen on elevated deck",
    },
    {
      name: "Glass Balustrade",
      style: "Panorama",
      category: "balustrade",
      mainImage: gallery71,
      images: [gallery71, gallery72, gallery73, gallery74, gallery75],
      alt: "Panorama glass balustrade installation",
    },
    {
      name: "Stairway Handrail",
      style: "Ascot",
      category: "balustrade",
      mainImage: gallery77,
      images: [gallery77, gallery78, gallery79],
      alt: "Ascot handrail installation on curved concrete stairs",
    },
    {
      name: "Oranga School",
      style: "Extreme Ascot",
      category: "commercial",
      mainImage: gallery80,
      images: [gallery80, gallery81],
      alt: "Extreme Ascot commercial balustrading installation at Oranga School",
    },
    {
      name: "Glen Eden Apartments",
      style: "Hampton",
      category: "commercial",
      mainImage: gallery82,
      images: [gallery82, gallery83, gallery84],
      alt: "Hampton style commercial balustrading at Glen Eden Apartments",
    },
    {
      name: "Accessibility Walkway",
      style: "Handrail",
      category: "commercial",
      mainImage: gallery85,
      images: [gallery85, gallery86, gallery87],
      alt: "Commercial handrail installation for accessibility walkway",
    },
    {
      name: "Dealership Project",
      style: "Ascot",
      category: "commercial",
      mainImage: gallery88,
      images: [gallery88, gallery89],
      alt: "Ascot style commercial balustrading at dealership",
    },
    {
      name: "Lincoln Project",
      style: "Windsor",
      category: "commercial",
      mainImage: gallery90,
      images: [gallery90, gallery91, gallery92],
      alt: "Windsor style commercial balustrading at Lincoln Project",
    },
    {
      name: "Diocesan School Project",
      style: "Windsor",
      category: "commercial",
      mainImage: gallery94,
      images: [gallery94, gallery95, gallery96, gallery97, gallery98],
      alt: "Windsor style commercial balustrading at Diocesan School",
    },
  ];

  // Filter projects if filter prop is provided
  const filteredProjects = filter 
    ? projects.filter(project => project.category === filter)
    : projects;

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
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] overflow-hidden group cursor-pointer"
              onClick={() => {
                const originalIndex = projects.findIndex(p => p === project);
                setSelectedProject(originalIndex);
              }}
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
