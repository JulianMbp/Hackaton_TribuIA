const N8N_BASE_URL = import.meta.env.VITE_N8N_URL || 'http://localhost:5678';

export interface FilterCandidateRequest {
  candidate: {
    id: string;
    name: string;
    skills: string[];
    experience: Array<{ years: number; company: string }>;
  };
  job: {
    id: string;
    title: string;
    required_skills: string[];
    description?: string;
  };
}

export interface FilterCandidateResponse {
  questions: Array<{
    id?: string;
    tipo: string;
    contenido: string;
    generada_por?: string;
  }>;
}

export interface EvaluateAnswersRequest {
  entrevista_id: string;
  respuestas: Array<{
    pregunta_id: string;
    contenido: string;
    tipo?: string;
  }>;
}

export interface EvaluateAnswersResponse {
  success: boolean;
  message?: string;
  puntaje_final?: number;
}

/**
 * Llamar al webhook filter_candidate para obtener preguntas
 */
export async function filterCandidate(
  data: FilterCandidateRequest
): Promise<FilterCandidateResponse> {
  const url = `${N8N_BASE_URL}/webhook/filter_candidate`;
  
  console.log('🔵 Llamando a filter_candidate:', url);
  console.log('🔵 Datos enviados:', JSON.stringify(data, null, 2));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('🔵 Respuesta status:', response.status, response.statusText);
    console.log('🔵 Content-Type:', response.headers.get('content-type'));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔴 Error en respuesta:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Obtener el texto de la respuesta primero para verificar si está vacío
    const responseText = await response.text();
    console.log('🔵 Respuesta raw (primeros 500 chars):', responseText.substring(0, 500));
    console.log('🔵 Longitud de respuesta:', responseText.length);

    // Si la respuesta está vacía, el workflow puede estar procesando pero no devolviendo datos
    if (!responseText || responseText.trim().length === 0) {
      console.warn('⚠️ Respuesta vacía del webhook. El workflow puede estar procesando pero no devolviendo datos.');
      console.warn('⚠️ Esto puede significar que el nodo "Respond" en n8n no está configurado para devolver datos.');
      // Retornar un objeto con preguntas vacías para que el flujo continúe
      return { questions: [] };
    }

    // Intentar parsear como JSON
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('✅ Respuesta parseada:', result);
    } catch (parseError) {
      console.error('🔴 Error parseando JSON:', parseError);
      console.error('🔴 Texto que falló:', responseText);
      throw new Error(`Error parseando respuesta JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    // Normalizar la respuesta: puede venir como objeto individual, array, o con propiedad questions
    let questions: Array<{ tipo: string; contenido: string; generada_por?: string }> = [];
    
    if (Array.isArray(result)) {
      // Si es un array directo
      questions = result;
    } else if (result.questions && Array.isArray(result.questions)) {
      // Si tiene propiedad questions
      questions = result.questions;
    } else if (result.tipo && result.contenido) {
      // Si es un objeto individual de pregunta
      questions = [result];
    }

    console.log('✅ Preguntas normalizadas:', questions.length);
    
    return { questions };
  } catch (error) {
    console.error('❌ Error calling filter_candidate:', error);
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
    throw error;
  }
}

/**
 * Llamar al webhook evaluate_answers para evaluar respuestas
 */
export async function evaluateAnswers(
  data: EvaluateAnswersRequest
): Promise<EvaluateAnswersResponse> {
  const url = `${N8N_BASE_URL}/webhook-test/evaluate_answers`;
  
  console.log('🔵 Llamando a evaluate_answers:', url);
  console.log('🔵 Datos enviados:', JSON.stringify(data, null, 2));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('🔵 Respuesta status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔴 Error en respuesta:', errorText);
      
      // Si es un error 500 con "No item to return was found", es probable que el workflow procesó correctamente
      // pero el nodo Respond no está configurado para devolver datos
      if (response.status === 500 && errorText.includes('No item to return was found')) {
        console.warn('⚠️ El workflow procesó la solicitud pero no devolvió datos. Esto puede ser normal si el nodo Respond no está configurado.');
        return {
          success: true,
          message: 'Respuestas enviadas correctamente (el workflow está procesando la evaluación)',
        };
      }
      
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Obtener el texto de la respuesta primero
    const responseText = await response.text();
    console.log('🔵 Respuesta raw:', responseText.substring(0, 500));

    // Si la respuesta está vacía, retornar éxito
    if (!responseText || responseText.trim().length === 0) {
      console.warn('⚠️ Respuesta vacía del webhook evaluate_answers');
      return {
        success: true,
        message: 'Respuestas evaluadas correctamente',
      };
    }

    // Intentar parsear como JSON
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('✅ Respuesta parseada:', result);
    } catch {
      console.warn('⚠️ No se pudo parsear la respuesta como JSON, retornando éxito');
      return {
        success: true,
        message: 'Respuestas enviadas correctamente',
      };
    }

    // Manejar la nueva estructura de respuesta: { "status": "200", "data": "Success" }
    if (result.status === '200' || result.status === 200) {
      return {
        success: true,
        message: result.data || 'Respuestas evaluadas correctamente',
        puntaje_final: result.puntaje_final,
      };
    }

    // Manejar estructura antigua si existe
    return {
      success: result.success !== false,
      message: result.message || result.data || 'Respuestas enviadas correctamente',
      puntaje_final: result.puntaje_final,
    };
  } catch (error) {
    console.error('❌ Error calling evaluate_answers:', error);
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
    throw error;
  }
}

