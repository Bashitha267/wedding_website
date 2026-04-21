-- Supabase SQL Alter command to support children and adult counts in RSVPs
ALTER TABLE rsvps 
ADD COLUMN adult_count INTEGER DEFAULT 1,
ADD COLUMN children_count INTEGER DEFAULT 0;
