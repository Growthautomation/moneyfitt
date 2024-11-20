'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

interface OnboardingStats {
  totalStarts: number;
  reachedMidpoint: number;
  completed: number;
  signedUp: number;
  dropoffRateMidpoint: string;
  dropoffRateCompletion: string;
  conversionRate: string;
}

export const OnboardingStats = () => {
  const [stats, setStats] = useState<OnboardingStats | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from('onboarding_analytics')
        .select('started_at, reached_midpoint_at, completed_at, signed_up_at');

      if (data) {
        const totalStarts = data.length;
        const reachedMidpoint = data.filter(d => d.reached_midpoint_at).length;
        const completed = data.filter(d => d.completed_at).length;
        const signedUp = data.filter(d => d.signed_up_at).length;

        setStats({
          totalStarts,
          reachedMidpoint,
          completed,
          signedUp,
          dropoffRateMidpoint: `${((1 - reachedMidpoint/totalStarts) * 100).toFixed(1)}%`,
          dropoffRateCompletion: `${((1 - completed/totalStarts) * 100).toFixed(1)}%`,
          conversionRate: `${((signedUp/completed) * 100).toFixed(1)}%`
        });
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Onboarding Analytics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold">Total Starts</h3>
          <p className="text-3xl">{stats.totalStarts}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold">Reached Midpoint</h3>
          <p className="text-3xl">{stats.reachedMidpoint}</p>
          <p className="text-sm text-gray-500">Dropoff: {stats.dropoffRateMidpoint}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold">Completed</h3>
          <p className="text-3xl">{stats.completed}</p>
          <p className="text-sm text-gray-500">Dropoff: {stats.dropoffRateCompletion}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold">Signed Up</h3>
          <p className="text-3xl">{stats.signedUp}</p>
          <p className="text-sm text-gray-500">Conversion: {stats.conversionRate}</p>
        </div>
      </div>
    </div>
  );
}; 