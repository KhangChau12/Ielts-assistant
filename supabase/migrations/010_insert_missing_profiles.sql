-- Insert profiles for users that don't have one
-- This fixes the foreign key constraint issue

INSERT INTO public.profiles (id, email, role)
SELECT
  au.id,
  au.email,
  'student' as role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
