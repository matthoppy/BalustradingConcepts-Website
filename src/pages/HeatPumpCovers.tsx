import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FixedContactButtons from "@/components/FixedContactButtons";
import heroImage from "@/assets/hero-balustrading.jpg";

const HeatPumpCovers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // TODO: replace placeholder copy/images with final content and heat pump cover photos.
  const features = [
    "Architectural-grade aluminium, designed and made in New Zealand",
    "Choice of Dulux powdercoat colours to match your home",
    "Low-maintenance and corrosion-resistant for NZ conditions",
    "Multiple contemporary styles to suit any space",
    "Standard and custom sizes available",
    "Conceals and protects heat pump and air-conditioning units",
  ];

  const styles = [
    {
      name: "Asko",
      description:
        "A high-functioning aluminium cover offering excellent value, ideal for those wanting tidy, effective concealment.",
    },
    {
      name: "Chatham",
      description:
        "A premium look with minimal visibility — ideal for modern spaces where sleek, understated design matters.",
    },
    {
      name: "Futuna",
      description:
        "Maximum security with a no-toehold design, ideal for balconies or areas with children where safety is key.",
    },
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
                Heat Pump Covers
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto font-light">
                Premium aluminium covers that conceal and protect your heat pump while enhancing your home
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" asChild>
                  <a href="/#contact">Request A Quote</a>
                </Button>
                <Button variant="outline" size="lg" className="bg-white text-foreground hover:bg-white/90" asChild>
                  <a href="#styles">View Styles</a>
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
                  Tidy, Stylish Heat Pump Concealment
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Outdoor heat pump and air-conditioning units are essential, but they don't have to be an
                  eyesore. Our aluminium heat pump covers neatly conceal your unit while allowing the airflow
                  it needs to run efficiently, giving your home a clean, considered finish.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  As an authorised UNEX fabricator, we supply and install ScreenPro aluminium covers —
                  designed and manufactured in New Zealand from architectural-grade aluminium and finished
                  in your choice of Dulux powdercoat colours to complement your home or building.
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
                    <a href="/#contact">Request a Quote</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Styles Section */}
        <section id="styles" className="py-16 bg-secondary">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 uppercase">
                Choose Your Style
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A range of contemporary designs to suit your home and your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {styles.map((style) => (
                <div key={style.name} className="bg-card p-8 border border-border h-full flex flex-col">
                  <h3 className="text-2xl font-bold text-card-foreground mb-4">{style.name}</h3>
                  <p className="text-muted-foreground leading-relaxed flex-grow">{style.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HeatPumpCovers;
