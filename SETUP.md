# Supabase Setup Guide

## Where to Find Your Supabase Credentials

### Step 1: Log in to Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Log in to your account
3. Select your project (or create a new one)

### Step 2: Navigate to API Settings
1. Click on the **Settings** icon (⚙️) in the left sidebar
2. Click on **API Keys** in the settings menu (you should already be here!)

### Step 3: Switch to Legacy API Keys Tab

**Important:** You're currently on the "API Keys" tab which shows the new format. For this dashboard, you need the **Legacy API Keys**:

1. At the top of the page, you'll see two tabs: **"Legacy API Keys"** and **"API Keys"**
2. Click on the **"Legacy API Keys"** tab
3. This will show you the old format keys that start with `eyJ...`

### Step 4: Find Your Credentials

After switching to the "Legacy API Keys" tab, you'll see:

#### 📍 **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
- **Location**: At the top of the page, under "Project URL" section
- **Looks like**: `https://xxxxxxxxxxxxx.supabase.co`
- **Copy this entire URL** (you can copy it from either tab)

#### 🔑 **Anon/Public Key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- **Location**: In the "Legacy API Keys" tab, under "Project API keys" section
- **Look for**: The row labeled **"anon"** → **"public"**
- **Looks like**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMjM5OTIyMywiZXhwIjoxOTI3OTc1MjIzfQ.xxxxxxxxxxxxx`
- **Copy this entire key** (click the copy icon)

#### 🔐 **Service Role Key** (`SUPABASE_SERVICE_ROLE_KEY`)
- **Location**: In the "Legacy API Keys" tab, under "Project API keys" section
- **Look for**: The row labeled **"service_role"** → **"secret"**
- **Looks like**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHgiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjEyMzk5MjIzLCJleHAiOjE5Mjc5NzUyMjN9.xxxxxxxxxxxxx`
- **⚠️ IMPORTANT**: This key has admin privileges - keep it secret!
- **You may need to click "Reveal" or the eye icon** to see the full key
- **Copy this entire key** (click the copy icon)

### Step 5: Create Your `.env.local` File

1. In your project root directory (`/Users/aryanpasreja/dashboard/`), create a file named `.env.local`
2. Add your credentials in this format:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important Notes:**
- Replace the example values with your actual credentials
- Don't add quotes around the values
- Don't commit `.env.local` to git (it's already in `.gitignore`)
- Restart your development server after creating/updating `.env.local`

### Visual Guide

```
Supabase Dashboard
├── Settings (⚙️ icon)
    └── API Keys
        ├── [Tabs: Legacy API Keys | API Keys] ← Click "Legacy API Keys"!
        ├── Project URL ──────────────→ NEXT_PUBLIC_SUPABASE_URL
        └── Project API keys (in Legacy tab)
            ├── anon public ──────────→ NEXT_PUBLIC_SUPABASE_ANON_KEY
            └── service_role secret ───→ SUPABASE_SERVICE_ROLE_KEY
```

### Quick Checklist

- [ ] Navigated to Settings → API Keys
- [ ] Clicked on "Legacy API Keys" tab
- [ ] Found Project URL at the top
- [ ] Found Anon Public Key (anon → public)
- [ ] Found Service Role Key (service_role → secret, may need to reveal)
- [ ] Created `.env.local` file in project root
- [ ] Added all three credentials to `.env.local`
- [ ] Restarted development server (`npm run dev`)

### Troubleshooting

**Can't find the API settings?**
- Make sure you're logged in to Supabase
- Ensure you've selected the correct project
- Check that you have admin access to the project

**Can't find the Legacy API Keys tab?**
- Make sure you're in Settings → API Keys
- Look for tabs at the top: "Legacy API Keys" and "API Keys"
- Click on "Legacy API Keys" tab

**Service Role Key not visible?**
- Make sure you're on the "Legacy API Keys" tab (not "API Keys")
- Click on "Reveal" or the eye icon (👁️) next to the service_role key
- Some projects may require you to click a toggle to show secret keys

**Still having issues?**
- Make sure there are no extra spaces in your `.env.local` file
- Verify the keys are complete (they're very long strings)
- Check that you're using the correct project's credentials

