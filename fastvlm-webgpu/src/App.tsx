import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CaptioningView from "./components/CaptioningView";
import InterviewView from "./components/InterviewView";
import LoadingScreen from "./components/LoadingScreen";
import WebcamPermissionDialog from "./components/WebcamPermissionDialog";
import WelcomeScreen from "./components/WelcomeScreen";
import { useInterview } from "./context/useInterviewContext";
import { getCandidateById, getCandidateData } from "./services/candidateService";
import type { AppState } from "./types";

export default function App() {
  const [appState, setAppState] = useState<AppState>("requesting-permission");
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { iniciarEntrevista, state: interviewState } = useInterview();

  // Obtener token y datos de la URL al cargar la aplicación
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const postulacionId = urlParams.get('postulacionId');
    const puesto = urlParams.get('puesto');
    const empresa = urlParams.get('empresa');

    if (token) {
      // Guardar el token en localStorage para uso posterior
      localStorage.setItem('auth_token', token);
      console.log('Token recibido y guardado');
    }

    if (postulacionId || puesto || empresa) {
      // Guardar información de la postulación
      const postulacionData = {
        postulacionId,
        puesto,
        empresa,
      };
      localStorage.setItem('postulacion_data', JSON.stringify(postulacionData));
      console.log('Datos de postulación recibidos:', postulacionData);
      
      // Si hay datos de postulación, activar modo entrevista
      setIsInterviewMode(true);
    }
  }, []);

  // Inicializar entrevista cuando se tenga el token y datos
  useEffect(() => {
    const initializeInterview = async () => {
      console.log('🔍 Verificando inicialización de entrevista...');
      console.log('🔍 isInterviewMode:', isInterviewMode);
      console.log('🔍 interviewState.estado:', interviewState.estado);
      
      if (!isInterviewMode || interviewState.estado !== 'inicializando') {
        console.log('⏭️ Saltando inicialización - condiciones no cumplidas');
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || localStorage.getItem('auth_token');
      const postulacionId = urlParams.get('postulacionId');
      const puesto = urlParams.get('puesto');
      const empresa = urlParams.get('empresa');

      console.log('🔍 Token:', token ? '✅ Presente' : '❌ Faltante');
      console.log('🔍 Postulación ID:', postulacionId);
      console.log('🔍 Puesto:', puesto);
      console.log('🔍 Empresa:', empresa);

      if (!token || !postulacionId) {
        console.warn('⚠️ Faltan datos necesarios para iniciar entrevista');
        return;
      }

      try {
        // Obtener datos del candidato
        console.log('🔵 Obteniendo datos del candidato...');
        const userData = await getCandidateData(token);
        console.log('🔵 userData completo:', userData);
        
        // El endpoint devuelve { success: true, data: { id, nombre, ... } }
        const candidatoId = userData.data?.id || userData.id || userData.user?.id;
        console.log('🔵 Candidato ID extraído:', candidatoId);

        if (!candidatoId) {
          console.error('❌ Estructura de userData:', JSON.stringify(userData, null, 2));
          throw new Error('No se pudo obtener el ID del candidato');
        }

        // Obtener datos completos del candidato
        const candidatoCompleto = await getCandidateById(candidatoId, token);
        
        // Parsear skills si es string
        const skills = typeof candidatoCompleto.skills === 'string' 
          ? candidatoCompleto.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s)
          : candidatoCompleto.skills || [];

        // Preparar datos para la entrevista
        const jobData = {
          puesto: puesto || 'Puesto',
          empresa: empresa || 'Empresa',
          requiredSkills: [], // Se puede obtener del backend si está disponible
          candidateName: candidatoCompleto.nombre || 'Candidato',
          candidateSkills: skills,
          candidateExperience: candidatoCompleto.experiencia_anios ? [{
            years: candidatoCompleto.experiencia_anios,
            company: 'Varios'
          }] : [],
          description: candidatoCompleto.descripcion || '',
        };

        // Iniciar la entrevista
        await iniciarEntrevista(candidatoId, postulacionId, jobData);
        console.log('Entrevista iniciada correctamente');
      } catch (error) {
        console.error('Error inicializando entrevista:', error);
      }
    };

    initializeInterview();
  }, [isInterviewMode, interviewState.estado, iniciarEntrevista]);

  const handlePermissionGranted = useCallback((stream: MediaStream) => {
    setWebcamStream(stream);
    setAppState("welcome");
  }, []);

  const handleStart = useCallback(() => {
    setAppState("loading");
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setAppState("captioning");
  }, []);

  const playVideo = useCallback(async (video: HTMLVideoElement) => {
    try {
      await video.play();
    } catch (error) {
      console.error("Failed to play video:", error);
    }
  }, []);

  const setupVideo = useCallback(
    (video: HTMLVideoElement, stream: MediaStream) => {
      video.srcObject = stream;

      const handleCanPlay = () => {
        setIsVideoReady(true);
        playVideo(video);
      };

      video.addEventListener("canplay", handleCanPlay, { once: true });

      return () => {
        video.removeEventListener("canplay", handleCanPlay);
      };
    },
    [playVideo],
  );

  useEffect(() => {
    if (webcamStream && videoRef.current) {
      const video = videoRef.current;

      video.srcObject = null;
      video.load();

      const cleanup = setupVideo(video, webcamStream);
      return cleanup;
    }
  }, [webcamStream, setupVideo]);

  const videoBlurState = useMemo(() => {
    switch (appState) {
      case "requesting-permission":
        return "blur(20px) brightness(0.2) saturate(0.5)";
      case "welcome":
        return "blur(12px) brightness(0.3) saturate(0.7)";
      case "loading":
        return "blur(8px) brightness(0.4) saturate(0.8)";
      case "captioning":
        return "none";
      default:
        return "blur(20px) brightness(0.2) saturate(0.5)";
    }
  }, [appState]);

  return (
    <div className="App relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gray-900" />

      {webcamStream && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out"
          style={{
            filter: videoBlurState,
            opacity: isVideoReady ? 1 : 0,
          }}
        />
      )}

      {appState !== "captioning" && <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" />}

      {appState === "requesting-permission" && <WebcamPermissionDialog onPermissionGranted={handlePermissionGranted} />}

      {appState === "welcome" && <WelcomeScreen onStart={handleStart} />}

      {appState === "loading" && <LoadingScreen onComplete={handleLoadingComplete} />}

      {appState === "captioning" && (
        isInterviewMode && interviewState.preguntas.length > 0 ? (
          <InterviewView videoRef={videoRef} />
        ) : (
          <CaptioningView videoRef={videoRef} />
        )
      )}
    </div>
  );
}
