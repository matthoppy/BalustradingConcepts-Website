import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FixedContactButtons from "@/components/FixedContactButtons";
import HeatPumpQuoteForm from "@/components/HeatPumpQuoteForm";
import HeatPumpCoverConfigurator from "@/components/HeatPumpCoverConfigurator";
import { sizesByStyle, sizeLabel } from "@/data/heatPumpCovers";
import heroImage from "@/assets/heatpump-cover-hero.jpg";

const HeatPumpCovers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedStyle, setSelectedStyle] = useState("Asko");
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedColour, setSelectedColour] = useState("Black");

  const sizes = sizesByStyle[selectedStyle];
  const selectedSize = sizes[Math.min(selectedSizeIndex, sizes.length - 1)];

  const features = [
    "Architectural-grade NZ aluminium — strong, durable and non-rusting",
    "Corrosion-resistant construction built for coastal conditions",
    "Ventilated louvre design maintains the airflow your unit needs to perform",
    "Open-backed enclosure keeps your unit accessible for servicing",
    "25 standard Dulux powdercoat colours (custom colours on request)",
    "Six standard sizes, plus fully custom builds to your exact measurements",
    "10-year warranty for residential use",
    "Flat-packed for easy on-site assembly, or installed for you across Auckland",
  ];

  const customBuilds = [
    "Custom sizes built to your exact measurements",
    "Cutouts for pipework, taps, cables and drainage",
    "Awkward spots — corners, under windows, narrow paths and balconies",
    "Multi-unit banks and large commercial enclosures",
    "Any powdercoat colour to match your joinery, cladding or roof",
    "Site measure, fabrication and installation across Auckland",
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
                  Each cover is a three-sided enclosure — a front panel, two side panels and a lid — that
                  sits over your unit with an open back against the wall. Generous internal clearances keep
                  the unit accessible for servicing and let it breathe freely, so performance isn't
                  compromised.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Every cover is built to last and backed by a 10-year residential warranty. Covers are
                  flat-packed for straightforward on-site assembly, and standard sizes and colours are
                  typically dispatched within 5–7 working days. Need something out of the ordinary? We also
                  build fully custom covers — see custom builds below.
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

        {/* Interactive Configurator Section */}
        <section id="styles" className="py-16 bg-secondary">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 uppercase">
                Build Your Cover
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Pick a style, size and colour to see your cover with its dimensions — your selection carries
                through to the quote form below
              </p>
            </div>

            <HeatPumpCoverConfigurator
              selectedStyle={selectedStyle}
              selectedSizeIndex={selectedSizeIndex}
              selectedColour={selectedColour}
              onStyleChange={(style) => {
                setSelectedStyle(style);
                setSelectedSizeIndex((i) => Math.min(i, sizesByStyle[style].length - 1));
              }}
              onSizeChange={setSelectedSizeIndex}
              onColourChange={setSelectedColour}
            />
          </div>
        </section>

        {/* Sizing & Colours Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Measuring Guide</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Three measurements of your outdoor unit are all we need:
                </p>
                <ol className="space-y-3 mb-6 list-decimal pl-5">
                  <li className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Height</strong> — from the ground (or wherever the
                    base of the cover will sit) to the top of the unit, including any mounting blocks or
                    feet.
                  </li>
                  <li className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Width</strong> — across the widest points of the
                    unit, including pipework at the sides. Don't count anything on the wall behind the unit
                    that will sit inside the cover.
                  </li>
                  <li className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Depth</strong> — from the wall to the front-most
                    point of the unit, including mounting feet.
                  </li>
                </ol>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  We then add the clearances the cover needs for airflow and access:
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

        {/* Custom Builds Section */}
        <section id="custom-builds" className="py-16 bg-secondary">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 uppercase">
                  Custom Builds
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Standard sizes don't fit every situation — and that's where we come in. As fabricators, we
                  build custom aluminium covers to your exact specifications, measurements and needs. From a
                  simple cutout for pipework or an awkward corner installation, right up to large enclosures
                  concealing banks of units on commercial buildings, we can design and build it.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Every custom cover uses the same architectural-grade aluminium and quality powdercoat as
                  our standard range, so an odd-sized cover never has to look like an afterthought. Tell us
                  what you're working with in the quote form — measurements, photos of the space, or just a
                  description — and we'll come back to you with options.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Architects, builders and commercial clients: we're happy to work from your drawings and
                  specifications — get in touch to discuss your project.
                </p>
              </div>

              <div className="bg-card p-8 border border-border">
                <h3 className="text-2xl font-bold text-card-foreground mb-6">
                  What We Can Do
                </h3>
                <ul className="space-y-4">
                  {customBuilds.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button asChild className="w-full">
                    <a href="#quote">Request a Custom Build Quote</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Form Section */}
        <section id="quote" className="py-16 bg-background">
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
                <HeatPumpQuoteForm
                  selectedStyle={selectedStyle}
                  selectedSizeLabel={sizeLabel(selectedStyle, selectedSize)}
                  selectedColour={selectedColour}
                />
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
