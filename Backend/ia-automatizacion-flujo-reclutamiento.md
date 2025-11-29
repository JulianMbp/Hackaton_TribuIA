### Contexto general del SaaS de reclutamiento

Este documento describe el **flujo funcional** y los **puntos de automatización con IA** para un SaaS de gestión de procesos de selección, basado en las tablas definidas en `tablas-supabase.sql` y la colección Postman `Supabase Recruiting - CRUD + Login`.

El objetivo es que este contexto sirva como referencia para **futuras implementaciones de features de IA** (análisis de CV, generación de vacantes, entrevistas automáticas, feedback, etc.).

---

### Modelo de datos relevante (vista funcional)

- **Empresas (`empresas`)**  
  - Representa a las compañías clientes del SaaS.  
  - Campos clave: `nombre`, `sector`, `descripcion`, `email`, `pais`, `ciudad`.  
  - Relación: una empresa publica muchos **cargos**.

- **Cargos / Puestos (`cargos`)**  
  - Son las vacantes publicadas por las empresas.  
  - Campos clave: `empresa_id`, `nombre`, `descripcion`, `salario_min`, `salario_max`, `modalidad`, `skills_requeridos`, `nivel_experiencia`, `estado`.  
  - Relación: un cargo tiene muchas **aplicaciones** y muchas **entrevistas**.

- **Candidatos (`candidatos`)**  
  - Son las personas que se postulan a los cargos.  
  - Campos clave: `nombre`, `email`, `experiencia_anios`, `educacion`, `skills`, `cargo_aplicado`, `portafolio_url`, `github_url`, `descripcion`.  
  - Relación: un candidato puede tener muchos **CVs**, muchas **entrevistas** y muchos registros en **historial_aplicaciones**.

- **CVs (`cvs`)**  
  - Almacenan la información de los currículums de los candidatos.  
  - Campos clave: `candidato_id`, `url_archivo`, `texto_extraido`, `formato`, `peso_archivo`.  
  - Base para análisis de texto con IA.

- **Entrevistas (`entrevistas`)**  
  - Representan las entrevistas (tanto con IA como con humanos).  
  - Campos clave: `candidato_id`, `cargo_id`, `estado`, `metodo` (IA | humano | mixto), `puntaje_final`, `started_at`, `finished_at`.  
  - Relación: una entrevista tiene muchas **preguntas**, muchas **respuestas** y muchos **puntajes**.

- **Preguntas (`preguntas`)** y **Respuestas (`respuestas`)**  
  - Soportan el flujo de entrevista (chat o videollamada).  
  - Preguntas: `entrevista_id`, `tipo` (técnica | comportamental | IA), `contenido`, `generada_por` (ia | manual).  
  - Respuestas: `pregunta_id`, `contenido`, `tipo` (texto | audio | url_video).  
  - Base para analizar la calidad de las respuestas con IA.

- **Puntajes (`puntajes`)**  
  - Detalle de la evaluación por criterio de una entrevista.  
  - Campos clave: `entrevista_id`, `criterio`, `valor`.  
  - Permite desglosar el `puntaje_final` de la entrevista (ej: comunicación, conocimientos técnicos, honestidad, etc.).

- **Historial de aplicaciones (`historial_aplicaciones`)**  
  - Traza la relación Candidato–Cargo en el tiempo.  
  - Campos clave: `candidato_id`, `cargo_id`, `estado` (aplicado | revisado | rechazado | contratado), `fecha`.  
  - Útil para saber en qué etapa está cada postulante.

- **Notificaciones (`notificaciones`)**  
  - Comunicación hacia empresas y candidatos.  
  - Campos clave: `usuario_id`, `tipo_usuario` (empresa | candidato), `mensaje`, `leido`.  
  - Canal para enviar feedback, cambios de estado, nuevas entrevistas, etc.

---

### Flujo de negocio alto nivel

1. **Registro de empresa y configuración inicial**
   - La empresa se crea en el sistema (`empresas`) y completa un perfil básico: sector, descripción, tipo de posiciones que suele contratar, rango salarial típico, etc.
   - Esta información será usada por la IA para entender el contexto del negocio.

2. **Definición asistida de una oferta de trabajo (IA + empresa)**
   - La empresa quiere publicar un nuevo **cargo** pero “no sabe bien lo que quiere”.  
   - Interactúa con un **chat con IA** donde:
     - Describe en lenguaje natural qué necesita, qué tecnologías le suenan, qué tipo de persona buscan, nivel de seniority deseado, rango salarial aproximado, etc.
     - La IA, usando el contexto de la empresa y su historial, propone varias versiones de la descripción del puesto:
       - Título del cargo.
       - Descripción del rol.
       - Responsabilidades.
       - Requisitos (skills técnicos y blandos).
       - Rango salarial sugerido.
       - Modalidad (remoto / híbrido / presencial).
     - El usuario de empresa elige una propuesta o la ajusta con la IA.
   - Resultado técnico:
     - Se crea un registro en `cargos` con `skills_requeridos`, `nivel_experiencia`, `salario_min`, `salario_max`, `modalidad`, etc.

3. **Publicación de la oferta y recepción de postulaciones**
   - El cargo se publica en el sitio web (frontend) y se conecta al backend vía endpoints de `cargos` y `historial_aplicaciones`.
   - Los candidatos se registran (`candidatos`), suben CVs (`cvs`) y aplican al puesto, generando entradas en `historial_aplicaciones`.

4. **Primer filtro automático: análisis de CV con IA**
   - La IA analiza:
     - Texto del CV (`cvs.texto_extraido`).
     - Datos del candidato (`candidatos.skills`, `experiencia_anios`, `educacion`, `cargo_aplicado`).
     - Requisitos del cargo (`cargos.skills_requeridos`, `nivel_experiencia`, `modalidad`).
   - Escenario de automatización:
     - Se calcula un **score de ajuste CV–Puesto** por candidato.
     - Candidatos que no cumplen umbrales mínimos (ej. skills críticos ausentes, años de experiencia muy bajos, idioma requerido no presente, etc.) se marcan como **“rechazados por filtro automático”** en `historial_aplicaciones`.
     - Los candidatos que pasan este primer filtro quedan en un estado de **“preseleccionado por CV”**.
   - Posibles outputs:
     - Generación automática de registros en `puntajes` con criterios como “Match técnico CV”, “Experiencia relevante”, etc.
     - Notificaciones (`notificaciones`) para:
       - La empresa: resumen de cuántos CVs aplicaron y cuántos pasaron el filtro.
       - El candidato: mensaje de seguimiento (por ejemplo, “Tu CV está en revisión” o “No cumples con los requisitos mínimos para este rol”).

5. **Segundo filtro automático: entrevista por IA (video / voz / texto)**
   - Con el subconjunto de candidatos que pasaron el filtro de CV, se crea una **entrevista de IA** (`entrevistas` con `metodo = 'IA'`).
   - La IA:
     - Genera preguntas (`preguntas`) adaptadas al cargo y al CV del candidato (técnicas y comportamentales).
     - Conduce una entrevista en videollamada o grabada:
       - El candidato responde en tiempo real (texto / audio / video → almacenado en `respuestas`, `tipo = 'audio' | 'url_video'`).
       - Se pueden usar modelos de visión para:
         - Detectar si está leyendo.
         - Ver si está usando otra pantalla o apoyo (indicadores de uso de ChatGPT u otros).
         - Analizar contacto visual, lenguaje corporal básico, etc.
   - Escenarios de evaluación:
     - La IA asigna puntajes por criterio en `puntajes`:
       - Comunicación.
       - Confianza / firmeza al hablar.
       - Conocimiento técnico del stack del rol.
       - Honestidad / coherencia entre CV y respuestas.
     - Se calcula un `puntaje_final` en `entrevistas`.
   - Flexibilidad:
     - La “dureza” del filtro y los umbrales pueden variar según el tipo de puesto (ej. más flexible para roles junior o de atención al cliente).

6. **Selección de finalistas y agenda de entrevistas humanas**
   - Después del filtro por CV + IA (video), se obtiene una lista pequeña de candidatos finalistas (por ejemplo, entre 1 y 10).
   - Para estos candidatos:
     - Se cambia el estado en `historial_aplicaciones` (ej. `revisado` o similar, y una marca de “finalista”).  
     - Se crean nuevas `entrevistas` con `metodo = 'humano'` o `metodo = 'mixto'` para agendar entrevistas directas con la empresa.
   - La empresa recibe:
     - Un listado de finalistas.
     - Sus puntajes detallados (`puntajes`) y `puntaje_final`.
     - Resumen textual generado por IA de pros y contras de cada candidato.

7. **Feedback a candidatos (automático + personalizado)**
   - Una vez tomada la decisión de contratación:
     - Se actualiza `historial_aplicaciones` a estados como `rechazado` o `contratado`.
   - IA de feedback:
     - Genera mensajes personalizados para cada candidato en base a:
       - CV.
       - Respuestas en la entrevista.
       - Puntajes obtenidos.
     - Esos mensajes se guardan y envían vía `notificaciones` (tipo_usuario = 'candidato').
   - Objetivo:
     - Dar una experiencia respetuosa y clara a los postulantes (por qué no fueron seleccionados, puntos fuertes, sugerencias de mejora).

---

### Puntos fuertes del enfoque propuesto

- **Automatización de punta a punta del funnel de reclutamiento**  
  Desde la definición asistida de la vacante con IA hasta el feedback final al candidato, casi todas las etapas tienen soporte o automatización inteligente.

- **Modelo de datos ya alineado con la lógica de IA**  
  Las tablas actuales (`cvs`, `entrevistas`, `preguntas`, `respuestas`, `puntajes`, `historial_aplicaciones`, `notificaciones`) permiten implementar análisis de CV, generación dinámica de preguntas, scoring por criterio y trazabilidad completa del proceso.

- **Personalización por empresa y por puesto**  
  La IA no es genérica: usa el contexto de `empresas` y la configuración de cada `cargo` para proponer descripciones y filtros adaptados a la realidad de cada organización.

- **Escalabilidad de entrevistas con IA**  
  El segundo filtro por videollamada de IA permite entrevistar a muchos candidatos en paralelo, reduciendo drásticamente la carga de entrevistas humanas y dejando a los reclutadores solo la etapa final.

- **Mejora de experiencia del candidato**  
  Los mensajes de `notificaciones` generados por IA permiten entregar feedback constructivo y mantener informado al candidato en cada etapa.

---

### Ideas de próximas implementaciones de IA sobre este modelo

- Motor de recomendación de candidatos para nuevos cargos usando el historial de aplicaciones y puntajes previos.
- Detección temprana de “red flags” en entrevistas (inconsistencias fuertes entre CV y respuestas, posibles señales claras de uso de respuestas generadas).
- Dashboards para empresas con analytics IA-driven: tiempos promedio por etapa, % de candidatos que pasan cada filtro, skills más escasos, etc.
- Ajuste dinámico de umbrales (por ejemplo, relajar ciertos requisitos si la oferta recibe muy pocas aplicaciones de calidad).


