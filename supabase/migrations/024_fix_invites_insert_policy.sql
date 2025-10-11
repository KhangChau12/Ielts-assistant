-- Fix RLS policy to allow server-side insert from auth callback
-- The callback runs with authenticated role, not service_role

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Service role can manage invites" ON invites;

-- Allow authenticated users to insert their own invite records
-- This is safe because the callback validates everything before inserting
CREATE POLICY "Allow invite record creation" ON invites
  FOR INSERT
  WITH CHECK (auth.uid() = invited_id);

-- Keep the select policy for viewing
-- (Users can view invites where they are either inviter or invited)
