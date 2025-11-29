import HfIcon from "./HfIcon";
import GlassContainer from "./GlassContainer";
import GlassButton from "./GlassButton";
import { GLASS_EFFECTS } from "../constants";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <>
      {/* Sin fondo - Para ver la cámara detrás */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full space-y-6">
          {/* Logo Card */}
          <div className="rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-200 bg-white/85 backdrop-blur-lg border-2 border-black/90">
            <div className="p-6 flex flex-col items-center justify-center space-y-1">
              <h1 className="text-5xl font-black text-black tracking-tight">
                SELECTIFY
              </h1>
              <p className="text-gray-600 text-base font-semibold tracking-wide">
                AI-Driven Recruitment
              </p>
            </div>
          </div>

          {/* Webcam Status Card */}
          <div className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 bg-gray-100/90 backdrop-blur-lg border-2 border-gray-800/90">
            <div className="p-3">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-black animate-pulse shadow-lg shadow-black/50"></div>
                <p className="text-black font-bold text-sm">Camera ready</p>
              </div>
            </div>
          </div>

          {/* Consejos para entrevistas con IA */}
          <div className="rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-200 bg-white/85 backdrop-blur-lg border-2 border-black/90">
            <div className="p-5">
              <h2 className="text-lg font-bold text-black mb-4 text-center tracking-tight">
                Consejos para tu entrevista con IA:
              </h2>
              <div className="space-y-2.5">
                <div className="flex items-start space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0">
                    1
                  </div>
                  <p className="text-gray-900 leading-snug font-medium text-sm">
                    Mantené contacto visual con la cámara, así la IA interpreta mejor tu seguridad, expresión y claridad al hablar.
                  </p>
                </div>
                <div className="flex items-start space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0">
                    2
                  </div>
                  <p className="text-gray-900 leading-snug font-medium text-sm">
                    Habla con tono natural y ritmo constante, evitando sonar robótico o muy acelerado, porque la IA evalúa fluidez y coherencia.
                  </p>
                </div>
                <div className="flex items-start space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0">
                    3
                  </div>
                  <p className="text-gray-900 leading-snug font-medium text-sm">
                    Cuida tu iluminación y tu fondo, ya que una imagen limpia y clara mejora la detección de expresiones y aumenta tu puntuación.
                  </p>
                </div>
                <div className="flex items-start space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0">
                    4
                  </div>
                  <p className="text-gray-900 leading-snug font-medium text-sm">
                    Evita leer o mirar hacia otro lado, porque la IA detecta distracciones y puede interpretarlo como falta de preparación.
                  </p>
                </div>
                <div className="flex items-start space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0">
                    5
                  </div>
                  <p className="text-gray-900 leading-snug font-medium text-sm">
                    Pronuncia bien y usa frases completas, esto ayuda al sistema a transcribir correctamente tus respuestas y mejora tu evaluación.
                  </p>
                </div>
                <div className="flex items-start space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0">
                    6
                  </div>
                  <p className="text-gray-900 leading-snug font-medium text-sm">
                    Respira antes de responder y organiza tus ideas, ya que la IA valora respuestas claras, estructuradas y seguras.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="flex flex-col items-center space-y-3">
            <button
              onClick={onStart}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-800 text-white font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-black"
              aria-label="Start live captioning with AI model"
            >
              Iniciar Entrevista con IA
            </button>

            <p className="text-xs text-black font-semibold bg-white/75 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-gray-800/90">
              El modelo de IA se cargará al hacer clic
            </p>
          </div>
        </div>
      </div>

      {/* Powered by text - Bottom Right Corner */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white/90 backdrop-blur-lg rounded-xl px-3 py-1.5 shadow-xl border-2 border-black/90">
          <p className="text-xs text-black font-semibold">
            Powered by Selectify AI
          </p>
        </div>
      </div>

      {/* CSS global para el efecto espejo de la cámara */}
      <style dangerouslySetInnerHTML={{
        __html: `
          video {
            transform: scaleX(-1);
            -webkit-transform: scaleX(-1);
          }
        `
      }} />
    </>
  );
}
