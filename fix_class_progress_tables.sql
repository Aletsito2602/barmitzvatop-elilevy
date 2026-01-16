-- ===========================================
-- Script para crear tablas faltantes
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- CLASS_COMPLETIONS (registro de clases completadas)
CREATE TABLE IF NOT EXISTS public.class_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  class_number INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, class_number)
);

-- USER_STATS (estadísticas de progreso del usuario)
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  lessons_completed INTEGER DEFAULT 0,
  study_hours NUMERIC DEFAULT 0,
  current_class INTEGER DEFAULT 1,
  last_watched_class INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 24,
  streak_days INTEGER DEFAULT 0,
  last_study_date TIMESTAMP WITH TIME ZONE,
  skill_progress JSONB DEFAULT '{"hebreo": 0, "tefila": 0, "taamim": 0, "berajot": 0}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ACTIVITIES (registro de actividades del usuario)
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.class_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users manage own completions" ON public.class_completions;
DROP POLICY IF EXISTS "Users manage own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users read own activities" ON public.activities;
DROP POLICY IF EXISTS "Users insert own activities" ON public.activities;

-- RLS Policies for class_completions
CREATE POLICY "Users manage own completions" 
  ON public.class_completions 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS Policies for user_stats
CREATE POLICY "Users manage own stats" 
  ON public.user_stats 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS Policies for activities
CREATE POLICY "Users read own activities" 
  ON public.activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own activities" 
  ON public.activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_class_completions_user_id ON public.class_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON public.activities(user_id);

-- Fix: Ensure all existing users have a user_stats record
INSERT INTO public.user_stats (user_id, lessons_completed, study_hours, current_class)
SELECT p.id, 0, 0, 1
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_stats us WHERE us.user_id = p.id
)
ON CONFLICT (user_id) DO NOTHING;
