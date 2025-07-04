/*
  # Add rating system and monthly metrics support

  1. Schema Changes
    - Add `rating` column to `candidates` table (1-5 scale with validation)
    - The `offers` and `exits` tables already exist in the schema
    - Add RLS policies for existing tables if they don't have them

  2. Security
    - Enable RLS on existing tables if not already enabled
    - Add policies for anonymous and authenticated access

  3. Sample Data
    - Insert sample data using existing table structures
*/

-- Add rating column to candidates table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'candidates' AND column_name = 'rating'
  ) THEN
    ALTER TABLE candidates ADD COLUMN rating integer CHECK (rating >= 1 AND rating <= 5);
  END IF;
END $$;

-- The offers and exits tables already exist, so we'll work with them
-- Enable RLS on offers table if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'offers' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Enable RLS on exits table if not already enabled  
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'exits' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE exits ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies for offers table (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'offers' 
    AND policyname = 'Allow anonymous and authenticated to read offers'
  ) THEN
    CREATE POLICY "Allow anonymous and authenticated to read offers"
      ON offers
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'offers' 
    AND policyname = 'Allow anonymous and authenticated to insert offers'
  ) THEN
    CREATE POLICY "Allow anonymous and authenticated to insert offers"
      ON offers
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'offers' 
    AND policyname = 'Allow anonymous and authenticated to update offers'
  ) THEN
    CREATE POLICY "Allow anonymous and authenticated to update offers"
      ON offers
      FOR UPDATE
      TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'offers' 
    AND policyname = 'Allow anonymous and authenticated to delete offers'
  ) THEN
    CREATE POLICY "Allow anonymous and authenticated to delete offers"
      ON offers
      FOR DELETE
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- Create policies for exits table (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exits' 
    AND policyname = 'Allow anonymous and authenticated to read exits'
  ) THEN
    CREATE POLICY "Allow anonymous and authenticated to read exits"
      ON exits
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exits' 
    AND policyname = 'Allow anonymous and authenticated to insert exits'
  ) THEN
    CREATE POLICY "Allow anonymous and authenticated to insert exits"
      ON exits
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exits' 
    AND policyname = 'Allow anonymous and authenticated to update exits'
  ) THEN
    CREATE POLICY "Allow anonymous and authenticated to update exits"
      ON exits
      FOR UPDATE
      TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exits' 
    AND policyname = 'Allow anonymous and authenticated to delete exits'
  ) THEN
    CREATE POLICY "Allow anonymous and authenticated to delete exits"
      ON exits
      FOR DELETE
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- Insert sample data into offers table using existing schema
-- The offers table has columns: id, candidate_name, offer_date, status
INSERT INTO offers (candidate_name, offer_date, status) VALUES
  ('Priya Sharma', '2025-01-10', 'Joined'),
  ('Raj Patel', '2025-01-12', 'Accepted'),
  ('Sneha Gupta', '2025-01-08', 'Joined'),
  ('Arjun Mehta', '2025-01-14', 'Accepted'),
  ('Kavya Singh', '2025-01-05', 'Joined')
ON CONFLICT (id) DO NOTHING;

-- Insert sample data into exits table using existing schema  
-- The exits table has columns: id, name, role, exit_date
INSERT INTO exits (name, role, exit_date) VALUES
  ('Rohit Kumar', 'Software Engineer', '2025-01-10'),
  ('Anita Desai', 'Product Manager', '2025-01-15'),
  ('Vikram Singh', 'Sales Executive', '2025-01-20')
ON CONFLICT (id) DO NOTHING;