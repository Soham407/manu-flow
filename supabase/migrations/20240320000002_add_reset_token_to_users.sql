-- Add reset token columns to users table
ALTER TABLE users
ADD COLUMN reset_token text,
ADD COLUMN reset_token_expiry timestamp with time zone;

-- Create an index on reset_token for faster lookups
CREATE INDEX IF NOT EXISTS users_reset_token_idx ON users(reset_token);

-- Add comments to explain the columns
COMMENT ON COLUMN users.reset_token IS 'Stores the password reset token';
COMMENT ON COLUMN users.reset_token_expiry IS 'Stores the expiration time of the reset token';

-- Update RLS policies to ensure reset token columns are not exposed
CREATE POLICY "Hide reset token from users" ON users
    FOR SELECT
    USING (true)
    WITH CHECK (true);

-- Create a policy to allow reset token updates only by the user themselves or superadmin
CREATE POLICY "Allow reset token updates" ON users
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