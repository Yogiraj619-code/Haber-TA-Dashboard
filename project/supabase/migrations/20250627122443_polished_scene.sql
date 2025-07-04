/*
  # Fix TA Owners RLS Policies

  1. Security Updates
    - Update RLS policies for `ta_owners` table to allow anonymous users
    - This matches the pattern used by other tables in the schema
    - Allows INSERT and DELETE operations for anon role
    - Maintains existing SELECT and UPDATE policies but updates them for consistency

  2. Changes Made
    - Drop existing restrictive policies
    - Create new policies that allow anon role access
    - Ensure consistency with other table policies in the system
*/

-- Drop existing policies for ta_owners table
DROP POLICY IF EXISTS "Users can delete ta_owners" ON ta_owners;
DROP POLICY IF EXISTS "Users can insert ta_owners" ON ta_owners;
DROP POLICY IF EXISTS "Users can read all ta_owners" ON ta_owners;
DROP POLICY IF EXISTS "Users can update ta_owners" ON ta_owners;

-- Create new policies that allow both authenticated and anonymous users
CREATE POLICY "Allow anon and authenticated to read ta_owners"
  ON ta_owners
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow anon and authenticated to insert ta_owners"
  ON ta_owners
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anon and authenticated to update ta_owners"
  ON ta_owners
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon and authenticated to delete ta_owners"
  ON ta_owners
  FOR DELETE
  TO anon, authenticated
  USING (true);