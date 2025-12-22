-- ========================================
-- FIX: Allow Admins to Manage Users
-- Run this in your Supabase SQL Editor
-- ========================================

-- This policy allows admins to update other users' profiles
-- (for blocking and soft-deleting users in the admin panel)

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

CREATE POLICY "Admins can update all profiles" 
ON profiles 
FOR UPDATE 
USING (
  -- Either you're updating your own profile
  auth.uid() = id 
  OR 
  -- Or you're an admin
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
