import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Import the actual classic template from your project!
import ClassicTemplate from '@/app/templates/classic/page';
import EarthyTemplate from '@/app/templates/earthy/page';
import MonochromeTemplate from '@/app/templates/monochrome/page';
import IcyTemplate from '@/app/templates/icy/page';
import ScrapbookTemplate from '@/app/templates/scrapbook/page';
import KandyanTemplate from '@/app/templates/kandyan/page';
import OutbackTemplate from '@/app/templates/outback/page';
import CeylonTemplate from '@/app/templates/ceylon/page';
import SydneyTemplate from '@/app/templates/sydney/page';
import FusionTemplate from '@/app/templates/fusion/page';
import HomecomingTemplate from '@/app/templates/homecoming/page';


// We map template IDs from the database to the actual React Components
const templateMap: Record<string, React.ElementType> = {
  'classic': ClassicTemplate,
  'earthy': EarthyTemplate,
  'monochrome': MonochromeTemplate,
  'icy': IcyTemplate,
  'scrapbook': ScrapbookTemplate,
  'kandyan': KandyanTemplate,
  'outback': OutbackTemplate,
  'ceylon': CeylonTemplate,
  'sydney': SydneyTemplate,
  'fusion': FusionTemplate,
  'homecoming': HomecomingTemplate,

};

type Props = {
  params: Promise<{ slug: string }>;
}

export default async function InvitationPage(props: Props) {
  const params = await props.params;
  const slug = params.slug;

  // 1. Query Supabase for an order matching this exact URL slug
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('slug', slug)
    .single();

  // 2. If the slug doesn't exist in the database, show the Next.js 404 page
  if (error || !order) {
    notFound(); 
  }

  // 3. Find which component to render based on the 'template_id' saved in Supabase
  const TemplateComponent = templateMap[order.template_id];

  if (!TemplateComponent) {
    return <div>Error: Template format {order.template_id} is missing or broken.</div>;
  }

  // 4. Render the chosen template! 
  // Custom templates receive their JSON data and the orderId (for RSVPs)
  return <TemplateComponent data={order.template_data} orderId={order.id} />;
}
