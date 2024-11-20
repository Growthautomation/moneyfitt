'use client';

import { useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Define the Database types
type OnboardingAnalytics = {
  id: string;
  session_id: string;
  started_at: string;
  reached_midpoint_at: string | null;
  completed_at: string | null;
  signed_up_at: string | null;
  created_at: string;
};

type AnalyticsFunctions = {
  trackStart: () => Promise<void>;
  trackMidpoint: () => Promise<void>;
  trackCompletion: () => Promise<void>;
  trackSignUp: () => Promise<void>;
};

export function useOnboardingAnalytics(): AnalyticsFunctions {
  const supabase = createClient();
  
  const getSessionId = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem('onboarding_session_id');
    if (stored) {
      console.log('Using existing session:', stored);
      return stored;
    }
    
    const newId = uuidv4();
    console.log('Creating new session:', newId);
    localStorage.setItem('onboarding_session_id', newId);
    return newId;
  }, []);

  const trackStart = useCallback(async () => {
    try {
      const sessionId = getSessionId();
      if (!sessionId) return;
      
      // First check if we already have a record
      const { data: existing } = await supabase
        .from('onboarding_analytics')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      // Only create if no record exists
      if (!existing) {
        console.log('Creating new analytics record for session:', sessionId);
        await supabase
          .from('onboarding_analytics')
          .insert({
            session_id: sessionId,
            started_at: new Date().toISOString(),
            reached_midpoint_at: null,
            completed_at: null,
            signed_up_at: null
          });
      } else {
        console.log('Session already exists:', sessionId);
      }
    } catch (error) {
      console.error('Error tracking onboarding start:', error);
    }
  }, [supabase, getSessionId]);

  const trackMidpoint = useCallback(async () => {
    try {
      const sessionId = getSessionId();
      if (!sessionId) return;
      
      console.log('Tracking midpoint for session:', sessionId);
      const { error } = await supabase
        .from('onboarding_analytics')
        .update({ 
          reached_midpoint_at: new Date().toISOString() 
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Error updating midpoint:', error);
      }
    } catch (error) {
      console.error('Error tracking onboarding midpoint:', error);
    }
  }, [supabase, getSessionId]);

  const trackCompletion = useCallback(async () => {
    try {
      const sessionId = getSessionId();
      if (!sessionId) return;
      
      console.log('Tracking completion for session:', sessionId);
      const { error } = await supabase
        .from('onboarding_analytics')
        .update({ 
          completed_at: new Date().toISOString() 
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Error updating completion:', error);
      }
    } catch (error) {
      console.error('Error tracking onboarding completion:', error);
    }
  }, [supabase, getSessionId]);

  const trackSignUp = useCallback(async () => {
    try {
      const sessionId = getSessionId();
      if (!sessionId) return;
      
      console.log('Tracking sign up for session:', sessionId);
      const { error } = await supabase
        .from('onboarding_analytics')
        .update({ 
          signed_up_at: new Date().toISOString() 
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Error updating sign up:', error);
      }
    } catch (error) {
      console.error('Error tracking sign up:', error);
    }
  }, [supabase, getSessionId]);

  return {
    trackStart,
    trackMidpoint,
    trackCompletion,
    trackSignUp
  };
}
