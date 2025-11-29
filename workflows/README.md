# Hackaton_TribuIA — Workflows n8n

Este repositorio contiene un workflow de n8n para recibir candidatos (`workflows/RecibirCandidatoWorkflow.json`). Aquí tienes instrucciones rápidas para importarlo y probar el webhook localmente usando Postman.

**Requisitos**
- Tener n8n corriendo localmente o en un servidor (por ejemplo `http://localhost:5678`).
- No subir claves a este repositorio; las claves se han redactado en el workflow. Establece tus variables en el entorno de n8n o en las credenciales de n8n.

**Variables/Secrets necesarias (ejemplos)**
- `SUPABASE_URL` (ej. `https://<your-supabase>.supabase.co`)
- `SUPABASE_ANON_KEY` (anon/public key de Supabase)
- `OPENAI_API_KEY` (clave OpenAI)
- `SERPER_API_KEY` (clave Serper)

Asegúrate de rotar las claves si estuvieron expuestas en commits anteriores.

**Importar el workflow en n8n**
1. Abre la UI de n8n (`http://localhost:5678`).
2. Ve a "Workflows" → "Import" y selecciona `workflows/RecibirCandidatoWorkflow.json`.
3. Revisa las credenciales en los nodos (OpenAI, Serper, Supabase) y configúralas con tus variables/credenciales.

**Probar con Postman**
1. Importa `workflows/RecibirCandidatoWorkflow.postman_collection.json` en Postman.
2. Crea o ajusta la variable `base_url` en la colección (por defecto `http://localhost:5678`).
3. Ejecuta la petición `Candidate Intake` (POST) con el cuerpo de ejemplo.

Ejemplo de cuerpo JSON para la petición al webhook:

{
  "cv_url": "https://example.com/sample_cv.pdf"
}

O usando curl:

```powershell
curl -X POST "http://localhost:5678/webhook/candidate_intake" -H "Content-Type: application/json" -d '{"cv_url":"https://example.com/sample_cv.pdf"}'
```

**Notas de seguridad**
- Los valores sensibles en `workflows/RecibirCandidatoWorkflow.json` han sido reemplazados por placeholders. Rota todas las claves que hayan sido expuestas previamente.
- Añade un `env.example` y usa variables de entorno en lugar de hardcodear keys.
- Considera añadir `pre-commit` hooks o `git-secrets` para evitar subir credenciales.

**Archivos añadidos**
- `workflows/RecibirCandidatoWorkflow.postman_collection.json` — colección Postman para probar el webhook.

**Colección Postman adicional (Preguntas / Respuestas)**

- **Archivo:** `workflows/Preguntas_RespuestasWorkflow.postman_collection.json`
- **Descripción:** colección con dos peticiones para probar los webhooks del workflow `Preguntas_RespuestasWorkflow.json`:
  - `Filter Candidate` -> POST `{{base_url}}/webhook/filter_candidate` — cuerpo de ejemplo con `candidate` y `job`.
  - `Evaluate Answers` -> POST `{{base_url}}/webhook/evaluate_answers` — cuerpo de ejemplo con `entrevista_id` y `respuestas`.

**Cómo usar la colección**
1. Importa `workflows/Preguntas_RespuestasWorkflow.postman_collection.json` en Postman.
2. Ajusta la variable `base_url` de la colección (por defecto `http://localhost:5678`).
3. Asegúrate de tener importado y configurado `workflows/Preguntas_RespuestasWorkflow.json` en n8n y de haber establecido las credenciales necesarias (OpenAI, Supabase).
4. Ejecuta `Filter Candidate` para que el workflow genere preguntas, y luego usa `Evaluate Answers` para enviar respuestas de ejemplo y comprobar la lógica de evaluación.

Ejemplos de cuerpos ya incluidos en la colección. Si quieres que haga pruebas automáticas (collection runner) o añada variables de entorno para Supabase/OpenAI en la colección, dime y lo preparo.

Si quieres, puedo:
- Generar un `env.example` y un `README` más detallado con Docker compose para n8n, o
- Limpiar el historial (BFG/git filter-repo) si prefieres remover los secretos de commits anteriores.

Dime cuál prefieres y lo hago o te doy los pasos detallados.
