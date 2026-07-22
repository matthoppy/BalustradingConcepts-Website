import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FixedContactButtons from "@/components/FixedContactButtons";
import Gallery from "@/components/Gallery";
import Seo, { serviceJsonLd } from "@/components/Seo";
import heroImage from "@/assets/hero-balustrading.jpg";

const Balustrades = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const residentialFeatures = [
    "Custom glass and aluminium balustrades for homes",
    "Deck and balcony balustrading solutions",
    "Internal and external staircase handrails",
    "Frameless glass systems for unobstructed views",
    "Powder-coated aluminium in various colours",
    "Compliant with NZ Building Code requirements",
  ];

  const commercialFeatures = [
    "Large-scale installations for offices and retail",
    "Public building handrails and balustrading",
    "Shopping center and hospitality projects",
    "School and library safety installations",
    "Custom commercial fencing and gates",
    "Project management and coordination",
  ];

  return (
    <>
      <Seo
        title="Glass & Aluminium Balustrades Auckland | Residential & Commercial"
        description="Custom glass and aluminium balustrades for Auckland homes, decks, stairs and commercial buildings. Frameless systems, NZ Building Code compliant. Free quotes."
        path="/balustrades"
        jsonLd={serviceJsonLd(
          "Glass & Aluminium Balustrading",
          "Custom glass and aluminium balustrade design and installation for residential and commercial projects in Auckland.",
          "/balustrades"
        )}
      />
      <Navigation />
      <FixedContactButtons />

      <main>
        {/* Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-overlay/50" />
          </div>

          {/* Hero Content */}
          <div className="relative h-full flex items-center justify-center text-center px-6">
            <div className="max-w-5xl">
              <h1 className="text-5xl md:text-7xl font-black text-primary-foreground uppercase tracking-wider mb-6 animate-fade-in">
                Balustrades
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto font-light">
                Premium glass and aluminium balustrading for Auckland's residential and commercial projects
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" asChild>
                  <a href="/#contact">Request A Quote</a>
                </Button>
                <Button variant="outline" size="lg" className="bg-white text-foreground hover:bg-white/90" asChild>
                  <a href="#residential">View Projects</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Residential Section */}
        <section id="residential" className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 uppercase">
                Residential Balustrading
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tailored solutions for homes, balconies, decks, and staircases
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Why Choose Our Residential Services?
                </h3>
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
                  {residentialFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button asChild className="w-full">
                    <a href="/#contact">Request a Quote</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Residential Gallery */}
        <Gallery filter="balustrade" />

        {/* Commercial Section */}
        <section id="commercial" className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 uppercase">
                Commercial Projects
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Large-scale installations for offices, retail, and public spaces
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Commercial Expertise You Can Trust
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  With experience across Auckland's commercial sector, we understand the unique demands
                  of large-scale projects. From coordinating with builders and architects to meeting
                  strict deadlines and compliance requirements, we manage every aspect of your commercial
                  balustrading installation.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Our commercial portfolio includes office buildings, shopping centers, public libraries,
                  schools, and hospitality venues. We provide durable, attractive solutions that withstand
                  high traffic while maintaining safety standards and architectural integrity.
                </p>
              </div>

              <div className="bg-card p-8 border border-border">
                <h3 className="text-2xl font-bold text-card-foreground mb-6">
                  Commercial Services
                </h3>
                <ul className="space-y-4">
                  {commercialFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button asChild className="w-full">
                    <a href="/#contact">Request a Quote</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commercial Gallery */}
        <Gallery filter="commercial" />
      </main>

      <Footer />
    </>
  );
};

export default Balustrades;
