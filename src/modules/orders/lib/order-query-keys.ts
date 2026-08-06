export const orderKeys = {
  // all orders for the current user
  all: () => ["orders", "list"] as const,

  // single order detail
  detail: (id: string) => ["orders", "detail", id] as const,
};
