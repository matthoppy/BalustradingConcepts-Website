import { Button } from "./ui/button";
import heroImage from "@/assets/hero-balustrading.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-overlay/50" />
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex items-center justify-center text-center px-4 sm:px-6">
        <div className="max-w-5xl">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-primary-foreground uppercase tracking-wider mb-4 sm:mb-6 animate-fade-in leading-tight">
            Premium Balustrading Solutions
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/90 mb-6 sm:mb-8 max-w-3xl mx-auto font-light px-4">
            Transform your space with elegant glass and aluminium balustrades, fencing and gates
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button variant="hero" size="lg" asChild className="w-full sm:w-auto">
              <a href="#contact">Get A Free Quote</a>
            </Button>
            <Button variant="outline" size="lg" className="bg-white text-foreground hover:bg-white/90 w-full sm:w-auto" asChild>
              <a href="#gallery">View Our Work</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
