/*
  # Fix RLS policies for anonymous access

  This migration updates the Row-Level Security policies to allow anonymous users
  to perform CRUD operations on all tables. This resolves the "new row violates 
  row-level security policy" error that occurs when using the anonymous key.

  ## Changes Made
  1. Drop existing restrictive policies on candidates, interviews tables
  2. Create new policies that allow anonymous and authenticated users full access
  3. Update policies for consistency across all tables

  ## Security Note
  This configuration allows anonymous access to all data. In a production environment,
  you should implement proper authentication and more restrictive policies.
*/

-- Drop existing restrictive policies for candidates table
DROP POLICY IF EXISTS "Users can read all candidates" ON candidates;
DROP POLICY IF EXISTS "Users can insert candidates" ON candidates;
DROP POLICY IF EXISTS "Users can update candidates" ON candidates;
DROP POLICY IF EXISTS "Users can delete candidates" ON candidates;

-- Create new policies for candidates table that allow anonymous access
CREATE POLICY "Allow anonymous and authenticated to read candidates"
  ON candidates
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow anonymous and authenticated to insert candidates"
  ON candidates
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous and authenticated to update candidates"
  ON candidates
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous and authenticated to delete candidates"
  ON candidates
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Drop existing restrictive policies for interviews table
DROP POLICY IF EXISTS "Users can read all interviews" ON interviews;
DROP POLICY IF EXISTS "Users can insert interviews" ON interviews;
DROP POLICY IF EXISTS "Users can update interviews" ON interviews;
DROP POLICY IF EXISTS "Users can delete interviews" ON interviews;

-- Create new policies for interviews table that allow anonymous access
CREATE POLICY "Allow anonymous and authenticated to read interviews"
  ON interviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow anonymous and authenticated to insert interviews"
  ON interviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous and authenticated to update interviews"
  ON interviews
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous and authenticated to delete interviews"
  ON interviews
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Ensure all other tables have consistent anonymous access policies
-- (roles, bottlenecks, ta_owners already have the correct policies based on the schema)