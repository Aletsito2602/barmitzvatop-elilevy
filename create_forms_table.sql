-- =============================================
-- Script para corregir RLS de la tabla FORMS
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- Primero, agregar columna status si no existe (ignorar error si ya existe)
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.forms ADD COLUMN status text DEFAULT 'pending';
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
END $$;

-- Habilitar RLS si no está habilitado
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Allow public inserts on forms" ON public.forms;
DROP POLICY IF EXISTS "Admins can view all forms" ON public.forms;
DROP POLICY IF EXISTS "Admins can update forms" ON public.forms;
DROP POLICY IF EXISTS "Anyone can insert forms" ON public.forms;

-- Política para permitir que CUALQUIER usuario (incluso anónimos) puedan INSERTAR
-- Esto es necesario para formularios públicos de contacto
CREATE POLICY "Anyone can insert forms" 
  ON public.forms 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Política para que usuarios autenticados puedan ver formularios
CREATE POLICY "Admins can view all forms" 
  ON public.forms 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Política para que usuarios autenticados puedan actualizar
CREATE POLICY "Admins can update forms" 
  ON public.forms 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Listo! El formulario de contacto ahora debería funcionar
