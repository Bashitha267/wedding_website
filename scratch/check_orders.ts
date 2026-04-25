import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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
  const { data, error } = await supabase.from('orders').select('*').limit(5);
  if (error) console.error(error);
  else console.log('Orders sample:', data);
}
run();
