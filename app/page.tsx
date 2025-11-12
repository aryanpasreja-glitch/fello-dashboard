'use client';

import { useEffect, useState } from 'react';
import DashboardCard from '@/components/DashboardCard';

interface DashboardData {
  total_count: number;
  tier1_count: number;
  tier1_percentage: number;
  tier2_count: number;
  tier2_percentage: number;
  tier3_count: number;
  tier3_percentage: number;
  icp_positive: number;
  icp_neutral: number;
  icp_negative: number;
  created_at?: string;
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  lastRefresh: string | null;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      console.log('🔄 Starting fetch at:', new Date().toLocaleTimeString());
      setLoading(true);
      setError(null);
      
      // Add cache-busting timestamp to avoid 304 responses
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/dashboard?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log('📡 Response status:', response.status);
      
      const result = await response.json();
      console.log('✅ Data received:', result);

      if (!response.ok) {
        const errorMessage = result.message 
          ? `${result.error}\n\n${result.message}`
          : result.error || 'Failed to fetch dashboard data';
        throw new Error(errorMessage);
      }

      setData(result.data);
      setLastRefresh(new Date().toLocaleTimeString());
      console.log('✅ Data updated successfully at', new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('❌ Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fello-light via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fello-coral mb-4"></div>
          <p className="text-fello-navy font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fello-light via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <div className="text-fello-coral text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-fello-navy mb-2">Error Loading Data</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-gray-700 whitespace-pre-line text-sm">{error}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-fello-navy mb-2">Quick Fix Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Go to your Supabase SQL Editor</li>
              <li>Copy the SQL from <code className="bg-white px-2 py-1 rounded">lib/supabase-function.sql</code></li>
              <li>Paste and execute it to create the <code className="bg-white px-2 py-1 rounded">refresh_dashboard()</code> function</li>
              <li>Make sure the <code className="bg-white px-2 py-1 rounded">mad_dashboard</code> table exists</li>
              <li>Click Retry below</li>
            </ol>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchDashboardData}
              className="bg-fello-coral text-white px-6 py-3 rounded-lg font-semibold hover:bg-fello-coral-dark transition-colors shadow-md"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fello-light via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-fello-navy">Fello Dashboard</h1>
              <p className="text-gray-500 mt-1">Real-time database insights</p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="bg-fello-coral text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-fello-coral-dark transition-colors flex items-center gap-2 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Total Count Card */}
        <div className="mb-8">
          <DashboardCard
            title="Total Agents"
            value={data.total_count}
            gradient="blue"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        </div>

        {/* Tier Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-fello-navy mb-6">Tier Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              title="Tier 1"
              value={data.tier1_count}
              subtitle="High-quality leads"
              percentage={data.tier1_percentage}
              gradient="blue"
            />
            <DashboardCard
              title="Tier 2"
              value={data.tier2_count}
              subtitle="Medium-quality leads"
              percentage={data.tier2_percentage}
              gradient="purple"
            />
            <DashboardCard
              title="Tier 3"
              value={data.tier3_count}
              subtitle="Basic leads"
              percentage={data.tier3_percentage}
              gradient="accent"
            />
          </div>
        </div>

        {/* ICP Status Cards */}
        <div>
          <h2 className="text-2xl font-bold text-fello-navy mb-6">ICP Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              title="ICP Positive"
              value={data.icp_positive}
              subtitle="Ideal customer profile"
              gradient="blue"
            />
            <DashboardCard
              title="ICP Neutral"
              value={data.icp_neutral}
              subtitle="Moderate fit"
              gradient="purple"
            />
            <DashboardCard
              title="ICP Negative"
              value={data.icp_negative}
              subtitle="Low fit"
              gradient="accent"
            />
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Last refreshed: {lastRefresh ? lastRefresh : 'Just now'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Database updated: {data?.created_at ? new Date(data.created_at).toLocaleString() : 'N/A'}
          </p>
        </div>
      </main>
    </div>
  );
}

