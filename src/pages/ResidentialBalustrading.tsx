import { ArrowLeft, Home, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FixedContactButtons from "@/components/FixedContactButtons";
import Gallery from "@/components/Gallery";

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
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-6">
            <Button variant="ghost" asChild className="mb-6">
              <a href="/#services" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Services
              </a>
            </Button>
            
            <div className="flex items-center gap-4 mb-6">
              <Home className="w-12 h-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground uppercase">
                Residential Balustrading
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-3xl">
              Transform your Auckland home with premium glass and aluminium balustrading solutions. 
              We specialise in creating safe, elegant balustrades that enhance your property's aesthetic 
              and add lasting value.
            </p>
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
        <Gallery filter="balustrade" />
      </main>
      
      <Footer />
    </>
  );
};

export default ResidentialBalustrading;
