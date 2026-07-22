// ScreenPro standard sizes, taken from the official style pages
// (screenpro.nz/asko-heat-pump-cover, /chatham-heat-pump-cover,
// /futuna-heat-pump-cover). All three styles share the same six cover
// dimensions; size codes differ by style prefix (SCAA / SCAC / SCAF).

export interface CoverStyle {
  name: string;
  tagline: string;
  description: string;
  detail?: string;
}

export interface CoverSize {
  name: string;
  code: string;
  /** External cover dimensions in mm (W x D x H) */
  width: number;
  depth: number;
  height: number;
  /** Maximum heat pump unit size in mm (W x D x H), incl. pipework/mounting blocks */
  maxUnit: { width: number; depth: number; height: number };
}

export const coverStyles: CoverStyle[] = [
  {
    name: "Asko",
    tagline: "Great value",
    description:
      "A high-functioning aluminium cover offering excellent value — tidy, effective concealment with ventilation louvres to keep your unit running efficiently.",
    detail: "Louvre blades: 70 x 32 mm (H x D) Zed blade at 85–90 mm centres.",
  },
  {
    name: "Chatham",
    tagline: "Premium & minimal",
    description:
      "A premium look with minimal visibility, ideal for modern spaces where sleek, understated design matters. Selected non-standard sizes available.",
    detail: "Louvre blades: 75 x 30 mm (H x D) Zed blade at 75 mm centres.",
  },
  {
    name: "Futuna",
    tagline: "Maximum security",
    description:
      "Maximum security with a no-toehold design, ideal for balconies or areas with children where safety is the priority. Selected non-standard sizes available.",
    detail: "Slats: 50 x 16 mm (W x D) vertical slats at 75 mm centres.",
  },
];

interface BaseSize {
  name: string;
  codeSuffix: string;
  width: number;
  depth: number;
  height: number;
  maxUnit: { width: number; depth: number; height: number };
}

const baseSizes: BaseSize[] = [
  {
    name: "Small",
    codeSuffix: "NF0725",
    width: 1025,
    depth: 425,
    height: 725,
    maxUnit: { width: 900, depth: 335, height: 700 },
  },
  {
    name: "Small Plus",
    codeSuffix: "NF0875",
    width: 1025,
    depth: 425,
    height: 875,
    maxUnit: { width: 900, depth: 335, height: 850 },
  },
  {
    name: "Medium",
    codeSuffix: "OG0875",
    width: 1100,
    depth: 500,
    height: 875,
    maxUnit: { width: 975, depth: 410, height: 850 },
  },
  {
    name: "Medium Plus",
    codeSuffix: "OG1025",
    width: 1100,
    depth: 500,
    height: 1025,
    maxUnit: { width: 975, depth: 410, height: 1000 },
  },
  {
    name: "Medium Extra",
    codeSuffix: "OG1175",
    width: 1100,
    depth: 500,
    height: 1175,
    maxUnit: { width: 975, depth: 410, height: 1150 },
  },
  {
    name: "Large",
    codeSuffix: "PG1475",
    width: 1175,
    depth: 500,
    height: 1475,
    maxUnit: { width: 1050, depth: 410, height: 1450 },
  },
];

const codePrefixes: Record<string, string> = {
  Asko: "SCAA",
  Chatham: "SCAC",
  Futuna: "SCAF",
};

const sizesFor = (styleName: string): CoverSize[] =>
  baseSizes.map(({ codeSuffix, ...rest }) => ({
    ...rest,
    code: `${codePrefixes[styleName]}-${codeSuffix}`,
  }));

export const sizesByStyle: Record<string, CoverSize[]> = {
  Asko: sizesFor("Asko"),
  Chatham: sizesFor("Chatham"),
  Futuna: sizesFor("Futuna"),
};

export const sizeLabel = (styleName: string, size: CoverSize) =>
  `${styleName} ${size.name} (${size.code}) — ${size.width} x ${size.depth} x ${size.height} mm`;

// Representative Dulux powdercoat colours (hex values indicative only —
// final colour confirmed from physical swatches at quote stage).
export interface PowdercoatColour {
  name: string;
  hex: string;
}

export const powdercoatColours: PowdercoatColour[] = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "Ironsand", hex: "#3e3c38" },
  { name: "Grey Friars", hex: "#4a4e54" },
  { name: "Karaka", hex: "#2e352c" },
  { name: "Lignite", hex: "#4d453a" },
  { name: "Scoria", hex: "#5a3c38" },
  { name: "New Denim Blue", hex: "#34455e" },
  { name: "Sandstone Grey", hex: "#7d7365" },
  { name: "Windsor Grey", hex: "#9a9a94" },
  { name: "Desert Sand", hex: "#c5b8a0" },
  { name: "Titania", hex: "#e8e3d5" },
  { name: "White", hex: "#f5f5f0" },
];
