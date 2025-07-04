/*
  # Add role_title columns to interviews and bottlenecks tables

  1. Schema Changes
    - Add `role_title` column to `interviews` table (text, nullable)
    - Add `role_title` column to `bottlenecks` table (text, nullable)
  
  2. Security
    - No RLS changes needed as existing policies will cover the new columns
  
  3. Notes
    - These columns are nullable to maintain compatibility with existing data
    - Default empty string values will be handled in the application layer
*/

-- Add role_title column to interviews table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'interviews' AND column_name = 'role_title'
  ) THEN
    ALTER TABLE interviews ADD COLUMN role_title text;
  END IF;
END $$;

-- Add role_title column to bottlenecks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bottlenecks' AND column_name = 'role_title'
  ) THEN
    ALTER TABLE bottlenecks ADD COLUMN role_title text;
  END IF;
END $$;