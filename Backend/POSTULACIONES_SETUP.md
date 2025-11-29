# Configuración de Postulaciones

Este documento describe cómo configurar el sistema de postulaciones que conecta el Frontend con el Backend y el workflow de n8n.

## Variables de Entorno Requeridas

Agrega las siguientes variables a tu archivo `.env` en el Backend:

```env
# Supabase
SUPABASE_URL=https://ctvbtlmxdmryckxnhjug.supabase.co
SUPABASE_SERVICE_KEY=tu_service_key_aqui
# O alternativamente:
SUPABASE_ANON_KEY=tu_anon_key_aqui

# n8n Webhook
N8N_WEBHOOK_URL=http://localhost:5678/webhook/candidate_intake
# O la URL de tu instancia de n8n en producción
```

## Configuración de Supabase Storage

1. Ve a tu proyecto de Supabase
2. Navega a **Storage** en el menú lateral
3. Crea un bucket llamado `cvs` (si no existe)
4. Configura las políticas de acceso:
   - **Public Access**: Habilitado para lectura (para obtener URLs públicas)
   - **Authenticated Upload**: Solo usuarios autenticados pueden subir

O si prefieres usar políticas RLS:

```sql
-- Permitir lectura pública
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'cvs');

-- Permitir subida desde el backend (service role)
CREATE POLICY "Service Role Upload" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'cvs');
```

## Configuración del Workflow de n8n

El workflow `RecibirCandidatoWorkflow.json` necesita ser actualizado para leer el `cargo_id` dinámicamente desde el webhook en lugar de tenerlo hardcodeado.

### Actualización necesaria:

1. En el nodo **"Set - Inyectar Configuración Candidato"**:
   - Cambiar el valor de `cargo_id` de:
     ```json
     "value": "bcacb59e-2c7f-4f1b-a6dd-470bfd861134"
     ```
   - A:
     ```json
     "value": "={{ JSON.parse($json.body).cargo_id }}"
     ```

2. En el nodo **"Code - Vincular Cargo-Candidato"**:
   - Cambiar:
     ```javascript
     const jobId = 'bcacb59e-2c7f-4f1b-a6dd-470bfd861134';
     ```
   - A:
     ```javascript
     const jobId = $json.cargo_id || $('Set - Inyectar Configuración Candidato').first().json.cargo_id;
     ```

## Flujo Completo

1. **Frontend**: El usuario hace clic en "Postularme" en una vacante
2. **Frontend**: Se abre un modal para subir el CV (PDF)
3. **Backend**: Recibe el archivo y lo sube a Supabase Storage
4. **Backend**: Obtiene la URL pública del CV
5. **Backend**: Llama al webhook de n8n con:
   - `cv_url`: URL pública del CV
   - `cargo_id`: ID del cargo al que se postula
   - `candidato_id`: ID del candidato (opcional, si está autenticado)
6. **n8n Workflow**: 
   - Descarga el CV desde la URL
   - Extrae el texto del PDF
   - Usa IA para extraer información estructurada
   - Crea/actualiza el candidato en la BD
   - Guarda el CV en la tabla `cvs`
   - Crea una entrada en `historial_aplicaciones`

## Endpoints

### POST `/api/postulaciones`

**Body (multipart/form-data):**
- `cv`: Archivo PDF (máximo 10MB)
- `cargo_id`: UUID del cargo (requerido)
- `candidato_id`: UUID del candidato (opcional)

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Postulación enviada correctamente",
  "cv_url": "https://...",
  "n8n_response": { ... }
}
```

## Notas

- El sistema acepta solo archivos PDF
- El tamaño máximo es 10MB
- Si el workflow de n8n falla, el CV ya está subido y se devuelve un éxito parcial (código 202)
- El workflow de n8n se encarga de toda la lógica de procesamiento y almacenamiento

## Cómo Probar el Endpoint

### Opción 1: Usando Postman (Recomendado - Automático)

La colección de Postman está configurada para obtener automáticamente el token y los IDs necesarios.

1. **Importa la colección:**
   - Abre Postman
   - Click en "Import"
   - Selecciona el archivo `Postulaciones.postman_collection.json`

2. **Configura las variables iniciales:**
   - En Postman, click derecho en la colección → "Edit"
   - Ve a la pestaña "Variables"
   - Configura:
     - `base_url`: `http://localhost:3000` (o la URL de tu backend)
     - `candidato_email`: Email de un candidato existente en tu BD
     - `candidato_password`: Contraseña del candidato
     - (Opcional) `empresa_email` y `empresa_password` si quieres probar como empresa

3. **Flujo de prueba automatizado:**
   
   **Paso 1 - Login:**
   - Ejecuta "1. Autenticación → Login Candidato"
   - ✅ El token y candidato_id se guardan automáticamente
   - Verás en la consola: "✅ Token guardado" y "✅ Candidato ID"

   **Paso 2 - Obtener Cargo:**
   - Ejecuta "2. Consultas de Datos → Obtener Todos los Cargos"
   - ✅ El primer cargo activo se guarda automáticamente como cargo_id
   - Verás en la consola: "✅ Cargo ID guardado"

   **Paso 3 - Postularse:**
   - Ejecuta "3. Postulaciones → Postularse a un Cargo"
   - En el body, en "form-data":
     - Click en "Select Files" para el campo `cv` y selecciona tu PDF
     - Los campos `cargo_id` y `candidato_id` ya están llenos automáticamente
   - Click en "Send"
   - ✅ La postulación se envía con todos los datos correctos

   **Paso 4 - Verificar:**
   - Ejecuta "4. Historial y Verificación → Obtener Historial de Postulaciones"
   - Verás tu postulación en el historial

4. **Ventajas de esta colección:**
   - ✅ Login automático y guardado de token
   - ✅ Obtención automática de cargo_id
   - ✅ Obtención automática de candidato_id
   - ✅ Pre-request scripts que verifican datos antes de enviar
   - ✅ Tests que muestran información útil en la consola
   - ✅ Variables compartidas entre todas las requests

### Opción 1b: Usando Postman (Manual - Sin automatización)

Si prefieres hacerlo manualmente sin usar los scripts automáticos:

1. **Importa la colección** (igual que arriba)

2. **Haz login manualmente:**
   - Ejecuta "Login Candidato" o "Login Empresa"
   - Copia el `token` de la respuesta
   - Pégalo en la variable `auth_token` de la colección

3. **Obtén un cargo_id:**
   - Ejecuta "Obtener Todos los Cargos"
   - Copia el `id` de un cargo de la respuesta
   - Pégalo en la variable `cargo_id` de la colección

4. **Postúlate:**
   - Ejecuta "Postularse a un Cargo"
   - Selecciona tu PDF
   - Los IDs se usarán de las variables (o puedes editarlos manualmente)

### Opción 2: Usando cURL

```bash
# Reemplaza los valores según tu configuración
curl -X POST http://localhost:3000/api/postulaciones \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -F "cv=@/ruta/a/tu/cv.pdf" \
  -F "cargo_id=bcacb59e-2c7f-4f1b-a6dd-470bfd861134" \
  -F "candidato_id=TU_CANDIDATO_ID_AQUI"
```

### Opción 3: Desde el Frontend

1. Inicia el servidor del Frontend:
   ```bash
   cd Frontend
   npm run dev
   ```

2. Inicia el servidor del Backend:
   ```bash
   cd Backend
   npm run dev
   ```

3. Asegúrate de que n8n esté corriendo:
   - El workflow debe estar activo
   - El webhook debe estar disponible en la URL configurada

4. Navega al panel del candidato:
   - Ve a `http://localhost:3001/panel-candidato` (o el puerto que uses)
   - Haz clic en "Postularme" en cualquier vacante
   - Sube un CV PDF
   - La postulación se procesará automáticamente

### Verificar que Funcionó

1. **Revisa la respuesta del endpoint:**
   - Debe incluir `success: true`
   - Debe tener una `cv_url` válida
   - Puede incluir `n8n_response` si el workflow respondió

2. **Verifica en Supabase:**
   - Ve a Storage → bucket `cvs`
   - Deberías ver el archivo subido

3. **Verifica en la base de datos:**
   - Tabla `cvs`: Debe tener un nuevo registro con la URL
   - Tabla `candidatos`: Debe tener el candidato creado/actualizado
   - Tabla `historial_aplicaciones`: Debe tener una nueva entrada

4. **Revisa los logs de n8n:**
   - Ve a tu instancia de n8n
   - Revisa la ejecución del workflow
   - Deberías ver todos los pasos completados

### Solución de Problemas

**Error: "Se requiere cargo_id"**
- Asegúrate de enviar el campo `cargo_id` en el body

**Error: "Se requiere un archivo CV"**
- Verifica que estés enviando el archivo en el campo `cv`
- Asegúrate de que sea un PDF

**Error: "Solo se permiten archivos PDF"**
- El archivo debe tener el MIME type `application/pdf`
- Verifica que el archivo sea realmente un PDF

**Error al subir a Supabase Storage:**
- Verifica que el bucket `cvs` exista
- Verifica las credenciales de Supabase en `.env`
- Revisa las políticas de acceso del bucket

**Error al llamar webhook de n8n:**
- Verifica que n8n esté corriendo
- Verifica la URL del webhook en `.env`
- Asegúrate de que el workflow esté activo
- Revisa los logs de n8n para más detalles

**El CV se sube pero no se procesa:**
- Revisa que el workflow de n8n esté activo
- Verifica que el webhook esté configurado correctamente
- Revisa los logs de n8n para ver errores en el procesamiento

