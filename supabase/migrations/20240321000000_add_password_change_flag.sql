-- Add needs_password_change flag to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'needs_password_change'
    ) THEN
        ALTER TABLE users ADD COLUMN needs_password_change BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can update their own needs_password_change flag" ON users;
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a basic read policy that allows users to read their own data
CREATE POLICY "Users can read their own data"
ON users
FOR SELECT
USING (id = auth.uid());

-- Create a basic update policy that allows users to update their own data
CREATE POLICY "Users can update their own data"
ON users
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Create a policy for admins to read all users
CREATE POLICY "Admins can read all users"
ON users
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
);

-- Create a policy for admins to update all users
CREATE POLICY "Admins can update all users"
ON users
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
); 