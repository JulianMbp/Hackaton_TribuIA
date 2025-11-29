export async function generateCargoIA(prompt: string) {
  await new Promise((res) => setTimeout(res, 1500)); // simulación IA

  return {
    nombre: "Desarrollador Backend Node.js",
    descripcion: "Responsable del diseño, desarrollo y mantenimiento de microservicios backend.",
    criteriosTecnicos: ["Node.js", "Express", "SQL", "Docker", "Clean Architecture"],
  };
}
