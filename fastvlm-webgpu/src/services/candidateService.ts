const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

/**
 * Obtener datos del candidato usando el token
 */
export async function getCandidateData(token: string) {
  try {
    console.log('🔵 Llamando a /api/auth/me con token:', token ? '✅ Presente' : '❌ Faltante');
    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('🔵 Respuesta status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔴 Error en respuesta:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Respuesta de /api/auth/me:', result);
    return result;
  } catch (error) {
    console.error('❌ Error obteniendo datos del candidato:', error);
    throw error;
  }
}

/**
 * Obtener datos completos del candidato por ID
 */
export async function getCandidateById(candidatoId: string, token: string) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/candidatos/${candidatoId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error obteniendo candidato por ID:', error);
    throw error;
  }
}

/**
 * Actualizar estado de la postulación
 */
export async function updatePostulacionStatus(postulacionId: string, estado: string, token: string) {
  try {
    console.log('🔵 Actualizando estado de postulación:', { postulacionId, estado });
    const response = await fetch(`${BACKEND_BASE_URL}/api/historial/${postulacionId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado }),
    });

    console.log('🔵 Respuesta status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔴 Error en respuesta:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Estado de postulación actualizado:', result);
    return result;
  } catch (error) {
    console.error('❌ Error actualizando estado de postulación:', error);
    throw error;
  }
}

