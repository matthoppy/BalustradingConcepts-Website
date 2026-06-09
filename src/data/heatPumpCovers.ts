// ScreenPro standard sizes. The Asko table (size codes, cover sizes and max
// heat pump sizes) is taken from screenpro.nz/asko-heat-pump-cover/.
// Chatham and Futuna use the same dimensions as placeholders until their
// official tables are supplied — marked unconfirmed below.

export interface CoverStyle {
  name: string;
  tagline: string;
  description: string;
  detail?: string;
  /** True when the size table below is the official published one */
  sizesConfirmed: boolean;
}

export interface CoverSize {
  name: string;
  code?: string;
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
    sizesConfirmed: true,
  },
  {
    name: "Chatham",
    tagline: "Premium & minimal",
    description:
      "A premium look with minimal visibility, ideal for modern spaces where sleek, understated design matters. Selected non-standard sizes available.",
    sizesConfirmed: false,
  },
  {
    name: "Futuna",
    tagline: "Maximum security",
    description:
      "Maximum security with a no-toehold design, ideal for balconies or areas with children where safety is the priority. Selected non-standard sizes available.",
    sizesConfirmed: false,
  },
];

const askoSizes: CoverSize[] = [
  {
    name: "Small",
    code: "SCAA-NF0725",
    width: 1025,
    depth: 425,
    height: 725,
    maxUnit: { width: 900, depth: 335, height: 700 },
  },
  {
    name: "Small Plus",
    code: "SCAA-NF0875",
    width: 1025,
    depth: 425,
    height: 875,
    maxUnit: { width: 900, depth: 335, height: 850 },
  },
  {
    name: "Medium",
    code: "SCAA-OG0875",
    width: 1100,
    depth: 500,
    height: 875,
    maxUnit: { width: 975, depth: 410, height: 850 },
  },
  {
    name: "Medium Plus",
    code: "SCAA-OG1025",
    width: 1100,
    depth: 500,
    height: 1025,
    maxUnit: { width: 975, depth: 410, height: 1000 },
  },
  {
    name: "Medium Extra",
    code: "SCAA-OG1175",
    width: 1100,
    depth: 500,
    height: 1175,
    maxUnit: { width: 975, depth: 410, height: 1150 },
  },
  {
    name: "Large",
    code: "SCAA-PG1475",
    width: 1175,
    depth: 500,
    height: 1475,
    maxUnit: { width: 1050, depth: 410, height: 1450 },
  },
];

// Same dimensions reused without Asko's size codes until official tables arrive
const unconfirmedSizes: CoverSize[] = askoSizes.map(({ code: _code, ...rest }) => ({ ...rest }));

export const sizesByStyle: Record<string, CoverSize[]> = {
  Asko: askoSizes,
  Chatham: unconfirmedSizes,
  Futuna: unconfirmedSizes,
};

export const sizeLabel = (styleName: string, size: CoverSize) =>
  `${styleName} ${size.name}${size.code ? ` (${size.code})` : ""} — ${size.width} x ${size.depth} x ${size.height} mm`;
