-- Fix the updated_at trigger issue
-- First, drop the existing trigger if it exists
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Recreate the function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Recreate the trigger
CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the trigger was created
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'update_applications_updated_at'; 