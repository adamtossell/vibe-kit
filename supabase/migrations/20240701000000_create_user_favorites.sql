-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kit_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Add a unique constraint to prevent duplicate favorites
  UNIQUE(user_id, kit_id)
);

-- Add RLS policies
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own favorites
CREATE POLICY "Users can read their own favorites" 
  ON user_favorites
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own favorites
CREATE POLICY "Users can insert their own favorites" 
  ON user_favorites
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own favorites
CREATE POLICY "Users can delete their own favorites" 
  ON user_favorites
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS user_favorites_user_id_idx ON user_favorites (user_id);
CREATE INDEX IF NOT EXISTS user_favorites_kit_id_idx ON user_favorites (kit_id); 