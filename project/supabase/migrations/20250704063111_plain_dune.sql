/*
  # Create headcount_summary table

  1. New Tables
    - `headcount_summary`
      - `id` (uuid, primary key)
      - `month` (text, required) - e.g., "Mar'25"
      - `existing_headcount` (integer, required)
      - `new_joinees` (integer, required)
      - `joiner_names` (text, optional)
      - `exits` (integer, required)
      - `exiter_names` (text, optional)
      - `expected_joiners` (integer, required)
      - `expected_joiner_roles` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `headcount_summary` table
    - Add policies for anonymous and authenticated users to perform CRUD operations

  3. Sample Data
    - Insert sample data matching the Canva design
*/

CREATE TABLE IF NOT EXISTS headcount_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month text UNIQUE NOT NULL,
  existing_headcount integer NOT NULL DEFAULT 0,
  new_joinees integer NOT NULL DEFAULT 0,
  joiner_names text DEFAULT '',
  exits integer NOT NULL DEFAULT 0,
  exiter_names text DEFAULT '',
  expected_joiners integer NOT NULL DEFAULT 0,
  expected_joiner_roles text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE headcount_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous and authenticated to read headcount_summary"
  ON headcount_summary
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow anonymous and authenticated to insert headcount_summary"
  ON headcount_summary
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous and authenticated to update headcount_summary"
  ON headcount_summary
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous and authenticated to delete headcount_summary"
  ON headcount_summary
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Insert sample data matching the Canva design
INSERT INTO headcount_summary (month, existing_headcount, new_joinees, joiner_names, exits, exiter_names, expected_joiners, expected_joiner_roles) VALUES
  ('Mar''25', 158, 1, 'Faisal S', 0, '', 0, ''),
  ('Apr''25', 159, 6, 'Samrat B, Neeraj S, Anjali J, Nivin N, Manas G, Vaibhav P', 1, 'Nilesh K, Akshat G', 0, ''),
  ('May''25', 165, 3, 'Himanshu, Sargam Chugh, Anshuman N', 0, '', 0, ''),
  ('Jun''25', 168, 2, 'Arpita B, Diptiranjan S', 1, 'Apurva D', 0, ''),
  ('Jul''25', 169, 0, '', 0, '', 5, 'CAM 01, Customer Success Lead 01, Product Marketing Manager 01, Application Engineer 01, Jr Mechatronics Engineer 01')
ON CONFLICT (month) DO UPDATE SET
  existing_headcount = EXCLUDED.existing_headcount,
  new_joinees = EXCLUDED.new_joinees,
  joiner_names = EXCLUDED.joiner_names,
  exits = EXCLUDED.exits,
  exiter_names = EXCLUDED.exiter_names,
  expected_joiners = EXCLUDED.expected_joiners,
  expected_joiner_roles = EXCLUDED.expected_joiner_roles,
  updated_at = now();