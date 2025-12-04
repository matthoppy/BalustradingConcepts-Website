import { ArrowLeft, Building2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FixedContactButtons from "@/components/FixedContactButtons";
import Gallery from "@/components/Gallery";
import commercialHero from "@/assets/commercial-hero.jpg";

const CommercialProjects = () => {
  const features = [
    "Large-scale installations for offices and retail",
    "Public building handrails and balustrading",
    "Shopping center and hospitality projects",
    "School and library safety installations",
    "Custom commercial fencing and gates",
    "Project management and coordination",
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
            style={{ backgroundImage: `url(${commercialHero})` }}
          >
            <div className="absolute inset-0 bg-overlay/50" />
          </div>

          {/* Hero Content */}
          <div className="relative h-full flex items-center justify-center text-center px-6">
            <div className="max-w-5xl">
              <h1 className="text-5xl md:text-7xl font-black text-primary-foreground uppercase tracking-wider mb-6 animate-fade-in">
                Commercial Projects
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto font-light">
                Partner with Auckland's trusted commercial balustrading specialists for large-scale installations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" asChild>
                  <a href="#contact">Get A Free Quote</a>
                </Button>
                <Button variant="outline" size="lg" className="bg-white text-foreground hover:bg-white/90" asChild>
                  <a href="#gallery">View Commercial Projects</a>
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
                  Commercial Expertise You Can Trust
                </h2>
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
          <Gallery filter="commercial" />
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default CommercialProjects;
