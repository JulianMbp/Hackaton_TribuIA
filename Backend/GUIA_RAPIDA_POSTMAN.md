# Guía Rápida - Colección de Postman

## 🚀 Inicio Rápido (3 pasos)

### 1. Importar la Colección
- Abre Postman
- Click en **Import** → Selecciona `Postulaciones.postman_collection.json`

### 2. Configurar Variables
- Click derecho en la colección → **Edit**
- Ve a la pestaña **Variables**
- Configura:
  ```
  base_url = http://localhost:3000
  candidato_email = tu_email@example.com
  candidato_password = tu_password
  ```

### 3. Ejecutar en Orden
1. **Login Candidato** → Obtiene token automáticamente ✅
2. **Obtener Todos los Cargos** → Obtiene cargo_id automáticamente ✅
3. **Postularse a un Cargo** → Selecciona PDF y envía ✅

## 📋 Estructura de la Colección

### 1. Autenticación
- **Login Candidato**: Login y guarda token + candidato_id
- **Login Empresa**: Login y guarda token + empresa_id
- **Obtener Usuario Actual**: Verifica el token

### 2. Consultas de Datos
- **Obtener Todos los Cargos**: Lista cargos y guarda el primero
- **Obtener Cargo por ID**: Detalles de un cargo
- **Obtener Todos los Candidatos**: Lista candidatos
- **Obtener Candidato por ID**: Detalles de un candidato

### 3. Postulaciones
- **Postularse a un Cargo**: Endpoint principal (usa IDs automáticos)
- **Postularse - Manual**: Versión donde puedes poner IDs manualmente

### 4. Historial y Verificación
- **Obtener Historial de Postulaciones**: Ver postulaciones de un candidato
- **Obtener Todos los CVs**: Ver todos los CVs subidos

## 🔍 Ver Logs y Variables

### Consola de Postman
- Abre la consola: **View → Show Postman Console**
- Verás mensajes como:
  - ✅ Token guardado
  - ✅ Cargo ID guardado
  - ⚠️ Advertencias si faltan datos

### Variables de la Colección
- Click derecho en la colección → **Edit → Variables**
- Verás todas las variables y sus valores actuales
- Las variables se actualizan automáticamente cuando ejecutas las requests

## 🎯 Flujo Completo de Prueba

```
1. Login Candidato
   ↓ (guarda: auth_token, candidato_id)
   
2. Obtener Todos los Cargos
   ↓ (guarda: cargo_id, cargo_nombre)
   
3. Postularse a un Cargo
   ↓ (usa: auth_token, cargo_id, candidato_id)
   ↓ (sube: archivo PDF)
   
4. Obtener Historial de Postulaciones
   ↓ (verifica que la postulación se guardó)
```

## ⚠️ Solución de Problemas

### "No hay cargo_id"
- Ejecuta primero "Obtener Todos los Cargos"
- Verifica que haya cargos en la BD

### "No hay candidato_id"
- Ejecuta primero "Login Candidato"
- O proporciona uno manualmente en la variable

### "No hay token"
- Ejecuta primero "Login Candidato" o "Login Empresa"
- Verifica las credenciales en las variables

### El PDF no se sube
- Verifica que sea un PDF válido
- Tamaño máximo: 10MB
- Solo se aceptan archivos PDF

## 💡 Tips

1. **Usa la consola**: Siempre revisa la consola de Postman para ver qué está pasando
2. **Variables automáticas**: Los scripts guardan automáticamente los valores, no necesitas copiar/pegar
3. **Pre-request scripts**: Verifican que tengas los datos necesarios antes de enviar
4. **Tests**: Muestran información útil después de cada request

## 📝 Ejemplo de Respuesta Exitosa

```json
{
  "success": true,
  "message": "Postulación enviada correctamente",
  "cv_url": "https://ctvbtlmxdmryckxnhjug.supabase.co/storage/v1/object/public/cvs/1234567890_abc123.pdf",
  "n8n_response": {
    // Respuesta del workflow de n8n
  }
}
```

