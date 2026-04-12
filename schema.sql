-- Clean up existing tables and functions to start fresh
DROP FUNCTION IF EXISTS verify_user;
DROP VIEW IF EXISTS rsvp_table_assignments;
DROP TABLE IF EXISTS rsvps CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Supabase Database Schema

-- 1. Users Table (Admin and Clients)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'client')),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Templates Table (For the product showcase and metadata)
CREATE TABLE templates (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'template_1', 'template_2'
    name VARCHAR(100) NOT NULL, -- e.g., 'The Eternal Blush'
    description TEXT,
    theme VARCHAR(50),
    cover_image_url TEXT, -- The image the admin uploads for the catalog
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255),
    client_username VARCHAR(100) REFERENCES users(username) ON DELETE SET NULL, 
    -- Null when pending/unassigned. Links to the user account created by admin
    slug VARCHAR(255) UNIQUE, -- e.g., 'akashandchamudi' for the URL route
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed')),
    template_id VARCHAR(50) NOT NULL REFERENCES templates(id), -- e.g., 'template_1'
    
    -- Template Data stored as JSONB for flexibility (images, dates, locations, music, timeline)
    template_data JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RSVPs Table
CREATE TABLE rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    table_number VARCHAR(10), -- Can be assigned later by the client
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Create a view to see RSVPs with their table assignments
CREATE VIEW rsvp_table_assignments AS
SELECT 
    r.order_id,
    r.table_number,
    json_agg(json_build_object('name', r.name, 'contact', r.contact_number)) as guests
FROM rsvps r
WHERE r.table_number IS NOT NULL
GROUP BY r.order_id, r.table_number;

-- ==========================================
-- TEST DATA INSERTIONS (Using pgcrypto)
-- ==========================================

-- Enable pgcrypto extension if not already enabled (Supabase includes it by default)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert Admin
INSERT INTO users (username, password_hash, role, name) 
VALUES (
  'admin', 
  crypt('admin123', gen_salt('bf')), 
  'admin', 
  'System Administrator'
);

-- Insert Client
INSERT INTO users (username, password_hash, role, name) 
VALUES (
  'client', 
  crypt('client123', gen_salt('bf')), 
  'client', 
  'Test Client'
);

-- Insert Template 1 (From data.ts)
INSERT INTO templates (id, name, description, theme, cover_image_url) 
VALUES (
  'classic', 
  'The Classic Elegance', 
  'A beautiful, romantic and sophisticated design featuring classic elements.', 
  'Classic Romantic', 
  'https://res.cloudinary.com/dxoa3ashm/image/upload/q_auto/f_auto/v1775820733/Untitled_design_nalrft.jpg'
);

-- Insert Sample Order for 'akashandchamudi' 
-- This embeds the exact structure of your wedding template JSON!
INSERT INTO orders (customer_name, client_username, slug, status, template_id, template_data)
VALUES (
  'Akash & Chamudi Wedding',
  'client',
  'akashandchamudi',
  'completed',
  'classic',
  '{
    "brideName": "Chamudi",
    "groomName": "Akash",
    "eventDate": "2026-12-15T15:00:00Z",
    "location": {
      "name": "Hotel Regina Resort",
      "address": "123 Wedding Blvd",
      "mapUrl": "https://maps.google.com/..."
    },
    "musicUrl": "https://open.spotify.com/track/...",
    "images": {
      "heroImage": "https://example.com/hero.jpg",
      "thankYouImage": "/photo_5.png",
      "gallery": ["https://example.com/g1.jpg", "https://example.com/g2.jpg"]
    },
    "timeline": [
      { "time": "3:00 PM", "title": "Ceremony", "location": "The Rose Garden" },
      { "time": "4:30 PM", "title": "Cocktails", "location": "Main Terrace" },
      { "time": "6:00 PM", "title": "Dinner", "location": "Victoria Hall" },
      { "time": "9:00 PM", "title": "Party", "location": "Dance Floor" }
    ]
  }'::jsonb
);

-- ==========================================
-- SECURE LOGIN RPC FUNCTION
-- ==========================================
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
    RETURN json_build_object(
      'success', true, 
      'user', json_build_object('id', v_user.id, 'role', v_user.role, 'name', v_user.name, 'username', v_user.username)
    );
  ELSE
    RETURN json_build_object('success', false, 'message', 'Invalid username or password');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- CHECKOUT / CREATE ORDER RPC FUNCTION
-- ==========================================
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

  -- 2. Create the order
  INSERT INTO orders (customer_name, client_username, slug, status, template_id, template_data)
  VALUES (p_name, p_username, p_slug, 'pending', p_template_id, '{}'::jsonb)
  RETURNING id INTO v_order_id;

  -- (Optional: Save contact number somewhere if you add it to users or another table, but for now we rely on RSVP numbers or just drop it)
  
  RETURN json_build_object('success', true, 'order_id', v_order_id);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
