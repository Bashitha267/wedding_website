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
    image: "https://res.cloudinary.com/dnfbik3if/image/upload/v1779136389/Screenshot_2026-05-19_015847_ja9yls.png",
    description: "A romantic and sophisticated design featuring soft blush tones, delicate floral accents, and timeless typography.",
    theme: "Romantic Blush"
  },
  {
    id: "earthy",
    name: "The Earthy Botanical",
    image: "https://res.cloudinary.com/dnfbik3if/image/upload/v1779136389/Screenshot_2026-05-19_020018_itu9x6.png", // Using the generated image for now as a placeholder
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
    image: "https://res.cloudinary.com/dnfbik3if/image/upload/v1779136389/Screenshot_2026-05-19_020035_rordri.png",
    description: "An ethereal winter design with arched frames, dusty blue roses, and frozen silver accents.",
    theme: "Icy Winter Tale"
  },
  {
    id: "homecoming",
    name: "Royal Homecoming",
    image: "/homecoming.jpg",
    description: "A majestic red and gold theme featuring glassmorphism effects and a looping background video for a truly royal experience.",
    theme: "Royal Red & Gold"
  },
  {
    id: "weddingwalk",
    name: "Wedding Walk",
    image: "/weddingwalk.jpg",
    description: "An ethereal white and gold theme featuring warm lighting, elegant floral arrangements, and a cinematic background video.",
    theme: "Elegant White & Gold"
  },
  {
    id: "aviation",
    name: "Love Airways",
    image: "/aviation_cover.png",
    description: "A unique aviation-themed invitation styled like a passport and boarding pass for your forever journey.",
    theme: "Aviation & Travel"
  },
  {
    id: "christian",
    name: "Divine Grace",
    image: "/christianweddingimg.jpg",
    description: "A serene and ethereal design inspired by sacred unions, featuring heavenly white and sky blue accents with a cinematic church background video.",
    theme: "Heavenly White & Sky Blue"
  },
  {
    id: "poruwa",
    name: "Poruwa Tradition",
    image: "/poruwa_final_clean.png",
    description: "A traditional Sri Lankan Sinhala Poruwa wedding template with rich gold and maroon tones, featuring a serene background video of the Poruwa ceremony.",
    theme: "Traditional Sri Lankan"
  },
  {
    id: "minimal",
    name: "The Luxe Minimalist",
    image: "https://res.cloudinary.com/dnfbik3if/image/upload/v1779136454/Screenshot_2026-05-19_020400_o6v70q.png",
    description: "A sophisticated, high-end minimalist design inspired by modern Italian weddings. Features a personalized wax seal, elegant serif typography, and a refined ivory palette.",

    theme: "Minimal Luxury"
  },
  {
    id: "car",
    name: "Forever Journey",
    image: "/templates/car/hero.png",
    description: "A vintage-inspired romantic template featuring a classic red convertible car, scenic sunset views, and a charming wooden signpost theme.",
    theme: "Vintage Romantic"
  }
];

