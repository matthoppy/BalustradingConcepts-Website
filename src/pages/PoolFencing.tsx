import { ArrowLeft, Waves, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FixedContactButtons from "@/components/FixedContactButtons";
import Gallery from "@/components/Gallery";

const PoolFencing = () => {
  const features = [
    "Compliant with NZ pool fencing regulations (NZBC F9)",
    "Frameless and semi-frameless glass options",
    "Self-closing, self-latching gates",
    "Toughened safety glass for maximum durability",
    "Transparent barriers for clear pool supervision",
    "Designed to withstand Auckland's coastal climate",
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
              <Waves className="w-12 h-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground uppercase">
                Pool Fencing
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-3xl">
              Ensure safety and style around your pool with our compliant glass pool fencing solutions. 
              We design and install pool barriers that meet all New Zealand safety standards while 
              maintaining an open, elegant aesthetic for your outdoor space.
            </p>
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
                  safety glass and corrosion-resistant hardware designed for Auckland's coastal environment.
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
        <Gallery filter="poolfence" />
      </main>
      
      <Footer />
    </>
  );
};

export default PoolFencing;
