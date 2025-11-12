-- Use this to check if the function exists
-- Run this in Supabase SQL Editor first

SELECT 
    proname as function_name,
    pg_get_function_arguments(oid) as arguments,
    pg_get_function_result(oid) as return_type
FROM pg_proc 
WHERE proname = 'refresh_dashboard';

-- If this returns no rows, the function doesn't exist yet
-- If it returns a row, the function exists and you can test it with:
-- SELECT * FROM refresh_dashboard();

