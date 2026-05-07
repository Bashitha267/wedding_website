
import { createClient } from '@supabase/supabase-js';

// These should be in your environment
const supabaseUrl = "https://djiywellxniauocehzyi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqaXl3ZWxseG5pYXVvY2VoenlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NDMwNjQsImV4cCI6MjA5MTUxOTA2NH0.j8TZtKySR5RPeYZDG26XTCPZTUKS8fPM2bp1Afiy5uQ";
const supabase = createClient(supabaseUrl, supabaseKey);

const templates = [
  { id: "classic", name: "The Eternal Blush", theme: "Romantic Blush" },
  { id: "earthy", name: "The Earthy Botanical", theme: "Earthy Botanical" },
  { id: "monochrome", name: "The Midnight Contrast", theme: "Modern Monochrome" },
  { id: "icy", name: "Icy Royal Forest", theme: "Icy Winter Tale" },
  { id: "homecoming", name: "Royal Homecoming", theme: "Royal Red & Gold" },
  { id: "weddingwalk", name: "Wedding Walk", theme: "Elegant White & Gold" },
  { id: "aviation", name: "Love Airways", theme: "Aviation & Travel" },
  { id: "christian", name: "Divine Grace", theme: "Heavenly White & Sky Blue" },
  { id: "poruwa", name: "Poruwa Tradition", theme: "Traditional Sri Lankan" },
  { id: "minimal", name: "The Luxe Minimalist", theme: "Minimal Luxury" },
  { id: "car", name: "Forever Journey", theme: "Vintage Romantic" },
  { id: "classic", name: "The Eternal Blush", theme: "Romantic Blush" },
  { id: "ceylon", name: "Ceylon Bliss", theme: "Ceylon Tradition" },
  { id: "fusion", name: "Culture Fusion", theme: "Fusion" },
  { id: "sydney", name: "Sydney Opera", theme: "Modern" },
  { id: "outback", name: "Outback Sunset", theme: "Rustic" },
  { id: "scrapbook", name: "Memory Scrapbook", theme: "Vintage" },
  { id: "classic", name: "The Eternal Blush", theme: "Romantic Blush" },
  { id: "kandyan", name: "Kandyan Splendor", theme: "Traditional" },
];

async function populate() {
  console.log("Populating templates...");
  for (const template of templates) {
    const { error } = await supabase.from('templates').upsert({
      id: template.id,
      name: template.name,
      theme: template.theme,
      is_active: true
    });
    if (error) console.error(`Error upserting ${template.id}:`, error);
    else console.log(`Successfully added/updated template: ${template.id}`);
  }
}

populate();
