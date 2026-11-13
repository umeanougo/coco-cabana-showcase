import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";
import hero from "@/assets/hero-event.jpg";
// Stable references describe visible content only, not verified client/event identities.
export const gallery = [
  {
    id: "gallery-1",
    label: "Gallery image 1",
    src: p1,
    alt: "White flowers and greenery frame a draped outdoor arch beside gold-coloured chairs.",
  },
  {
    id: "gallery-2",
    label: "Gallery image 2",
    src: p2,
    alt: "Black and gold balloons above a white table with candles and black place settings.",
  },
  {
    id: "gallery-3",
    label: "Gallery image 3",
    src: p3,
    alt: "Round tables with tall floral arrangements and gold-coloured chairs under chandeliers and blue uplighting.",
  },
  {
    id: "gallery-4",
    label: "Gallery image 4",
    src: p4,
    alt: "Pink floral centrepiece with greenery above a table set with pink napkins and gold-coloured cutlery.",
  },
  {
    id: "gallery-5",
    label: "Gallery image 5",
    src: p5,
    alt: "White and gold balloons surround a pink draped backdrop and a gold-coloured display table.",
  },
  {
    id: "gallery-6",
    label: "Gallery image 6",
    src: p6,
    alt: "Two people stand in an outdoor lounge beneath string lights, surrounded by seating and candlelit tables.",
  },
  {
    id: "gallery-7",
    label: "Gallery image 7",
    src: hero,
    alt: "Candlelit reception tables with pink and white flowers, glassware and gold-coloured place settings.",
  },
] as const;
export const homeGallery = [gallery[0], gallery[1], gallery[5], gallery[2], gallery[4]];
