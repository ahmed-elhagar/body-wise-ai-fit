
-- Add missing RLS policies for ai_generation_logs
CREATE POLICY "Users can only access their own AI generation logs"
ON ai_generation_logs FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Add missing RLS policies for food_consumption_log
CREATE POLICY "Users can only access their own food consumption logs"
ON food_consumption_log FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Add missing RLS policies for user_goals
CREATE POLICY "Users can only access their own goals"
ON user_goals FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Add missing RLS policies for weight_entries
CREATE POLICY "Users can only access their own weight entries"
ON weight_entries FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Add missing RLS policies for user_feedback
CREATE POLICY "Users can only access their own feedback"
ON user_feedback FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Add admin access policy for user_feedback (admins should see all feedback)
CREATE POLICY "Admins can access all feedback"
ON user_feedback FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin');
