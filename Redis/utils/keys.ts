export function getKeyName(...args: string[]) {
  return `Redis:${args.join(":")}`;
}

export const restaurantKeyById = (id: string) => getKeyName("restaurants", id);
export const reviewKeyById = (id: string) => getKeyName("review", id);

export const reviewDetailsKeyById = (id: string) =>
  getKeyName("review_details", id);
export const cuisinesKey = getKeyName("cuisines");
export const cuisineKey = (name: string) => getKeyName("cuisine", name);
export const restaurantCuisinesKeyById = (id: string) =>
  getKeyName("restaurant_cuisines", id);
export const restaurantByRatingKey = getKeyName("restaurant_rating_key");
