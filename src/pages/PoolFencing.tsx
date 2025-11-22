import { useEffect } from "react";
import { ArrowLeft, Waves, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FixedContactButtons from "@/components/FixedContactButtons";
import Gallery from "@/components/Gallery";
import heroImage from "@/assets/pool-fencing-hero.jpg";

const PoolFencing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const features = [
    "Compliant with NZ pool fencing regulations (NZBC F9)",
    "Frameless and semi-frameless glass options",
    "Self-closing, self-latching gates",
    "Toughened safety glass for maximum durability",
    "Transparent barriers for clear pool supervision",
    "Quality latches and hinges engineered for Auckland weather",
    "Designed to withstand Auckland's coastal climate",
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
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-overlay/50" />
          </div>

          {/* Hero Content */}
          <div className="relative h-full flex items-center justify-center text-center px-6">
            <div className="max-w-5xl">
              <h1 className="text-5xl md:text-7xl font-black text-primary-foreground uppercase tracking-wider mb-6 animate-fade-in">
                Pool Fencing Solutions
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto font-light">
                Safety and style combined with compliant glass pool fencing for Auckland homes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" asChild>
                  <a href="/#contact">Get A Free Quote</a>
                </Button>
                <Button variant="outline" size="lg" className="bg-white text-foreground hover:bg-white/90" asChild>
                  <a href="#gallery">View Pool Fencing Projects</a>
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
                  Safety-First Pool Fencing
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Pool safety is paramount, and our glass pool fencing systems are engineered to provide 
                  the highest level of protection while preserving your property's views and aesthetics. 
                  Every installation is inspected and certified to comply with New Zealand Building Code 
                  requirements for pool barriers.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Our frameless and semi-frameless glass systems offer unobstructed visibility, allowing 
                  you to supervise children and pets around the pool area. We use only premium toughened 
                  safety glass and quality latches and hinges engineered to withstand Auckland's varying 
                  temperatures and coastal weather conditions, ensuring reliable long-term performance.
                </p>
                <div className="bg-primary/10 border-l-4 border-primary p-6 mb-6">
                  <h3 className="font-bold text-foreground mb-2">Compliance Guarantee</h3>
                  <p className="text-muted-foreground text-sm">
                    All our pool fencing installations meet NZBC F9 requirements and include documentation 
                    for your council inspection and sign-off.
                  </p>
                </div>
              </div>
              
              <div className="bg-card p-8 border border-border">
                <h3 className="text-2xl font-bold text-card-foreground mb-6">
                  Pool Fencing Features
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
          <Gallery filter="poolfence" />
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default PoolFencing;
