-- Function to approve a client and their order
CREATE OR REPLACE FUNCTION approve_client(p_username TEXT, p_order_id UUID)
RETURNS JSON AS $$
BEGIN
  -- 1. Activate the user
  UPDATE users SET is_active = true WHERE username = p_username;
  
  -- 2. Mark the order as completed
  UPDATE orders SET status = 'completed' WHERE id = p_order_id;
  
  RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
