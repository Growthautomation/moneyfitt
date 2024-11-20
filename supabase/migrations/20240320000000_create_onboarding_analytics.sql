create table onboarding_analytics (
  id uuid default uuid_generate_v4() primary key,
  session_id text not null,
  started_at timestamp with time zone default now(),
  reached_midpoint_at timestamp with time zone,
  completed_at timestamp with time zone,
  signed_up_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Index for faster queries
create index onboarding_analytics_session_id_idx on onboarding_analytics(session_id); 