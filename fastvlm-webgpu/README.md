# fastvlm-webgpu – Live Video Captioning con WebGPU

Interfaz web en React + TypeScript que usa WebGPU y un modelo visual-lenguaje (FastVLM) para generar subtítulos en tiempo real a partir de la cámara del usuario, pensada para entrevistas con IA y escenarios de reclutamiento. [attached_file:3]  
Incluye una UI tipo “glassmorphism”, componentes arrastrables y paneles de consejos para ayudar a candidatos a prepararse mientras la IA transcribe y analiza su comunicación. [attached_file:3]

---

## 🚀 Características

- ✅ App creada con Vite + React + TypeScript y estilos tipo Tailwind utility-first. [attached_file:3][image:1]  
- ✅ Carga en navegador del modelo `onnx-community/FastVLM-0.5B-ONNX` usando `huggingface/transformers.js` y ejecución sobre WebGPU. [attached_file:3]  
- ✅ Loop de inferencia en tiempo real que captura frames del `<video>` y llama a `runInference` para generar captions de una sola frase. [attached_file:3]  
- ✅ Gestión de estado global con `VLMContext` para el modelo (carga, errores, bloqueo de concurrencia, canvas interno). [attached_file:3]  
- ✅ Flujo completo de UI: pantalla de bienvenida (“SELECTIFY – AI‑Driven Recruitment”), diálogo de permisos de cámara, pantalla de carga del modelo y vista de captioning con controles. [attached_file:3]  
- ✅ Componentes visuales reutilizables: `GlassContainer`, `GlassButton`, `DraggableContainer`, `PromptInput`, `LiveCaption`, `LoadingScreen`, `WebcamCapture`, `WebcamPermissionDialog`. [attached_file:3]  
- ✅ Manejo detallado de errores de cámara (HTTPS requerido, navegador no soportado, permisos denegados, dispositivo ocupado) con mensajes y troubleshooting guiado. [attached_file:3]  

---

## 📁 Estructura del proyecto

├── public/
├── src/
│ ├── components/ # UI (glass, webcam, prompts, captions, etc.)
│ ├── context/ # VLMContext y VLMProvider
│ ├── types/ # Tipos TS (estado de la app, contexto VLM, etc.)
│ ├── constants.ts # Prompts predefinidos, tiempos, layouts, colores glass
│ └── main.tsx / App.tsx # Punto de entrada de la SPA
├── index.html
├── package.json
├── tsconfig*.json
├── vite.config.ts
└── README.md

[attached_file:3][image:1]

---

## 🛠 Requisitos e instalación

### Requisitos

- Navegador moderno con soporte **WebGPU** (por ejemplo, Chrome/Edge recientes, etc.). [attached_file:3]  
- Acceso a cámara (`navigator.mediaDevices.getUserMedia`) y conexión HTTPS al desplegar en producción (excepto `localhost`). [attached_file:3]

### Instalación

1. Clona el repositorio y entra a la carpeta del proyecto:

git clone <tu-repo-url>
cd fastvlm-webgpu


2. Instala dependencias:

npm install


3. (Opcional) Ajusta configuraciones en los archivos de TypeScript o constantes (prompts, tiempos de captura, colores, etc.). [attached_file:3]

---

## 🚀 Uso

### Modo desarrollo

Levanta el servidor de desarrollo de Vite:

npm run dev


Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`) y concede permisos de cámara cuando el navegador lo solicite. [attached_file:3]  

Flujo básico en la UI: pantalla de bienvenida → botón **“Iniciar Entrevista con IA”** → diálogo de permisos de cámara → pantalla de carga del modelo (barra de progreso) → vista principal con video espejo, panel de prompt y tarjeta de “Live Caption”. [attached_file:3]

### Build de producción

Compila los assets para producción:

npm run build


Previzualiza el build:
npm run preview


Al desplegar en un hosting estático con HTTPS, la app seguirá mostrando el diálogo de permisos y, si algo falla, mostrará mensajes como “HTTPS Required” o “Camera access required” junto con pasos de troubleshooting. [attached_file:3]

---

## 🎯 Flujo de captioning y componentes clave

- `VLMProvider` carga el procesador y el modelo de FastVLM con configuración optimizada (`fp16`, cuantización Q4, `device: "webgpu"`), exponiendo `loadModel` y `runInference` al resto de la app. [attached_file:3]  
- `LoadingScreen` controla la progresión de carga (chequeo de WebGPU, carga de processor, carga de modelo) y muestra errores si algo falla. [attached_file:3]  
- `CaptioningView` combina `WebcamCapture` (control de loop), `PromptInput` (prompt dinámico, sugerencias) y `LiveCaption` (estado RUNNING / STOPPED / ERROR con glassmorphism) mientras ejecuta un loop de captura que llama a `runInference` frame a frame respetando un `FRAME_CAPTURE_DELAY`. [attached_file:3]  

---

## 📄 Licencia

Este proyecto puede adaptarse a la licencia que defina tu equipo o hackathon; si no se especifica explícitamente, se asume uso interno/experimental. [attached_file:3]
