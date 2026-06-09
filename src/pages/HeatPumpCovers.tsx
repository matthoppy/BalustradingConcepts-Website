import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FixedContactButtons from "@/components/FixedContactButtons";
import HeatPumpQuoteForm from "@/components/HeatPumpQuoteForm";
import heroImage from "@/assets/hero-balustrading.jpg";

const HeatPumpCovers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // TODO: swap the placeholder hero/style imagery for real heat pump cover photos.
  const features = [
    "Architectural-grade aluminium — strong, durable and non-rusting",
    "Designed and manufactured in New Zealand",
    "25 standard Dulux powdercoat colours (custom colours on request)",
    "Six standard sizes, with custom sizing available on request",
    "10-year warranty for residential use",
    "Flat-packed for easy on-site assembly and installation",
    "Conceals your unit while allowing the airflow it needs to run efficiently",
    "Suitable for residential, commercial and educational settings",
  ];

  const styles = [
    {
      name: "Asko",
      tagline: "Great value",
      description:
        "A high-functioning aluminium cover offering excellent value — ideal for those wanting tidy, effective concealment without compromising on quality.",
    },
    {
      name: "Chatham",
      tagline: "Premium & minimal",
      description:
        "A premium look with minimal visibility, ideal for modern spaces where sleek, understated design matters. Selected non-standard sizes available.",
    },
    {
      name: "Futuna",
      tagline: "Maximum security",
      description:
        "Maximum security with a no-toehold design, ideal for balconies or areas with children where safety is the priority. Selected non-standard sizes available.",
    },
  ];

  return (
    <>
      <Navigation />
      <FixedContactButtons />

      <main>
        {/* Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-overlay/50" />
          </div>

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
                  <a href="#quote">Get a Free Quote</a>
                </Button>
                <Button variant="outline" size="lg" className="bg-white text-foreground hover:bg-white/90" asChild>
                  <a href="#styles">View Styles</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Intro / Features Section */}
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
                  it needs to run efficiently, giving your home or building a clean, considered finish.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  As an authorised UNEX fabricator, we supply and install the ScreenPro range — aluminium
                  covers designed and manufactured in New Zealand from architectural-grade, non-rusting
                  aluminium and finished in your choice of 25 standard Dulux powdercoat colours (with custom
                  colours available on request).
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Every cover is built to last and backed by a 10-year residential warranty. Covers are
                  flat-packed for straightforward on-site assembly, and standard sizes and colours are
                  typically dispatched within 5–7 working days.
                </p>
              </div>

              <div className="bg-card p-8 border border-border">
                <h3 className="text-2xl font-bold text-card-foreground mb-6">
                  Why Choose Our Heat Pump Covers
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
                    <a href="#quote">Get a Free Quote</a>
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
                Three contemporary designs to suit your home, your space and your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {styles.map((style) => (
                <div key={style.name} className="bg-card p-8 border border-border h-full flex flex-col">
                  <h3 className="text-2xl font-bold text-card-foreground mb-1">{style.name}</h3>
                  <p className="text-primary font-medium mb-4">{style.tagline}</p>
                  <p className="text-muted-foreground leading-relaxed flex-grow">{style.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sizing & Colours Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Getting the Right Size</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Covers come in six standard sizes, with custom sizing available on request. To find the
                  right fit, measure your heat pump / air-conditioning unit (Width x Depth x Height) and
                  include allowances for any pipework and mounting blocks. We then add the necessary
                  clearances for airflow and access:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground"><strong>Width:</strong> add a minimum of 130 mm</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground"><strong>Depth:</strong> add a minimum of 90 mm</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground"><strong>Height:</strong> add a minimum of 20 mm</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Allow <strong>100 mm</strong> from the back of the cover to the wall (or as recommended
                      by the unit manufacturer)
                    </span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Not sure which size or style you need? Just send us your unit measurements in the form and
                  we'll recommend the right cover for your equipment.
                </p>
              </div>

              <div className="bg-card p-8 border border-border">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Finishes & Colours</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Choose from 25 standard Dulux powdercoat colours to match or complement your home, with
                  additional custom colours available on request. The powdercoated architectural aluminium is
                  low-maintenance and engineered to stand up to New Zealand's coastal and variable weather
                  conditions.
                </p>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Delivery & Installation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Standard-size covers in standard colours are typically dispatched within 5–7 working days.
                  Covers arrive flat-packed for easy on-site assembly, and our team can handle installation
                  for you across Auckland.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Form Section */}
        <section id="quote" className="py-16 bg-secondary">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 uppercase">
                  Request a Heat Pump Cover Quote
                </h2>
                <p className="text-lg text-muted-foreground">
                  Tell us your unit dimensions and preferences and we'll get back to you with a free quote.
                </p>
              </div>
              <div className="bg-card p-6 sm:p-8 border border-border">
                <HeatPumpQuoteForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HeatPumpCovers;
