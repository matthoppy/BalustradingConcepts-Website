import { useState } from "react";
import { Button } from "@/components/ui/button";
import ascotImage from "@/assets/balustrade-ascot.jpg";
import hamptonImage from "@/assets/balustrade-hampton.jpg";
import spectraImage from "@/assets/balustrade-spectra.jpg";
import finlineImage from "@/assets/balustrade-finline.jpg";
import arenaImage from "@/assets/balustrade-arena.jpg";

const styles = [
  { id: "ascot", name: "Ascot", description: "Horizontal slat design", image: ascotImage },
  { id: "hampton", name: "Hampton", description: "Vertical fin design", image: hamptonImage },
  { id: "spectra", name: "Spectra", description: "Framed glass panels", image: spectraImage },
  { id: "finline", name: "Finline", description: "Postless vertical fins", image: finlineImage },
  { id: "arena", name: "Arena", description: "Frameless glass standoffs", image: arenaImage },
];

const colors = [
  { id: "silver", name: "Silver", filter: "brightness(1.2) saturate(0)" },
  { id: "black", name: "Black Matt", filter: "brightness(0.2)" },
  { id: "white", name: "White Matt", filter: "brightness(1.8) saturate(0)" },
  { id: "charcoal", name: "Charcoal", filter: "brightness(0.5)" },
  { id: "bronze", name: "Bronze", filter: "sepia(0.8) brightness(0.6)" },
];

const BalustradeVisualizer = () => {
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <section id="visualizer" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Visualize Your Balustrade
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how different styles and colors look on your deck. Choose a style and powder coat finish to preview your perfect balustrade.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Image Display */}
          <div className="relative mb-8 rounded-lg overflow-hidden shadow-2xl">
            <img
              src={selectedStyle.image}
              alt={`${selectedStyle.name} balustrade`}
              className="w-full h-auto transition-all duration-500"
              style={{ filter: selectedColor.filter }}
            />
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-sm">
              <p className="font-semibold text-foreground">{selectedStyle.name}</p>
              <p className="text-sm text-muted-foreground">{selectedColor.name} Finish</p>
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

          {/* Color Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Select Powder Coat Finish</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`p-4 rounded-sm border-2 transition-all duration-300 ${
                    selectedColor.id === color.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <div
                    className="w-full h-12 rounded-sm mb-2 border border-border"
                    style={{
                      background: color.id === "white" ? "#f5f5f5" :
                                  color.id === "silver" ? "#a8a8a8" :
                                  color.id === "charcoal" ? "#4a4a4a" :
                                  color.id === "bronze" ? "#8b6914" : "#1a1a1a"
                    }}
                  />
                  <p className="font-semibold text-sm text-foreground text-center">{color.name}</p>
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
