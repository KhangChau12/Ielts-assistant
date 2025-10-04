-- Add UPDATE policy for essays table
-- Users should be able to update their own essays (needed for saving improved_essay and improvement_changes)

CREATE POLICY "Users can update own essays"
ON public.essays
FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add comment
COMMENT ON POLICY "Users can update own essays" ON public.essays IS
'Allows users to update essays they own. This is necessary for saving AI-generated improvements (improved_essay and improvement_changes fields).';
