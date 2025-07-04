/*
  # Create ta_owners table

  1. New Tables
    - `ta_owners` - Store TA owner names with unique constraint

  2. Security
    - Enable RLS on `ta_owners` table
    - Add policies for authenticated users (with IF NOT EXISTS checks)

  3. Initial Data
    - Insert default TA owners
*/

-- Create ta_owners table
CREATE TABLE IF NOT EXISTS ta_owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE ta_owners ENABLE ROW LEVEL SECURITY;

-- Create policies with conditional checks to avoid conflicts
DO $$
BEGIN
  -- Check and create SELECT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ta_owners' 
    AND policyname = 'Users can read all ta_owners'
  ) THEN
    CREATE POLICY "Users can read all ta_owners"
      ON ta_owners
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Check and create INSERT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ta_owners' 
    AND policyname = 'Users can insert ta_owners'
  ) THEN
    CREATE POLICY "Users can insert ta_owners"
      ON ta_owners
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Check and create UPDATE policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ta_owners' 
    AND policyname = 'Users can update ta_owners'
  ) THEN
    CREATE POLICY "Users can update ta_owners"
      ON ta_owners
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  -- Check and create DELETE policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ta_owners' 
    AND policyname = 'Users can delete ta_owners'
  ) THEN
    CREATE POLICY "Users can delete ta_owners"
      ON ta_owners
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Insert default TA owners (ignore conflicts)
INSERT INTO ta_owners (name) VALUES 
  ('Yogiraj'),
  ('Shambhavi'),
  ('Maaz'),
  ('Ishita')
ON CONFLICT (name) DO NOTHING;