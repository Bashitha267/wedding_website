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
    image: "https://res.cloudinary.com/dxoa3ashm/image/upload/q_auto/f_auto/v1775820733/Untitled_design_nalrft.jpg", // Placeholder for now
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
  }
];
