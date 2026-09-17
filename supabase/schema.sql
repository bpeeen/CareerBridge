-- ====================================================================
-- CAREERBRIDGE SUPABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ====================================================================
-- Execute this SQL in the Supabase Dashboard SQL Editor (https://app.supabase.com)
-- or apply via Supabase CLI migrations.

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  persona TEXT NOT NULL CHECK (persona IN ('student', 'livelihood')),
  age INTEGER,
  location JSONB DEFAULT '{"villageOrCity": "Bengaluru", "district": "Bengaluru", "state": "Karnataka"}'::jsonb,
  education_level TEXT,
  degree TEXT,
  college TEXT,
  graduation_year INTEGER,
  target_role TEXT,
  trade_or_domain TEXT,
  experience_years INTEGER DEFAULT 0,
  work_type TEXT,
  work_details TEXT,
  preferred_location TEXT,
  preferred_salary TEXT,
  skills JSONB DEFAULT '{}'::jsonb,
  readiness_score INTEGER DEFAULT 60,
  has_completed_onboarding BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for persona & user lookups
CREATE INDEX IF NOT EXISTS idx_profiles_persona ON public.profiles(persona);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated owner" ON public.profiles;
CREATE POLICY "Public profiles are viewable by authenticated owner"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- --------------------------------------------------------------------
-- 2. ROADMAPS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  overview TEXT,
  modules JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id ON public.roadmaps(user_id);

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own roadmaps" ON public.roadmaps;
CREATE POLICY "Users can manage their own roadmaps"
  ON public.roadmaps FOR ALL
  USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 3. ACTIVITIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  minutes INTEGER DEFAULT 15,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_user_id ON public.activities(user_id);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view and insert their own activities" ON public.activities;
CREATE POLICY "Users can view and insert their own activities"
  ON public.activities FOR ALL
  USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 4. ASSESSMENTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  strong_areas JSONB DEFAULT '[]'::jsonb,
  needs_improvement JSONB DEFAULT '[]'::jsonb,
  recommended_next_step TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own assessments" ON public.assessments;
CREATE POLICY "Users can manage their own assessments"
  ON public.assessments FOR ALL
  USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 5. INTERVIEWS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  difficulty TEXT DEFAULT 'intermediate',
  status TEXT DEFAULT 'in_progress',
  questions JSONB DEFAULT '[]'::jsonb,
  current_question_index INTEGER DEFAULT 0,
  final_report JSONB DEFAULT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON public.interviews(user_id);

ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own interviews" ON public.interviews;
CREATE POLICY "Users can manage their own interviews"
  ON public.interviews FOR ALL
  USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 6. AUTOMATIC PROFILE CREATION TRIGGER
-- --------------------------------------------------------------------
-- Automatically creates a profile record when a new user registers via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, persona, has_completed_onboarding)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Career Candidate'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'persona', 'student'),
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
