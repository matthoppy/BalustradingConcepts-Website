import { useState } from "react";
import { Button } from "@/components/ui/button";
import visualizerAscot from "@/assets/visualizer-ascot.jpg";
import visualizerHampton from "@/assets/visualizer-hampton.jpg";
import visualizerSpectra from "@/assets/visualizer-spectra.jpg";
import visualizerFinline from "@/assets/visualizer-finline.jpg";
import visualizerArena from "@/assets/visualizer-arena.jpg";

const styles = [
  { id: "ascot", name: "Ascot", description: "Horizontal slat rails", image: visualizerAscot },
  { id: "hampton", name: "Hampton", description: "Vertical fins between posts", image: visualizerHampton },
  { id: "spectra", name: "Spectra", description: "Framed glass panels", image: visualizerSpectra },
  { id: "finline", name: "Finline", description: "Postless vertical fins", image: visualizerFinline },
  { id: "arena", name: "Arena", description: "Frameless glass standoffs", image: visualizerArena },
];

const BalustradeVisualizer = () => {
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);

  return (
    <section id="visualizer" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Visualize Your Balustrade
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how different styles look on your deck. Choose a style to preview your perfect balustrade in matte black finish.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Image Display */}
          <div className="relative mb-8 rounded-lg overflow-hidden shadow-2xl">
            <img
              src={selectedStyle.image}
              alt={`${selectedStyle.name} balustrade in matte black`}
              className="w-full h-auto transition-all duration-500"
            />
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-sm">
              <p className="font-semibold text-foreground">{selectedStyle.name}</p>
              <p className="text-sm text-muted-foreground">Matte Black Finish</p>
            </div>
          </div>

          {/* Style Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Select Style</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`p-4 rounded-sm border-2 transition-all duration-300 text-left ${
                    selectedStyle.id === style.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <p className="font-semibold text-foreground">{style.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{style.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <a href="#contact">
              <Button variant="hero" size="lg">
                Get a Free Quote for This Style
              </Button>
            </a>
            <p className="text-sm text-muted-foreground mt-4">
              Our team will help you bring your vision to life
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BalustradeVisualizer;
