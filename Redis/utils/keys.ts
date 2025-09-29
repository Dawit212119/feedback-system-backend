export function getKeyName(...args: string[]) {
  return `Redis:${args.join(":")}`;
}

export const restaurantKeyById = (id: string) => getKeyName("restaurants", id);
