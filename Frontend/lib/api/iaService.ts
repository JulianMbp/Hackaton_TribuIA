const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_URL || 'http://localhost:5678';

export interface IAOpcionCargo {
  id_opcion: number;
  titulo: string;
  descripcion: string;
  responsabilidades: string[];
  requisitos: string[];
  skills_requeridos: string;
  nivel_experiencia: string;
  salario_min: number;
  salario_max: number;
  modalidad: string;
  idioma: string;
  notas_para_reclutador?: string;
}

interface N8NJobResponseItem {
  opciones: IAOpcionCargo[];
}

/**
 * Llama al workflow de n8n para generar opciones de cargo
 * POST http://localhost:5678/webhook/job
 */
export async function generateCargoIA(
  empresaId: string,
  textoLibre: string,
  idioma: string = 'es'
): Promise<IAOpcionCargo[]> {
  const response = await fetch(`${N8N_BASE_URL}/webhook/job`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      empresa_id: empresaId,
      texto_libre: textoLibre,
      idioma,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al generar cargo con IA');
  }

  const raw = await response.json();

  // El workflow devuelve algo como: [ { "opciones": [ ... ] } ]
  let opciones: IAOpcionCargo[] | undefined;

  if (Array.isArray(raw) && raw.length > 0 && Array.isArray(raw[0].opciones)) {
    opciones = raw[0].opciones;
  } else if (raw && Array.isArray((raw as N8NJobResponseItem).opciones)) {
    opciones = (raw as N8NJobResponseItem).opciones;
  }

  if (!opciones) {
    throw new Error('Respuesta inesperada del servicio de IA');
  }

  return opciones;
}

/**
 * Confirma una de las opciones y deja que n8n cree el cargo en el backend.
 * POST http://localhost:5678/webhook/ia/confirmar-oferta
 */
export async function confirmarOfertaIA(
  empresaId: string,
  opcion: IAOpcionCargo
): Promise<boolean> {
  const response = await fetch(`${N8N_BASE_URL}/webhook/ia/confirmar-oferta`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      empresa_id: empresaId,
      opcion,
    }),
  });

  if (!response.ok) {
    return false;
  }

  // No dependemos de la forma exacta de la respuesta, solo del éxito HTTP.
  return true;
}
