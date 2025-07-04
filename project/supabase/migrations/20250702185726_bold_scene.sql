/*
  # Add function field to roles table

  1. Schema Changes
    - Add `function` column to `roles` table (text, nullable)
    - This will categorize roles by department/function

  2. Security
    - No RLS changes needed as existing policies will cover the new column

  3. Notes
    - Column is nullable to maintain compatibility with existing data
    - Default values will be handled in the application layer
*/

-- Add function column to roles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roles' AND column_name = 'function'
  ) THEN
    ALTER TABLE roles ADD COLUMN function text;
  END IF;
END $$;