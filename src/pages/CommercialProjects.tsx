import { ArrowLeft, Building2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FixedContactButtons from "@/components/FixedContactButtons";
import Gallery from "@/components/Gallery";

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
              <Building2 className="w-12 h-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground uppercase">
                Commercial Projects
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-3xl">
              Partner with Auckland's trusted commercial balustrading specialists for large-scale 
              installations. We deliver comprehensive solutions for offices, retail spaces, public 
              buildings, and hospitality venues with professional project management from design to completion.
            </p>
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
                <div className="space-y-4">
                  <div className="bg-card p-6 border border-border">
                    <h3 className="font-bold text-card-foreground mb-2">Previous Projects Include:</h3>
                    <ul className="text-muted-foreground text-sm space-y-1">
                      <li>• Helensville Library - Ascot handrails</li>
                      <li>• Commercial office buildings - Finline systems</li>
                      <li>• Retail centers - Assure panel fencing</li>
                      <li>• Public spaces - Privacy screens and balustrading</li>
                    </ul>
                  </div>
                </div>
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
        <Gallery filter="commercial" />
      </main>
      
      <Footer />
    </>
  );
};

export default CommercialProjects;
