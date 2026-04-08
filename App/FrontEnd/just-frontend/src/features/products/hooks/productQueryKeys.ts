
export const productQueryKeys = {
  // Base key del modulo Products. Todo lo demas se construye desde aqui.
  all: ["products"] as const,
  // Lista principal usada en la tabla de gestion [ products , list ].
  lists: () => [...productQueryKeys.all, "list"] as const,
  // Namespace para todas las consultas de detalle [ products , detail ].
  details: () => [...productQueryKeys.all, "detail"] as const,
  // Detalle por id para futuras pantallas de edicion/ver producto [ products , detail , id ].
  detail: (id: string) => [...productQueryKeys.details(), id] as const,
};
