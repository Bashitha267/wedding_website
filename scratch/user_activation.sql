-- Add is_active column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;

-- Update verify_user to check for activation
CREATE OR REPLACE FUNCTION verify_user(p_username TEXT, p_password TEXT)
RETURNS JSON AS $$
DECLARE
  v_user users%ROWTYPE;
BEGIN
  -- We query the user and use strictly Postgres' built in crypt() to compare the text password against the hashed string
  SELECT * INTO v_user
  FROM users
  WHERE username = p_username AND password_hash = crypt(p_password, password_hash);

  IF FOUND THEN
    IF v_user.is_active = false AND v_user.role = 'client' THEN
      RETURN json_build_object('success', false, 'message', 'Your account is pending admin approval.');
    ELSE
      RETURN json_build_object(
        'success', true, 
        'user', json_build_object('id', v_user.id, 'role', v_user.role, 'name', v_user.name, 'username', v_user.username)
      );
    END IF;
  ELSE
    RETURN json_build_object('success', false, 'message', 'Invalid username or password');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
