-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE NOT NULL,
  child_name TEXT NOT NULL,
  child_age INTEGER NOT NULL CHECK (child_age >= 1 AND child_age <= 18),
  interests TEXT NOT NULL,
  document_url TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies for applications table
-- Parents can view their own applications
CREATE POLICY "Parents can view own applications" ON applications
  FOR SELECT USING (auth.uid() = parent_id);

-- Parents can create applications
CREATE POLICY "Parents can create applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

-- Parents can update their own applications (for document uploads, etc.)
CREATE POLICY "Parents can update own applications" ON applications
  FOR UPDATE USING (auth.uid() = parent_id);

-- Providers can view applications for their programs
CREATE POLICY "Providers can view applications for their programs" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM programs 
      WHERE programs.id = applications.program_id 
      AND programs.provider_id = auth.uid()
    )
  );

-- Providers can update applications for their programs (for status changes)
CREATE POLICY "Providers can update applications for their programs" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM programs 
      WHERE programs.id = applications.program_id 
      AND programs.provider_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_applications_parent_id ON applications(parent_id);
CREATE INDEX IF NOT EXISTS idx_applications_program_id ON applications(program_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON applications(submitted_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 