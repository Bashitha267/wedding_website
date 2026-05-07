
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://djiywellxniauocehzyi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqaXl3ZWxseG5pYXVvY2VoenlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NDMwNjQsImV4cCI6MjA5MTUxOTA2NH0.j8TZtKySR5RPeYZDG26XTCPZTUKS8fPM2bp1Afiy5uQ";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (error) {
    console.error('Error fetching order:', error);
    return;
  }
  if (data.length > 0) {
    console.log('Columns in orders table:', Object.keys(data[0]));
  } else {
    console.log('Orders table is empty, cannot check columns this way.');
  }
}

checkColumns();
