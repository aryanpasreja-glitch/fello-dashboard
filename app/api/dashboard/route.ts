import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file' },
        { status: 500 }
      );
    }

    // Use service role key for executing queries
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // First, try to execute the refresh_dashboard function
    const { data: refreshData, error: refreshError } = await supabaseAdmin
      .rpc('refresh_dashboard');

    console.log('RPC call result:', { refreshData, refreshError });

    if (!refreshError && refreshData && refreshData.length > 0) {
      return NextResponse.json({ data: refreshData[0] });
    }

    // If function doesn't exist or fails, try to get the latest data from the table
    console.log('Attempting to fetch from table...');
    const { data: existingData, error: fetchError } = await supabaseAdmin
      .from('mad_dashboard')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    console.log('Table fetch result:', { existingData, fetchError });

    if (existingData && !fetchError) {
      return NextResponse.json({ data: existingData });
    }

    // If no data exists, return error with instructions
    console.error('All methods failed:', {
      refreshError: refreshError?.message,
      fetchError: fetchError?.message
    });

    return NextResponse.json(
      { 
        error: 'No dashboard data found',
        message: refreshError 
          ? `Function error: ${refreshError.message}. Please check if the refresh_dashboard() function exists and has proper permissions.`
          : 'Please ensure the mad_dashboard table exists and has data',
        details: refreshError?.message || fetchError?.message,
        debugInfo: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseServiceKey,
          refreshErrorCode: refreshError?.code,
          fetchErrorCode: fetchError?.code
        }
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

