-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Hide password_hash from users" ON users;
DROP POLICY IF EXISTS "Allow password_hash updates" ON users;
DROP POLICY IF EXISTS "Public read access" ON users;
DROP POLICY IF EXISTS "Allow public registration" ON users;
DROP POLICY IF EXISTS "Allow users to update their own data" ON users;
DROP POLICY IF EXISTS "Allow superadmin full access" ON users;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (excluding password_hash)
CREATE POLICY "Public read access" ON users
    FOR SELECT
    USING (true);

-- Create policy for insert access
CREATE POLICY "Allow public registration" ON users
    FOR INSERT
    WITH CHECK (true);

-- Create policy for update access
CREATE POLICY "Allow users to update their own data" ON users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create policy for superadmin access
CREATE POLICY "Allow superadmin full access" ON users
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    ); 