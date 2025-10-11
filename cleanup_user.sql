-- Run this in Supabase SQL Editor to completely delete a user
-- Replace the email with the one you want to delete

-- Delete from invites table
DELETE FROM invites
WHERE invited_id IN (SELECT id FROM profiles WHERE email = 'phuckhangnhatky@gmail.com')
   OR inviter_id IN (SELECT id FROM profiles WHERE email = 'phuckhangnhatky@gmail.com');

-- Delete from profiles table
DELETE FROM profiles WHERE email = 'phuckhangnhatky@gmail.com';

-- Then go to Authentication > Users and manually delete the user
-- (or use Supabase Dashboard API to delete auth user)
