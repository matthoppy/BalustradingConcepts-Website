import { useState } from "react";
import { Button } from "@/components/ui/button";
import ascotBlack from "@/assets/balustrade-ascot-black.jpg";
import ascotSilver from "@/assets/balustrade-ascot-silver.jpg";
import ascotCharcoal from "@/assets/balustrade-ascot-charcoal.jpg";
import hamptonBlack from "@/assets/balustrade-hampton-black.jpg";
import hamptonSilver from "@/assets/balustrade-hampton-silver.jpg";
import hamptonCharcoal from "@/assets/balustrade-hampton-charcoal.jpg";
import spectraBlack from "@/assets/balustrade-spectra-black.jpg";
import spectraSilver from "@/assets/balustrade-spectra-silver.jpg";
import spectraCharcoal from "@/assets/balustrade-spectra-charcoal.jpg";
import finlineBlack from "@/assets/balustrade-finline-black.jpg";
import finlineSilver from "@/assets/balustrade-finline-silver.jpg";
import finlineCharcoal from "@/assets/balustrade-finline-charcoal.jpg";
import arenaBlack from "@/assets/balustrade-arena-black.jpg";
import arenaSilver from "@/assets/balustrade-arena-silver.jpg";
import arenaCharcoal from "@/assets/balustrade-arena-charcoal.jpg";

const styles = [
  { id: "ascot", name: "Ascot", description: "Horizontal slat design", images: { black: ascotBlack, silver: ascotSilver, charcoal: ascotCharcoal } },
  { id: "hampton", name: "Hampton", description: "Vertical fin design", images: { black: hamptonBlack, silver: hamptonSilver, charcoal: hamptonCharcoal } },
  { id: "spectra", name: "Spectra", description: "Framed glass panels", images: { black: spectraBlack, silver: spectraSilver, charcoal: spectraCharcoal } },
  { id: "finline", name: "Finline", description: "Postless vertical fins", images: { black: finlineBlack, silver: finlineSilver, charcoal: finlineCharcoal } },
  { id: "arena", name: "Arena", description: "Frameless glass standoffs", images: { black: arenaBlack, silver: arenaSilver, charcoal: arenaCharcoal } },
];

const colors = [
  { id: "black", name: "Black Matt", hex: "#1a1a1a" },
  { id: "silver", name: "Silver", hex: "#a8a8a8" },
  { id: "charcoal", name: "Charcoal", hex: "#4a4a4a" },
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
              src={selectedStyle.images[selectedColor.id]}
              alt={`${selectedStyle.name} balustrade in ${selectedColor.name}`}
              className="w-full h-auto transition-all duration-500"
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
            <div className="grid grid-cols-3 gap-3">
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
                    style={{ background: color.hex }}
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
