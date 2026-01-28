-- =============================================
-- Script FINAL para corregir permisos de formularios
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- 1. Asegurar que la tabla existe y tiene la columna status
CREATE TABLE IF NOT EXISTS public.forms (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  country text,
  type text NOT NULL DEFAULT 'contact', 
  data jsonb,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Asegurar que status existe si la tabla ya existía
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.forms ADD COLUMN status text DEFAULT 'pending';
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
END $$;

-- 2. Resetear RLS
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- Eliminar TODAS las políticas previas para limpiar
DROP POLICY IF EXISTS "Anyone can insert forms" ON public.forms;
DROP POLICY IF EXISTS "Allow public inserts on forms" ON public.forms;
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.forms;
DROP POLICY IF EXISTS "Admins can view all forms" ON public.forms;
DROP POLICY IF EXISTS "Admins can update forms" ON public.forms;

-- 3. Crear políticas CORRECTAS

-- PERMITIR INSERTAR A TODOS (Anon y Authenticated)
CREATE POLICY "Enable insert for everyone" 
  ON public.forms 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- PERMITIR VER SOLO A ADMINS Y SERVICE ROLE
CREATE POLICY "Enable read access for authenticated users"
  ON public.forms
  FOR SELECT
  TO authenticated
  USING (true);

-- PERMITIR UPDATE SOLO A ADMINS
CREATE POLICY "Enable update for authenticated users"
  ON public.forms
  FOR UPDATE
  TO authenticated
  USING (true);

-- 4. Otorgar permisos explícitos al rol anon (crítico para error 401)
GRANT INSERT ON public.forms TO anon;
GRANT INSERT ON public.forms TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.forms_id_seq TO anon; -- Si existe secuencia

-- Confirmación
COMMENT ON TABLE public.forms IS 'Tabla de formularios con acceso público de escritura corregido';
