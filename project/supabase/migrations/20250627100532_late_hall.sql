/*
  # TA Dashboard Database Schema

  1. New Tables
    - `candidates` - Store candidate information
    - `roles` - Store role/position information  
    - `interviews` - Store interview scheduling data
    - `bottlenecks` - Store bottleneck issues
    - `ta_owners` - Store TA owner names

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage data
*/

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photo text,
  company text NOT NULL,
  designation text NOT NULL,
  experience numeric NOT NULL DEFAULT 0,
  notice_period text NOT NULL,
  current_ctc numeric NOT NULL DEFAULT 0,
  expected_ctc numeric NOT NULL DEFAULT 0,
  role text NOT NULL,
  stage text NOT NULL DEFAULT 'L1 Screen',
  notes text DEFAULT '',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  ta_owner text NOT NULL,
  status text NOT NULL DEFAULT 'Active',
  days_open integer NOT NULL DEFAULT 0,
  pipeline_count integer NOT NULL DEFAULT 0,
  interviews integer NOT NULL DEFAULT 0,
  offer_status text DEFAULT '',
  is_critical boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name text NOT NULL,
  stage text NOT NULL,
  date text NOT NULL,
  panel text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bottlenecks table
CREATE TABLE IF NOT EXISTS bottlenecks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ta_owners table
CREATE TABLE IF NOT EXISTS ta_owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bottlenecks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ta_owners ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can read all candidates"
  ON candidates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert candidates"
  ON candidates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update candidates"
  ON candidates FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete candidates"
  ON candidates FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert roles"
  ON roles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update roles"
  ON roles FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete roles"
  ON roles FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all interviews"
  ON interviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert interviews"
  ON interviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update interviews"
  ON interviews FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete interviews"
  ON interviews FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all bottlenecks"
  ON bottlenecks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert bottlenecks"
  ON bottlenecks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update bottlenecks"
  ON bottlenecks FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete bottlenecks"
  ON bottlenecks FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all ta_owners"
  ON ta_owners FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert ta_owners"
  ON ta_owners FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update ta_owners"
  ON ta_owners FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete ta_owners"
  ON ta_owners FOR DELETE
  TO authenticated
  USING (true);

-- Insert default TA owners
INSERT INTO ta_owners (name) VALUES 
  ('Yogiraj'),
  ('Shambhavi'),
  ('Maaz'),
  ('Ishita')
ON CONFLICT (name) DO NOTHING;