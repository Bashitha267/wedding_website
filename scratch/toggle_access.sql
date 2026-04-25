-- Function to toggle access for a client
CREATE OR REPLACE FUNCTION toggle_order_access(p_username TEXT, p_order_id UUID, p_is_active BOOLEAN)
RETURNS JSON AS $$
BEGIN
  -- 1. Toggle user activation
  UPDATE users SET is_active = p_is_active WHERE username = p_username;
  
  -- 2. Toggle order status
  UPDATE orders SET status = CASE WHEN p_is_active THEN 'completed' ELSE 'pending' END WHERE id = p_order_id;
  
  RETURN json_build_object('success', true, 'new_status', p_is_active);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION toggle_order_access(TEXT, UUID, BOOLEAN) TO anon, authenticated;
