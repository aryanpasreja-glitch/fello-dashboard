-- Create the mad_dashboard table if it doesn't exist
-- Run this in Supabase SQL Editor if you get "relation 'mad_dashboard' does not exist" error

CREATE TABLE IF NOT EXISTS mad_dashboard (
    id SERIAL PRIMARY KEY,
    total_count BIGINT,
    tier1_count BIGINT,
    tier1_percentage NUMERIC(6, 2),
    tier2_count BIGINT,
    tier2_percentage NUMERIC(6, 2),
    tier3_count BIGINT,
    tier3_percentage NUMERIC(6, 2),
    icp_positive BIGINT,
    icp_neutral BIGINT,
    icp_negative BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_mad_dashboard_created_at ON mad_dashboard(created_at DESC);

-- Grant necessary permissions
ALTER TABLE mad_dashboard ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated read" ON mad_dashboard
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow service role to insert (for the function)
-- Note: Service role bypasses RLS, so this is mainly for clarity

