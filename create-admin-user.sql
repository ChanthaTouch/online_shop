-- Create Admin User Script
-- Run this in your database to create an admin user or upgrade existing user to admin

-- Option 1: Update existing user to admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Option 2: Create new admin user (Laravel password hash for 'password123')
-- Note: You should change the password after first login!
INSERT INTO users (name, email, password, role, created_at, updated_at)
VALUES (
    'Admin User',
    'admin@example.com',
    '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NANClx6W.7Pu', -- password: password123
    'admin',
    NOW(),
    NOW()
);

-- Option 3: Check current admin users
SELECT id, name, email, role, created_at 
FROM users 
WHERE role = 'admin';

-- Option 4: List all users with their roles
SELECT id, name, email, role 
FROM users 
ORDER BY role DESC, created_at DESC;
