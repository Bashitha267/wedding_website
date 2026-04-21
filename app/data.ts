export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  theme: string;
}

export const templates: Product[] = [
  {
    id: "classic",
    name: "The Eternal Blush",
    image: "https://res.cloudinary.com/dxoa3ashm/image/upload/q_auto/f_auto/v1775820733/Untitled_design_nalrft.jpg",
    description: "A romantic and sophisticated design featuring soft blush tones, delicate floral accents, and timeless typography.",
    theme: "Romantic Blush"
  },
  {
    id: "earthy",
    name: "The Earthy Botanical",
    image: "https://res.cloudinary.com/dnfbik3if/image/upload/q_auto/f_auto/v1776009671/earthy_l8luv4.jpg", // Using the generated image for now as a placeholder
    description: "A warm, organic design featuring rich brown tones, tan accents, and delicate botanical line art.",
    theme: "Earthy Botanical"
  },
  {
    id: "monochrome",
    name: "The Midnight Contrast",
    image: "https://res.cloudinary.com/dnfbik3if/image/upload/q_auto/f_auto/v1776009818/1_sstux1.jpg", // Placeholder for now
    description: "A bold, high-contrast design with jagged torn paper edges and modern monochrome aesthetics.",
    theme: "Modern Monochrome"
  },
  {
    id: "icy",
    name: "Icy Royal Forest",
    image: "https://res.cloudinary.com/dnfbik3if/image/upload/q_auto/f_auto/v1776009817/2_lgtwrw.jpg",
    description: "An ethereal winter design with arched frames, dusty blue roses, and frozen silver accents.",
    theme: "Icy Winter Tale"
  },
  {
    id: "scrapbook",
    name: "The Blue Gallery",
    image: "https://res.cloudinary.com/dnfbik3if/image/upload/q_auto/f_auto/v1776009818/3_seoqup.jpg",
    description: "A nostalgic scrapbook design with polaroid photos, paper clips, and sky blue accents.",
    theme: "Nostalgic Scrapbook"
  },
  {
    id: "kandyan",
    name: "Golden Kandyan Heritage",
    image: "https://res.cloudinary.com/dnfbik3if/image/upload/v1776770793/Untitled_design_1_ipwqq5.jpg",
    description: "A regal Sri Lankan design inspired by the Kandyan kingdom, featuring gold motifs, royal red silk textures, and traditional elegance.",
    theme: "Royal Kandyan"
  },
  {
    id: "outback",
    name: "Rustic Outback Charm",
    image: "/rustic_outback_template_cover_1776328692588.png",
    description: "A warm Australian rustic theme with eucalyptus leaves, gumnuts, and earthy wood textures for a sun-kissed wedding feel.",
    theme: "Australian Rustic"
  },
  {
    id: "ceylon",
    name: "Tropical Ceylon Pearl",
    image: "/tropical_ceylon_template_cover_1776328713267.png",
    description: "A bright and airy Sri Lankan coastal design featuring lush palm fronds, white lotus flowers, and serene turquoise accents.",
    theme: "Tropical Ceylon"
  },
  {
    id: "sydney",
    name: "Modern Sydney Skyline",
    image: "/modern_sydney_template_cover_1776328745560.png",
    description: "A sleek and sophisticated Australian urban theme with navy blue and gold accents, echoing modern architectural elegance.",
    theme: "Modern Sydney"
  },
  {
    id: "fusion",
    name: "Lotus & Eucalyptus Fusion",
    image: "/lotus_eucalyptus_fusion_cover_1776328765494.png",
    description: "A harmonious blend of Sri Lankan and Australian flora, featuring delicate lotus flowers and eucalyptus leaves in a soft watercolor style.",
    theme: "Cultural Fusion"
  }
];
