
import { createClient } from '@supabase/supabase-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTemplates() {
  const { data, error } = await supabase.from('templates').select('id');
  if (error) {
    console.error('Error fetching templates:', error);
    return;
  }
  console.log('Template IDs in database:', data.map(t => t.id));
}

checkTemplates();
