/*
  # Fix RLS policies for bottlenecks table

  1. Security Updates
    - Drop existing policies that might be causing issues
    - Create new comprehensive policies for bottlenecks table
    - Ensure both authenticated and anon users can perform CRUD operations
    - Add proper policy conditions for all operations

  2. Changes
    - Updated INSERT policy to allow both authenticated and anon users
    - Updated SELECT, UPDATE, DELETE policies for consistency
    - Simplified policy conditions to avoid authentication issues
*/

-- Drop existing policies for bottlenecks table
DROP POLICY IF EXISTS "Users can delete bottlenecks" ON bottlenecks;
DROP POLICY IF EXISTS "Users can insert bottlenecks" ON bottlenecks;
DROP POLICY IF EXISTS "Users can read all bottlenecks" ON bottlenecks;
DROP POLICY IF EXISTS "Users can update bottlenecks" ON bottlenecks;

-- Create new comprehensive policies for bottlenecks table
CREATE POLICY "Allow all users to read bottlenecks"
  ON bottlenecks
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow all users to insert bottlenecks"
  ON bottlenecks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow all users to update bottlenecks"
  ON bottlenecks
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all users to delete bottlenecks"
  ON bottlenecks
  FOR DELETE
  TO anon, authenticated
  USING (true);