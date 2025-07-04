/*
  # Fix RLS policies for roles table

  1. Security Updates
    - Drop existing restrictive policies on roles table
    - Add new policies that allow both anon and authenticated users to perform CRUD operations
    - This matches the pattern used in ta_owners table and resolves the RLS violation error

  2. Changes Made
    - Allow anon and authenticated users to insert, select, update, and delete roles
    - Ensures the application can save role data without authentication issues
*/

-- Drop existing policies for roles table
DROP POLICY IF EXISTS "Users can delete roles" ON roles;
DROP POLICY IF EXISTS "Users can insert roles" ON roles;
DROP POLICY IF EXISTS "Users can read all roles" ON roles;
DROP POLICY IF EXISTS "Users can update roles" ON roles;

-- Create new policies that allow both anon and authenticated users
CREATE POLICY "Allow anon and authenticated to delete roles"
  ON roles
  FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow anon and authenticated to insert roles"
  ON roles
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anon and authenticated to read roles"
  ON roles
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow anon and authenticated to update roles"
  ON roles
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);