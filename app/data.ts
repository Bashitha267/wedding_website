export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  theme: string;
}

export const templates: Product[] = [
  {
    id: "1",
    name: "The Eternal Blush",
    image: "https://res.cloudinary.com/dxoa3ashm/image/upload/q_auto/f_auto/v1775820733/Untitled_design_nalrft.jpg",
    description: "A romantic and sophisticated design featuring soft blush tones, delicate floral accents, and timeless typography.",
    theme: "Romantic Blush"
  }
];
