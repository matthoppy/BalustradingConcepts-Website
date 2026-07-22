import { Button } from "./ui/button";
import {
  coverStyles,
  sizesByStyle,
  powdercoatColours,
  type CoverSize,
} from "@/data/heatPumpCovers";

interface HeatPumpCoverConfiguratorProps {
  selectedStyle: string;
  selectedSizeIndex: number;
  selectedColour: string;
  onStyleChange: (style: string) => void;
  onSizeChange: (index: number) => void;
  onColourChange: (colour: string) => void;
}

/** Rough luminance check so pale colours still get a visible outline */
const isLight = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 190;
};

/** Isometric SVG drawing of the cover, scaled to the selected size. */
const CoverVisual = ({
  size,
  styleName,
  colourHex,
}: {
  size: CoverSize;
  styleName: string;
  colourHex: string;
}) => {
  const SCALE = 0.14;
  const w = size.width * SCALE;
  const h = size.height * SCALE;
  const d = size.depth * SCALE;
  const dx = d * 0.6;
  const dy = d * 0.35;

  const baseX = 64;
  const baseY = 268;
  const topY = baseY - h;

  const outline = isLight(colourHex) ? "#9ca3af" : colourHex;

  // Slat pattern across the front face, varying by style
  const slats: JSX.Element[] = [];
  if (styleName === "Futuna") {
    // Vertical slats, no toehold
    for (let x = baseX + 8; x < baseX + w - 4; x += 10) {
      slats.push(
        <line key={x} x1={x} y1={topY + 6} x2={x} y2={baseY - 6} stroke={colourHex} strokeOpacity="0.75" strokeWidth="3" />
      );
    }
  } else if (styleName === "Chatham") {
    // Wide flat panels with slim gaps
    for (let y = topY + 8; y < baseY - 10; y += 18) {
      slats.push(
        <rect key={y} x={baseX + 6} y={y} width={w - 12} height={13} fill={colourHex} fillOpacity="0.85" />
      );
    }
  } else {
    // Asko: classic horizontal louvres
    for (let y = topY + 10; y < baseY - 6; y += 11) {
      slats.push(
        <line key={y} x1={baseX + 6} y1={y} x2={baseX + w - 6} y2={y} stroke={colourHex} strokeOpacity="0.75" strokeWidth="4" />
      );
    }
  }

  const dimLine = "stroke-muted-foreground";
  const dimText = "fill-muted-foreground text-[13px] font-medium";

  // Depth dimension runs along the bottom angled edge of the side face,
  // offset perpendicular (down-right) so it sits just outside the cover.
  const edgeLen = Math.hypot(dx, dy);
  const offX = (dy / edgeLen) * 14;
  const offY = (dx / edgeLen) * 14;
  const d1 = { x: baseX + w + offX, y: baseY + offY };
  const d2 = { x: baseX + w + dx + offX, y: baseY - dy + offY };
  const depthAngle = (-Math.atan2(dy, dx) * 180) / Math.PI;
  const depthTextX = (d1.x + d2.x) / 2 + offX * 1.4;
  const depthTextY = (d1.y + d2.y) / 2 + offY * 1.4 + 4;

  return (
    <svg
      viewBox="0 0 400 310"
      className="w-full max-w-md mx-auto"
      role="img"
      aria-label={`${styleName} cover, ${size.width} by ${size.depth} by ${size.height} millimetres`}
    >
      {/* Top face */}
      <polygon
        points={`${baseX},${topY} ${baseX + dx},${topY - dy} ${baseX + dx + w},${topY - dy} ${baseX + w},${topY}`}
        fill={colourHex}
        fillOpacity="0.35"
        stroke={outline}
        strokeWidth="1.5"
      />
      {/* Side face */}
      <polygon
        points={`${baseX + w},${topY} ${baseX + w + dx},${topY - dy} ${baseX + w + dx},${baseY - dy} ${baseX + w},${baseY}`}
        fill={colourHex}
        fillOpacity="0.5"
        stroke={outline}
        strokeWidth="1.5"
      />
      {/* Front face */}
      <rect
        x={baseX}
        y={topY}
        width={w}
        height={h}
        fill={colourHex}
        fillOpacity="0.12"
        stroke={outline}
        strokeWidth="2"
        className="[transition:all_300ms]"
      />
      {slats}

      {/* Width dimension (below) */}
      <line x1={baseX} y1={baseY + 16} x2={baseX + w} y2={baseY + 16} className={dimLine} strokeWidth="1" />
      <line x1={baseX} y1={baseY + 10} x2={baseX} y2={baseY + 22} className={dimLine} strokeWidth="1" />
      <line x1={baseX + w} y1={baseY + 10} x2={baseX + w} y2={baseY + 22} className={dimLine} strokeWidth="1" />
      <text x={baseX + w / 2} y={baseY + 34} textAnchor="middle" className={dimText}>
        W {size.width} mm
      </text>

      {/* Height dimension (right) */}
      <line x1={baseX + w + dx + 14} y1={topY - dy} x2={baseX + w + dx + 14} y2={baseY - dy} className={dimLine} strokeWidth="1" />
      <line x1={baseX + w + dx + 8} y1={topY - dy} x2={baseX + w + dx + 20} y2={topY - dy} className={dimLine} strokeWidth="1" />
      <line x1={baseX + w + dx + 8} y1={baseY - dy} x2={baseX + w + dx + 20} y2={baseY - dy} className={dimLine} strokeWidth="1" />
      <text
        x={baseX + w + dx + 28}
        y={(topY - dy + baseY - dy) / 2}
        textAnchor="start"
        dominantBaseline="middle"
        className={dimText}
      >
        H {size.height} mm
      </text>

      {/* Depth dimension (along the bottom angled edge) */}
      <line x1={d1.x} y1={d1.y} x2={d2.x} y2={d2.y} className={dimLine} strokeWidth="1" />
      <line
        x1={d1.x - offX * 0.4}
        y1={d1.y - offY * 0.4}
        x2={d1.x + offX * 0.4}
        y2={d1.y + offY * 0.4}
        className={dimLine}
        strokeWidth="1"
      />
      <line
        x1={d2.x - offX * 0.4}
        y1={d2.y - offY * 0.4}
        x2={d2.x + offX * 0.4}
        y2={d2.y + offY * 0.4}
        className={dimLine}
        strokeWidth="1"
      />
      <text
        x={depthTextX}
        y={depthTextY}
        textAnchor="middle"
        className={dimText}
        transform={`rotate(${depthAngle}, ${depthTextX}, ${depthTextY})`}
      >
        D {size.depth} mm
      </text>
    </svg>
  );
};

const HeatPumpCoverConfigurator = ({
  selectedStyle,
  selectedSizeIndex,
  selectedColour,
  onStyleChange,
  onSizeChange,
  onColourChange,
}: HeatPumpCoverConfiguratorProps) => {
  const style = coverStyles.find((s) => s.name === selectedStyle) ?? coverStyles[0];
  const sizes = sizesByStyle[style.name];
  const size = sizes[Math.min(selectedSizeIndex, sizes.length - 1)];
  const colour = powdercoatColours.find((c) => c.name === selectedColour) ?? powdercoatColours[0];

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Selectors */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">1. Choose your style</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {coverStyles.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => onStyleChange(s.name)}
              className={`p-4 border text-left transition-colors duration-200 ${
                selectedStyle === s.name
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
              aria-pressed={selectedStyle === s.name}
            >
              <span className="block font-bold text-card-foreground">{s.name}</span>
              <span className="block text-sm text-primary">{s.tagline}</span>
            </button>
          ))}
        </div>
        <p className="text-muted-foreground text-sm mb-2 leading-relaxed">{style.description}</p>
        {style.detail && (
          <p className="text-muted-foreground text-xs mb-6 leading-relaxed">{style.detail}</p>
        )}

        <h3 className="text-xl font-bold text-foreground mb-4 mt-6">2. Choose your size</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {sizes.map((s, i) => (
            <button
              key={s.name}
              type="button"
              onClick={() => onSizeChange(i)}
              className={`p-3 border text-left transition-colors duration-200 ${
                selectedSizeIndex === i
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
              aria-pressed={selectedSizeIndex === i}
            >
              <span className="block text-sm font-bold text-card-foreground">{s.name}</span>
              <span className="block text-xs text-muted-foreground">
                {s.width} x {s.depth} x {s.height} mm
              </span>
              <span className="block text-xs text-muted-foreground/70">{s.code}</span>
            </button>
          ))}
        </div>

        <h3 className="text-xl font-bold text-foreground mb-4">3. Choose your colour</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          {powdercoatColours.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => onColourChange(c.name)}
              title={c.name}
              aria-label={c.name}
              aria-pressed={selectedColour === c.name}
              className={`w-10 h-10 rounded-full border-2 transition-transform duration-200 ${
                selectedColour === c.name
                  ? "border-primary scale-110 ring-2 ring-primary/40"
                  : "border-border hover:scale-105"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <p className="text-muted-foreground text-sm mb-1">
          Selected: <span className="font-medium text-foreground">{colour.name}</span>
        </p>
        <p className="text-muted-foreground text-xs leading-relaxed">
          A selection of popular Dulux powdercoat colours — 25 standard colours available, plus custom
          colours on request. On-screen swatches are indicative only; we confirm your colour from physical
          samples.
        </p>
      </div>

      {/* Live visual */}
      <div className="bg-card border border-border p-6 sm:p-8">
        <div className="text-center mb-2">
          <span className="text-lg font-bold text-card-foreground">{style.name}</span>
          <span className="text-muted-foreground"> — {size.name}</span>
          <span className="text-muted-foreground text-sm"> ({size.code})</span>
        </div>
        <CoverVisual size={size} styleName={style.name} colourHex={colour.hex} />
        <div className="text-center mt-4 space-y-1">
          <p className="text-foreground font-medium">
            Cover: {size.width} x {size.depth} x {size.height} mm (W x D x H) — {colour.name}
          </p>
          <p className="text-muted-foreground text-sm">
            Max heat pump size: {size.maxUnit.width} x {size.maxUnit.depth} x {size.maxUnit.height} mm,
            including pipework and mounting blocks
          </p>
          <p className="text-muted-foreground text-xs">
            Custom sizes also available on request.
          </p>
        </div>
        <div className="mt-6">
          <Button asChild className="w-full">
            <a href="#quote">Get a quote for this configuration</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeatPumpCoverConfigurator;
