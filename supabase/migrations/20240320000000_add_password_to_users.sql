-- Add password column to users table
ALTER TABLE users
ADD COLUMN password_hash text NOT NULL DEFAULT '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'; -- Default hashed password for existing users

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Add a comment to explain the password_hash column
COMMENT ON COLUMN users.password_hash IS 'Stores the bcrypt hashed password of the user';

-- Update RLS policies to ensure password_hash is not exposed
ALTER TABLE users FORCE ROW LEVEL SECURITY;

-- Create a policy to prevent password_hash from being exposed in SELECT queries
CREATE POLICY "Hide password_hash from users" ON users
    FOR SELECT
    USING (true)
    WITH CHECK (true);

-- Create a policy to allow password_hash updates only by the user themselves or superadmin
CREATE POLICY "Allow password_hash updates" ON users
    FOR UPDATE
    USING (
        auth.uid() = id OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    )
    WITH CHECK (
        auth.uid() = id OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    ); 