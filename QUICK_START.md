# Quick Start Guide - Create the Function

## Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy the Function Code
1. Open the file `lib/supabase-function.sql` in your project
2. **Select ALL** the code (Ctrl+A or Cmd+A)
3. **Copy** it (Ctrl+C or Cmd+C)

### Step 3: Paste and Run in Supabase
1. Go back to Supabase SQL Editor
2. **Paste** the code (Ctrl+V or Cmd+V)
3. **IMPORTANT**: Make sure you select **"No limit"** from the dropdown (not "100" or any other limit)
4. Click **Run** or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)

### Step 4: Verify the Function Was Created
Run this check query in SQL Editor:

```sql
SELECT proname FROM pg_proc WHERE proname = 'refresh_dashboard';
```

You should see `refresh_dashboard` in the results.

### Step 5: Test the Function
Now test it with:

```sql
SELECT * FROM refresh_dashboard();
```

**Important**: Make sure to select **"No limit"** when running this too!

This should:
- Execute your query
- Insert data into `mad_dashboard` table
- Return the results

### Step 6: Refresh Your Dashboard
Go back to your dashboard at `http://localhost:3000` and click **Retry** or refresh the page.

## Common Issues

### "relation refresh_dashboard does not exist"
- **Cause**: The function wasn't created successfully
- **Solution**: 
  1. Make sure you copied the ENTIRE function code (including `CREATE OR REPLACE FUNCTION...`)
  2. Make sure you selected "No limit" before running
  3. Check for any error messages in the SQL Editor
  4. Try running the function creation code again

### "relation mad_dashboard does not exist"
- **Cause**: The table doesn't exist
- **Solution**: Run the code from `lib/create-table.sql` first

### Function runs but returns no data
- **Cause**: Your `new_unified_agents` table might be empty or have different column names
- **Solution**: Check if your source table has data:
  ```sql
  SELECT COUNT(*) FROM new_unified_agents;
  ```

## Still Having Issues?

1. Check the Supabase SQL Editor for any error messages
2. Make sure you're in the correct project/database
3. Verify your table names match (`new_unified_agents`, `mad_dashboard`)
4. Check the browser console (F12) for any frontend errors

