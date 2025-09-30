export function getKeyName(...args: string[]) {
  return `Redis:${args.join(":")}`;
}

export const restaurantKeyById = (id: string) => getKeyName("restaurants", id);
export const reviewKeyById = (id: string) => getKeyName("review", id);

export const reviewDetailsKeyById = (id: string) =>
  getKeyName("review_details", id);
