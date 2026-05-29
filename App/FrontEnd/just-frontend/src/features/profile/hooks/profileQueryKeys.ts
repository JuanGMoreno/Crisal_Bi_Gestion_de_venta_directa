export const profileQueryKeys = {
  all: ["profile"] as const,
  current: () => [...profileQueryKeys.all, "current"] as const,
  children: () => [...profileQueryKeys.all, "children"] as const,
};
