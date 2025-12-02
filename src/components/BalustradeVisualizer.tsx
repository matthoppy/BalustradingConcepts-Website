import { useState } from "react";
import { Button } from "@/components/ui/button";

// Thumbnails (Unex product photos)
import thumbAscot from "@/assets/thumb-ascot.jpg";
import thumbWindsor from "@/assets/thumb-windsor.jpg";
import thumbKeston from "@/assets/thumb-keston.jpg";
import thumbSafaSlat from "@/assets/thumb-safa-slat.jpg";
import thumbHampton from "@/assets/thumb-hampton.jpg";
import thumbHenley from "@/assets/thumb-henley.jpg";

// Full deck images with each style
import visualizerAscot from "@/assets/visualizer-ascot-new.jpg";
import visualizerWindsor from "@/assets/visualizer-windsor.jpg";
import visualizerKeston from "@/assets/visualizer-keston.jpg";
import visualizerSafaSlat from "@/assets/visualizer-safa-slat.jpg";
import visualizerHampton from "@/assets/visualizer-hampton-new.jpg";
import visualizerHenley from "@/assets/visualizer-henley.jpg";

const styles = [
  { id: "ascot", name: "Ascot", description: "Vertical square balusters", thumb: thumbAscot, fullImage: visualizerAscot },
  { id: "windsor", name: "Windsor", description: "Double-top rail design", thumb: thumbWindsor, fullImage: visualizerWindsor },
  { id: "keston", name: "Keston", description: "Modern minimalist frame", thumb: thumbKeston, fullImage: visualizerKeston },
  { id: "safa-slat", name: "Safa-Slat", description: "Horizontal privacy slats", thumb: thumbSafaSlat, fullImage: visualizerSafaSlat },
  { id: "hampton", name: "Hampton", description: "Vertical flat fins", thumb: thumbHampton, fullImage: visualizerHampton },
  { id: "henley", name: "Henley", description: "Classic baluster design", thumb: thumbHenley, fullImage: visualizerHenley },
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
            See how different Framed Balustrade styles look on your deck. Choose a style to preview your perfect balustrade in matte black finish.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Main Image Display */}
          <div className="relative mb-8 rounded-lg overflow-hidden shadow-2xl">
            <img
              src={selectedStyle.fullImage}
              alt={`${selectedStyle.name} balustrade in matte black`}
              className="w-full h-auto transition-all duration-500"
            />
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-sm">
              <p className="font-semibold text-foreground">{selectedStyle.name}</p>
              <p className="text-sm text-muted-foreground">Matte Black Finish</p>
            </div>
          </div>

          {/* Style Selection with Thumbnails */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Select Style</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`group rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedStyle.id === style.id
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={style.thumb}
                      alt={`${style.name} style preview`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2 bg-card">
                    <p className="font-semibold text-sm text-foreground">{style.name}</p>
                    <p className="text-xs text-muted-foreground">{style.description}</p>
                  </div>
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
