-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  related_entity_type TEXT,
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications table
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- System can create notifications for users
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Function to create application status notification
CREATE OR REPLACE FUNCTION create_application_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if status changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id)
    VALUES (
      (SELECT parent_id FROM applications WHERE id = NEW.id),
      CASE 
        WHEN NEW.status = 'Accepted' THEN 'Application Accepted! 🎉'
        WHEN NEW.status = 'Rejected' THEN 'Application Update'
        ELSE 'Application Status Updated'
      END,
      CASE 
        WHEN NEW.status = 'Accepted' THEN 'Congratulations! Your application has been accepted. Check your application tracker for details.'
        WHEN NEW.status = 'Rejected' THEN 'Your application status has been updated. Please check your application tracker for more information.'
        ELSE 'Your application status has been updated to ' || NEW.status || '.'
      END,
      CASE 
        WHEN NEW.status = 'Accepted' THEN 'success'
        WHEN NEW.status = 'Rejected' THEN 'warning'
        ELSE 'info'
      END,
      'application',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically create notifications when application status changes
CREATE TRIGGER create_application_notification_trigger
  AFTER UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION create_application_notification(); 