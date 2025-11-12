# Fello Dashboard

A real-time dashboard that displays database metrics from Supabase, styled to match Fello.ai's design.

## Features

- 🎨 Clean, modern UI matching Fello.ai's design
- 📊 Real-time data updates on page reload
- 🔄 Automatic query execution on page load
- 📱 Fully responsive design
- 🎯 Separate query file for easy updates

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Supabase:**
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```

3. **Create the database function:**
   - Open your Supabase SQL Editor
   - Copy and paste the contents of `lib/supabase-function.sql`
   - Execute the SQL to create the `refresh_dashboard()` function

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:3000`

## Updating the Query

To update the dashboard query, edit the `DASHBOARD_QUERY` constant in `lib/queries.ts`. The query will automatically execute when the page is loaded or refreshed.

## Project Structure

```
dashboard/
├── app/
│   ├── api/
│   │   └── dashboard/
│   │       └── route.ts          # API endpoint for fetching data
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main dashboard page
├── components/
│   └── DashboardCard.tsx        # Reusable card component
├── lib/
│   ├── queries.ts                # SQL query (update this file)
│   ├── supabase.ts              # Supabase client configuration
│   └── supabase-function.sql    # Database function SQL
└── package.json
```

## Color Palette

The dashboard uses Fello.ai's color scheme:
- **Primary Blue**: `#0066FF`
- **Dark**: `#0A0E27`
- **Light Background**: `#F5F7FA`
- **Accent**: `#00D4FF`

## Notes

- The dashboard automatically fetches data on page load
- Click the "Refresh" button to manually update the data
- The query executes via the `refresh_dashboard()` database function
- Ensure your Supabase project has the `mad_dashboard` table created

