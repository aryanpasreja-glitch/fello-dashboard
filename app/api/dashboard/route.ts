import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      const response = NextResponse.json(
        { error: 'Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file' },
        { status: 500 }
      );
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return response;
    }

    // Use service role key for executing queries
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // First, try to execute the refresh_dashboard function
    const { data: refreshData, error: refreshError } = await supabaseAdmin
      .rpc('refresh_dashboard');

    console.log('RPC call result:', { refreshData, refreshError });

    if (!refreshError && refreshData && refreshData.length > 0) {
      const response = NextResponse.json({ data: refreshData[0] });
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
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
      const response = NextResponse.json({ data: existingData });
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }

    // If no data exists, return error with instructions
    console.error('All methods failed:', {
      refreshError: refreshError?.message,
      fetchError: fetchError?.message
    });

    const response = NextResponse.json(
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
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  }
}

