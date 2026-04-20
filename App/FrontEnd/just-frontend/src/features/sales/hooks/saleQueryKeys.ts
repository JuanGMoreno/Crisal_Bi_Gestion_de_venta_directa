export const saleQueryKeys = {
  all: ["sales"] as const,
  lists: () => [...saleQueryKeys.all, "list"] as const,
  clients: () => [...saleQueryKeys.all, "clients"] as const,
};

