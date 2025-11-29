Resumen rápido
Tienes: Frontend casi listo, backend/Supabase funcional y modelo de datos perfecto.
Falta: orquestación con n8n y consumir/ajustar fastvlm-webgpu para el análisis de gestos en entrevistas.
1. Organización general del trabajo
Paso 1 – Definir APIs internas y contratos
Asegurar qué endpoints usará el Frontend para:
Crear oferta con IA.
Subir CV / aplicar a cargo.
Iniciar entrevista IA y enviar resultados (video/transcripción).
Decidir: ¿el Frontend llama directo a n8n (webhooks) o pasa siempre por tu Backend (recomendado)?
Paso 2 – Montar n8n y credenciales
Configurar instancia de n8n (docker o cloud).
Crear credenciales:
HTTP hacia Supabase REST (rest_url + anon_key/service key).
Proveedor LLM (OpenAI, Anthropic, HF Inference, etc.).
Servicio de fastvlm-webgpu una vez lo expongas como API.
2. Flujo n8n: Creador de ofertas con IA
Un workflow solo para esta interacción.
Trigger
Webhook en n8n: /ia/crear-oferta.
Entrada: empresa_id, texto libre de la empresa (“lo que piensa que quiere”), idioma, parámetros opcionales.
Nodos principales
HTTP Request → Supabase: obtener datos de empresas (sector, descripción, país, etc.).
LLM / OpenAI / HTTP Request a modelo de texto:
Prompt con: contexto de la empresa + lo que escribió el usuario.
Output estructurado en JSON: título, descripción, responsabilidades, requisitos, skills_requeridos, nivel_experiencia, salario_min/max, modalidad.
Function (n8n) → limpiar/validar el JSON.
HTTP Request → Supabase (POST /cargos) para crear el cargo.
Respuesta al Frontend
Devolver:
El JSON completo de la oferta propuesta.
El id del cargo creado.
3. Flujo n8n: Recepción y análisis de CVs
Un workflow por nuevo CV/aplicación.
Trigger
Opción A: Webhook al subir CV (Frontend -> Backend -> n8n).
Opción B: Trigger por evento de Supabase (nuevo cvs o nuevo historial_aplicaciones).
Input mínimo: candidato_id, cargo_id, cv_url (si está en storage) o cv_id.
Nodos
HTTP Request → Descargar el CV (si hace falta) y pasarlo a un extractor de texto (puede ser otro servicio o una función propia).
HTTP Request → Supabase PATCH /cvs para guardar texto_extraido.
HTTP Request → Supabase para obtener:
Datos del candidato (candidatos).
Datos del cargo (cargos).
LLM / HTTP Request a modelo de texto:
Prompt: CV + datos candidato + descripción y requisitos del cargo.
Output: JSON con puntajes por criterio y un score_global.
HTTP Request → Supabase POST /puntajes (uno por criterio) y/o PATCH /historial_aplicaciones cambiando estado (aplicado → revisado / rechazado / preseleccionado).
Opcional: HTTP Request → POST /notificaciones para empresa y candidato.
4. Uso de fastvlm-webgpu para gestos en entrevistas
El repo fastvlm-webgpu que tienes es un Space tipo frontend/WebGPU 1, así que necesitas convertirlo en algo que puedas consumir desde n8n.
Paso 4.1 – Decidir arquitectura
Opción A (recomendada):
Crear un servicio backend ligero (Node/Express o similar) usando el código de fastvlm-webgpu como referencia del modelo, pero corriendo en servidor con GPU (o usar un endpoint de inferencia de HF).
Exponer un endpoint tipo POST /analisar-gestos que reciba:
video_url o frames (lista de imágenes base64/URLs).
Opcional: timestamps de preguntas/respuestas.
Devolver JSON:
eye_contact_score, reading_likelihood, distraction_score, etc.
Opción B: correr toda la detección en el Frontend con WebGPU y mandar solo los scores al Backend/n8n (menos carga de server, pero más lógica en Frontend).
Paso 4.2 – Integración con n8n
En el flujo de análisis de entrevista (ver siguiente punto), usar un nodo HTTP Request a tu API de fastvlm.
Guardar los resultados como puntajes adicionales para la entrevista (ej. criterios: “Contacto visual”, “Probabilidad de estar leyendo”, “Nivel de atención”).
5. Flujo n8n: Entrevista IA (preguntas + análisis respuestas)
Idealmente dividido en dos workflows: generación de entrevista y análisis posterior.
5.1 Workflow: generación de entrevista IA
Trigger
Webhook o evento de Supabase cuando un candidato pasa el primer filtro (estado preseleccionado).
Nodos
HTTP Request → Supabase para datos de candidato y cargo.
LLM → generar lista de preguntas (técnicas y comportamentales) en JSON.
HTTP Request → Supabase POST /entrevistas (metodo = 'IA', estado pendiente).
HTTP Request → Supabase POST /preguntas (bulk o una a una), asociadas a entrevista_id.
HTTP Request → POST /notificaciones al candidato con link/ID de entrevista.
5.2 Workflow: análisis de entrevista grabada
Trigger
Webhook llamado por tu Backend/Frontend cuando la entrevista termina, con:
entrevista_id, video_url, opcionalmente transcripción de audio (si la generas con otro servicio).
Nodos
HTTP Request → Supabase para recuperar preguntas, respuestas (si ya las almacenas), datos de candidato y cargo.
HTTP Request → servicio fastvlm para detección de gestos con video_url.
LLM → análisis semántico de respuestas (coherencia con CV, conocimientos técnicos, seguridad al responder) usando texto/transcripción.
Function → combinar:
Puntajes de fastvlm (gestos).
Puntajes semánticos (contenido).
Calcular puntaje_final.
HTTP Request → Supabase:
POST /puntajes (varios criterios).
PATCH /entrevistas para guardar puntaje_final y estado finalizada.
HTTP Request → POST /notificaciones para empresa (lista de finalistas) o directamente marcar finalistas en historial_aplicaciones.
6. Flujo n8n: Feedback automático a candidatos
Trigger
Evento en Supabase: cambio de estado en historial_aplicaciones a rechazado o contratado.
Nodos
HTTP Request → Supabase para:
Candidato, cargo, entrevistas, puntajes.
LLM → generar mensaje humano-amigable con:
Puntos fuertes, puntos a mejorar, motivo de la decisión.
HTTP Request → POST /notificaciones al candidato con el texto generado.
7. Orden recomendado de implementación
Flujo n8n Creador de ofertas con IA (rápido impacto, solo texto).
Flujo n8n Recepción y análisis de CVs (CV → score).
Flujos de entrevista IA sin video (solo preguntas y respuestas texto/voz con transcripción).
Montar servicio API alrededor de fastvlm-webgpu y conectarlo a n8n.
Extender flujos de entrevista para incluir análisis de gestos con fastvlm.
Flujo de feedback automatizado.
Si quieres, en el siguiente mensaje puedo bajar uno de estos flujos (por ejemplo, el del creador de ofertas o el de CVs) a un diagrama de nodos de n8n + ejemplo de configuración nodo por nodo.