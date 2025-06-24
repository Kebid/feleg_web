-- Update profiles table to include all necessary fields for provider profiles
-- Run this in your Supabase SQL Editor

-- Add new columns to the profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS organization_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS specialties TEXT[],
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Create index for better performance on updated_at
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at);

-- Update RLS policies to ensure users can update their own profiles
DROP POLICY IF EXISTS "Allow individual access to own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Add comments to document the table structure
COMMENT ON TABLE profiles IS 'User profiles with role-based information';
COMMENT ON COLUMN profiles.name IS 'Display name for the user';
COMMENT ON COLUMN profiles.organization_name IS 'Organization name for providers';
COMMENT ON COLUMN profiles.bio IS 'Biography or description for providers';
COMMENT ON COLUMN profiles.website IS 'Website URL for providers';
COMMENT ON COLUMN profiles.phone IS 'Phone number for providers';
COMMENT ON COLUMN profiles.profile_image_url IS 'URL to profile image';
COMMENT ON COLUMN profiles.location IS 'Location information';
COMMENT ON COLUMN profiles.role IS 'User role: parent or provider'; 