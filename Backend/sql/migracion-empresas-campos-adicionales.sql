-- ===========================================
-- MIGRACIÓN: Agregar campos adicionales a empresas
-- ===========================================
-- Este script agrega los campos adicionales para información completa de empresas
-- Ejecutar solo si la tabla empresas ya existe sin estos campos

-- Agregar nuevos campos a la tabla empresas
ALTER TABLE empresas
  ADD COLUMN IF NOT EXISTS vision text,
  ADD COLUMN IF NOT EXISTS mision text,
  ADD COLUMN IF NOT EXISTS valores text,
  ADD COLUMN IF NOT EXISTS sitio_web varchar(500),
  ADD COLUMN IF NOT EXISTS logo_url varchar(500),
  ADD COLUMN IF NOT EXISTS linkedin_url varchar(500),
  ADD COLUMN IF NOT EXISTS anios_operacion int,
  ADD COLUMN IF NOT EXISTS numero_empleados int,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz default now();

-- Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_empresas_updated_at 
  BEFORE UPDATE ON empresas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
