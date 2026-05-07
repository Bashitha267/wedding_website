
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://djiywellxniauocehzyi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqaXl3ZWxseG5pYXVvY2VoenlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NDMwNjQsImV4cCI6MjA5MTUxOTA2NH0.j8TZtKySR5RPeYZDG26XTCPZTUKS8fPM2bp1Afiy5uQ";
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateRPC() {
  const sql = `
CREATE OR REPLACE FUNCTION checkout_order(
  p_name TEXT,
  p_slug TEXT,
  p_contact TEXT,
  p_username TEXT,
  p_password TEXT,
  p_template_id TEXT
) RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_order_id UUID;
BEGIN
  -- 1. Create the user
  INSERT INTO users (username, password_hash, role, name)
  VALUES (p_username, crypt(p_password, gen_salt('bf')), 'client', p_name)
  RETURNING id INTO v_user_id;

  -- 2. Create the order (NOW INCLUDING customer_phone)
  INSERT INTO orders (customer_name, client_username, slug, status, template_id, template_data, customer_phone)
  VALUES (p_name, p_username, p_slug, 'pending', p_template_id, '{}'::jsonb, p_contact)
  RETURNING id INTO v_order_id;

  RETURN json_build_object('success', true, 'order_id', v_order_id);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
  `;
  
  // Note: supabase-js doesn't have a direct 'sql' execution method for anon/service role.
  // We usually do this via the dashboard or a migration.
  // But I can try to use the 'rpc' method if there's an 'exec_sql' function, but there isn't by default.
  
  console.log("Please run the following SQL in your Supabase SQL Editor:");
  console.log(sql);
}

updateRPC();
