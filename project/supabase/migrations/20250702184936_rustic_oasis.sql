/*
  # Create attrition table with conflict handling

  1. New Tables
    - `attrition` - Store employee attrition data
      - `id` (uuid, primary key)
      - `employee_name` (text, required)
      - `role` (text, optional)
      - `exit_date` (date, required)
      - `reason` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `attrition` table
    - Add policies for anonymous and authenticated users (with conflict handling)
*/

-- Create attrition table if it doesn't exist
CREATE TABLE IF NOT EXISTS attrition (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name text NOT NULL,
  role text,
  exit_date date NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE attrition ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Allow anonymous and authenticated to read attrition" ON attrition;
DROP POLICY IF EXISTS "Allow anonymous and authenticated to insert attrition" ON attrition;
DROP POLICY IF EXISTS "Allow anonymous and authenticated to update attrition" ON attrition;
DROP POLICY IF EXISTS "Allow anonymous and authenticated to delete attrition" ON attrition;

-- Create policies for attrition table
CREATE POLICY "Allow anonymous and authenticated to read attrition"
  ON attrition
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow anonymous and authenticated to insert attrition"
  ON attrition
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous and authenticated to update attrition"
  ON attrition
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous and authenticated to delete attrition"
  ON attrition
  FOR DELETE
  TO anon, authenticated
  USING (true);