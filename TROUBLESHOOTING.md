# Troubleshooting Guide

## Error: "No dashboard data found"

This error occurs when the dashboard can't find data in your Supabase database. Follow these steps:

### Step 1: Verify Your Environment Variables

Make sure your `.env.local` file exists and has the correct values:

```bash
# Check if file exists
ls -la .env.local

# View contents (make sure no sensitive data is exposed)
cat .env.local
```

Your `.env.local` should contain:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**After updating `.env.local`, restart your dev server:**
```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

### Step 2: Create the Database Function

The dashboard needs a database function to execute your query. 

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Click on **SQL Editor** in the left sidebar

2. **Create the Function**
   - Open the file `lib/supabase-function.sql` in your project
   - Copy ALL the SQL code from that file
   - Paste it into the Supabase SQL Editor
   - Click **Run** or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)

3. **Verify the Function Was Created**
   - In Supabase SQL Editor, run:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'refresh_dashboard';
   ```
   - You should see `refresh_dashboard` in the results

### Step 3: Verify the Table Exists

The function inserts data into a table called `mad_dashboard`. Make sure it exists:

1. **Check if table exists:**
   ```sql
   SELECT EXISTS (
     SELECT FROM information_schema.tables 
     WHERE table_name = 'mad_dashboard'
   );
   ```

2. **If the table doesn't exist, create it:**
   ```sql
   CREATE TABLE IF NOT EXISTS mad_dashboard (
     id BIGSERIAL PRIMARY KEY,
     total_count NUMERIC,
     tier1_count BIGINT,
     tier1_percentage NUMERIC,
     tier2_count BIGINT,
     tier2_percentage NUMERIC,
     tier3_count BIGINT,
     tier3_percentage NUMERIC,
     icp_positive BIGINT,
     icp_neutral BIGINT,
     icp_negative BIGINT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Step 4: Test the Function Manually

In Supabase SQL Editor, try running:

```sql
SELECT * FROM refresh_dashboard();
```

This should:
- Execute your query
- Insert a new row into `mad_dashboard`
- Return the inserted data

If this works, your dashboard should work too!

### Step 5: Check Browser Console

1. Open your browser's Developer Tools (F12 or Right-click → Inspect)
2. Go to the **Console** tab
3. Look for any error messages
4. Check the **Network** tab to see the API response

### Common Issues

#### Issue: "Function refresh_dashboard() does not exist"
**Solution:** You haven't created the function yet. Follow Step 2 above.

#### Issue: "relation 'mad_dashboard' does not exist"
**Solution:** The table doesn't exist. Follow Step 3 above to create it.

#### Issue: "relation 'new_unified_agents' does not exist"
**Solution:** Your source table has a different name. Update the query in `lib/queries.ts` and `lib/supabase-function.sql` to use the correct table name.

#### Issue: "permission denied for function refresh_dashboard"
**Solution:** The function needs proper permissions. Run this in SQL Editor:
```sql
GRANT EXECUTE ON FUNCTION refresh_dashboard() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_dashboard() TO anon;
```

#### Issue: Environment variables not loading
**Solution:** 
- Make sure the file is named exactly `.env.local` (not `.env` or `env.local`)
- Restart your Next.js dev server after creating/updating `.env.local`
- Check that there are no spaces around the `=` sign
- Don't use quotes around the values

### Still Having Issues?

1. **Check the API response directly:**
   - Visit `http://localhost:3000/api/dashboard` in your browser
   - You should see JSON data or an error message

2. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs
   - Look for any errors related to your function or queries

3. **Verify your Supabase credentials:**
   - Make sure you're using the correct project
   - Double-check that the keys are complete (they're very long)

4. **Test database connection:**
   ```sql
   -- In Supabase SQL Editor, test if you can query your source table
   SELECT COUNT(*) FROM new_unified_agents;
   ```

