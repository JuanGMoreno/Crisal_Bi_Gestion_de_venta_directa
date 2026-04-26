export const inventoryQueryKeys = {
  all: ["inventory"] as const,
  summary: () => [...inventoryQueryKeys.all, "summary"] as const,
  entries: () => [...inventoryQueryKeys.all, "entries"] as const,
  details: () => [...inventoryQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryQueryKeys.details(), id] as const,
};
