export const saleQueryKeys = {
  all: ["sales"] as const,
  lists: () => [...saleQueryKeys.all, "list"] as const,
  details: () => [...saleQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...saleQueryKeys.details(), id] as const,
  clients: () => [...saleQueryKeys.all, "clients"] as const,
};

