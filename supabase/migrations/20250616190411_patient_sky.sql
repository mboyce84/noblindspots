/*
  # Add Demo Users

  1. New Users
    - Creates demo users for each role type
    - Matches the credentials shown on the login page
    - Provides realistic test data for the application

  2. Security
    - Users are created with appropriate roles
    - Email addresses match the login page examples
*/

-- Insert demo users
INSERT INTO users (name, email, role) VALUES
  ('Admin User', 'admin@fbasu.com', 'admin'),
  ('John Closer', 'closer@fbasu.com', 'closer'),
  ('Sarah DM', 'dm@fbasu.com', 'dm-setter'),
  ('Mike Phone', 'phone@fbasu.com', 'phone-setter')
ON CONFLICT (email) DO NOTHING;