export const GLASS_EFFECTS = {
  BASE_FREQUENCY: 0.008,
  NUM_OCTAVES: 2,
  SCALE: 77,
  COLORS: {
    DEFAULT_BG: "rgba(0, 0, 0, 0.25)",
    SUCCESS_BG: "rgba(0, 50, 0, 0.25)",
    ERROR_BG: "rgba(50, 0, 0, 0.25)",
    BUTTON_BG: "rgba(59, 130, 246, 0.25)",
    HIGHLIGHT: "rgba(255, 255, 255, 0.15)",
    TEXT: "#ffffff",
  },
} as const;

export const LAYOUT = {
  MARGINS: {
    DEFAULT: 20,
    BOTTOM: 20,
  },
  DIMENSIONS: {
    PROMPT_WIDTH: 420,
    CAPTION_WIDTH: 150,
    CAPTION_HEIGHT: 45,
  },
  TRANSITIONS: {
    SCALE_DURATION: 200,
    OPACITY_DURATION: 200,
    TRANSFORM_DURATION: 400,
  },
} as const;

export const TIMING = {
  FRAME_CAPTURE_DELAY: 50,
  VIDEO_RECOVERY_INTERVAL: 1000,
  RESIZE_DEBOUNCE: 50,
  SUGGESTION_DELAY: 50,
} as const;

const DEFAULT_PROMPT = "Describe what you see in one sentence.";

// Prompt para detección de lectura durante entrevista
const READING_DETECTION_PROMPT = "Observe the person's facial expressions and eye movements carefully. Analyze if they are reading text by looking for: 1) Eye movements that indicate scanning or reading (left-to-right, up-down movements), 2) Facial expressions showing concentration or focus on reading, 3) Head movements that suggest following text, 4) Any indication that they are looking at a screen or paper. Respond with a JSON object containing: {\"is_reading\": boolean, \"confidence\": number (0-100), \"reasoning\": \"brief explanation\"}. Focus specifically on eye gestures and facial expressions to determine if the person is actively reading.";

export const PROMPTS = {
  default: DEFAULT_PROMPT,
  placeholder: DEFAULT_PROMPT,
  readingDetection: READING_DETECTION_PROMPT,

  suggestions: [
    DEFAULT_PROMPT,
    "What is the color of my shirt?",
    "Identify any text or written content visible.",
    "What emotions or actions are being portrayed?",
    "Name the object I am holding in my hand.",
  ],

  fallbackCaption: "Waiting for first caption...",
  processingMessage: "Starting analysis...",
} as const;
