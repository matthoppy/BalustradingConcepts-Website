import { ArrowLeft, Home, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FixedContactButtons from "@/components/FixedContactButtons";
import Gallery from "@/components/Gallery";
import residentialHero from "@/assets/residential-hero.jpg";

const ResidentialBalustrading = () => {
  const features = [
    "Custom glass and aluminium balustrades for homes",
    "Deck and balcony balustrading solutions",
    "Internal and external staircase handrails",
    "Frameless glass systems for unobstructed views",
    "Powder-coated aluminium in various colours",
    "Compliant with NZ Building Code requirements",
  ];

  return (
    <>
      <Navigation />
      <FixedContactButtons />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${residentialHero})` }}
          >
            <div className="absolute inset-0 bg-overlay/50" />
          </div>

          {/* Hero Content */}
          <div className="relative h-full flex items-center justify-center text-center px-6">
            <div className="max-w-5xl">
              <h1 className="text-5xl md:text-7xl font-black text-primary-foreground uppercase tracking-wider mb-6 animate-fade-in">
                Residential Balustrading
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto font-light">
                Transform your Auckland home with premium glass and aluminium balustrading solutions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" asChild>
                  <a href="/#contact">Get A Free Quote</a>
                </Button>
                <Button variant="outline" size="lg" className="bg-white text-foreground hover:bg-white/90" asChild>
                  <a href="#gallery">View Residential Projects</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Why Choose Our Residential Services?
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  With over a decade of experience in Auckland, we understand the unique requirements 
                  of residential properties. From coastal homes requiring corrosion-resistant materials 
                  to modern urban dwellings seeking sleek frameless glass, we deliver solutions tailored 
                  to your home's architecture and your lifestyle needs.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Our residential balustrading systems combine safety, durability, and style. We work 
                  closely with homeowners to design and install systems that complement their vision 
                  while meeting all New Zealand building standards.
                </p>
              </div>
              
              <div className="bg-card p-8 border border-border">
                <h3 className="text-2xl font-bold text-card-foreground mb-6">
                  What We Offer
                </h3>
                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Button asChild className="w-full">
                    <a href="/#contact">Get a Free Quote</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery">
          <Gallery filter="balustrade" />
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default ResidentialBalustrading;
