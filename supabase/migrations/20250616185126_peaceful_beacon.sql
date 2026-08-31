/*
  # Create FBASU KPI Dashboard Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `role` (text with check constraint)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `eod_submissions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `submission_date` (date)
      - `submission_type` (text - phone-setter, dm-setter, closer)
      - `data` (jsonb - flexible storage for form data)
      - `submitted_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Admin users can access all data
    - Regular users can only access their own data

  3. Indexes
    - Performance indexes on commonly queried fields
    - Unique constraint on user_id + submission_date to prevent duplicates

  4. Sample Data
    - Insert sample users for testing
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'closer', 'dm-setter', 'phone-setter')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create eod_submissions table
CREATE TABLE IF NOT EXISTS eod_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_date date NOT NULL,
  submission_type text NOT NULL CHECK (submission_type IN ('phone-setter', 'dm-setter', 'closer')),
  data jsonb NOT NULL DEFAULT '{}',
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, submission_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_eod_submissions_user_id ON eod_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_eod_submissions_date ON eod_submissions(submission_date);
CREATE INDEX IF NOT EXISTS idx_eod_submissions_type ON eod_submissions(submission_type);
CREATE INDEX IF NOT EXISTS idx_eod_submissions_submitted_at ON eod_submissions(submitted_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_eod_submissions_updated_at ON eod_submissions;
CREATE TRIGGER update_eod_submissions_updated_at
  BEFORE UPDATE ON eod_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE eod_submissions ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- EOD submissions policies
CREATE POLICY "Users can read own submissions"
  ON eod_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Users can insert own submissions"
  ON eod_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own submissions"
  ON eod_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all submissions"
  ON eod_submissions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Insert sample users
INSERT INTO users (id, name, email, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Admin User', 'admin@fbasu.com', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'John Closer', 'closer@fbasu.com', 'closer'),
  ('33333333-3333-3333-3333-333333333333', 'Sarah DM', 'dm@fbasu.com', 'dm-setter'),
  ('44444444-4444-4444-4444-444444444444', 'Mike Phone', 'phone@fbasu.com', 'phone-setter'),
  ('55555555-5555-5555-5555-555555555555', 'Lisa Martinez', 'lisa@fbasu.com', 'closer'),
  ('66666666-6666-6666-6666-666666666666', 'David Chen', 'david@fbasu.com', 'phone-setter'),
  ('77777777-7777-7777-7777-777777777777', 'Emma Wilson', 'emma@fbasu.com', 'dm-setter'),
  ('88888888-8888-8888-8888-888888888888', 'Alex Johnson', 'alex@fbasu.com', 'phone-setter')
ON CONFLICT (email) DO NOTHING;

-- Insert some sample EOD submissions for testing
INSERT INTO eod_submissions (user_id, submission_date, submission_type, data, submitted_at) VALUES
  (
    '22222222-2222-2222-2222-222222222222',
    CURRENT_DATE - INTERVAL '1 day',
    'closer',
    '{"discoveryCallsBooked": 8, "discoveryCallsTaken": 6, "offersMade": 4, "totalCloses": 2, "revenueClosed": 7500, "cashCollected": 3000}',
    (CURRENT_DATE - INTERVAL '1 day')::timestamptz + INTERVAL '18 hours 30 minutes'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    CURRENT_DATE - INTERVAL '1 day',
    'dm-setter',
    '{"outboundIGDMsSent": 150, "outboundIGDMsReplied": 45, "totalCallsBooked": 8, "setsScheduled": 6, "setsTaken": 5, "revenue": 2500}',
    (CURRENT_DATE - INTERVAL '1 day')::timestamptz + INTERVAL '17 hours 45 minutes'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    CURRENT_DATE - INTERVAL '1 day',
    'phone-setter',
    '{"totalDials": 120, "replies": 35, "meaningfulConversations": 18, "totalSets": 6, "closes": 2, "revenue": 5000}',
    (CURRENT_DATE - INTERVAL '1 day')::timestamptz + INTERVAL '19 hours 15 minutes'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    CURRENT_DATE - INTERVAL '2 days',
    'closer',
    '{"discoveryCallsBooked": 10, "discoveryCallsTaken": 8, "offersMade": 6, "totalCloses": 3, "revenueClosed": 12000, "cashCollected": 5000}',
    (CURRENT_DATE - INTERVAL '2 days')::timestamptz + INTERVAL '18 hours'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    CURRENT_DATE - INTERVAL '2 days',
    'dm-setter',
    '{"outboundIGDMsSent": 180, "outboundIGDMsReplied": 52, "totalCallsBooked": 10, "setsScheduled": 8, "setsTaken": 7, "revenue": 3500}',
    (CURRENT_DATE - INTERVAL '2 days')::timestamptz + INTERVAL '17 hours 30 minutes'
  )
ON CONFLICT (user_id, submission_date) DO NOTHING;