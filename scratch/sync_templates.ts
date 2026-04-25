import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual data from app/data.ts
const templatesToSync = [
  {
    id: "classic",
    name: "The Eternal Blush",
    description: "A romantic and sophisticated design featuring soft blush tones, delicate floral accents, and timeless typography.",
    theme: "Romantic Blush",
    cover_image_url: "https://res.cloudinary.com/dxoa3ashm/image/upload/q_auto/f_auto/v1775820733/Untitled_design_nalrft.jpg"
  },
  {
    id: "earthy",
    name: "The Earthy Botanical",
    description: "A warm, organic design featuring rich brown tones, tan accents, and delicate botanical line art.",
    theme: "Earthy Botanical",
    cover_image_url: "https://res.cloudinary.com/dnfbik3if/image/upload/q_auto/f_auto/v1776009671/earthy_l8luv4.jpg"
  },
  {
    id: "monochrome",
    name: "The Midnight Contrast",
    description: "A bold, high-contrast design with jagged torn paper edges and modern monochrome aesthetics.",
    theme: "Modern Monochrome",
    cover_image_url: "https://res.cloudinary.com/dnfbik3if/image/upload/q_auto/f_auto/v1776009818/1_sstux1.jpg"
  },
  {
    id: "icy",
    name: "Icy Royal Forest",
    description: "An ethereal winter design with arched frames, dusty blue roses, and frozen silver accents.",
    theme: "Icy Winter Tale",
    cover_image_url: "https://res.cloudinary.com/dnfbik3if/image/upload/q_auto/f_auto/v1776009817/2_lgtwrw.jpg"
  },
  {
    id: "homecoming",
    name: "Royal Homecoming",
    description: "A majestic red and gold theme featuring glassmorphism effects and a looping background video for a truly royal experience.",
    theme: "Royal Red & Gold",
    cover_image_url: "/homecoming.jpg"
  },
  {
    id: "weddingwalk",
    name: "Wedding Walk",
    description: "An ethereal white and gold theme featuring warm lighting, elegant floral arrangements, and a cinematic background video.",
    theme: "Elegant White & Gold",
    cover_image_url: "/weddingwalk.jpg"
  },
  {
    id: "aviation",
    name: "Love Airways",
    description: "A unique aviation-themed invitation styled like a passport and boarding pass for your forever journey.",
    theme: "Aviation & Travel",
    cover_image_url: "/aviation_cover.png"
  }
];

function getEnvVar(name: string) {
  const envPath = path.resolve(process.cwd(), '.env');
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  let content = '';
  if (fs.existsSync(envLocalPath)) content = fs.readFileSync(envLocalPath, 'utf8');
  else if (fs.existsSync(envPath)) content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(new RegExp(`${name}=(.*)`));
  return match ? match[1].trim() : null;
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function run() {
  console.log('Syncing templates...');
  for (const template of templatesToSync) {
    const { error } = await supabase
      .from('templates')
      .upsert({
        id: template.id,
        name: template.name,
        description: template.description,
        theme: template.theme,
        cover_image_url: template.cover_image_url,
        is_active: true
      });
    
    if (error) {
      console.error(`Error syncing ${template.id}:`, error);
    } else {
      console.log(`Synced ${template.id}`);
    }
  }
}

run();
