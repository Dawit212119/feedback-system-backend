import { z } from "zod";

export const RestaurantSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  cuisines: z.array(z.string().min(1)),
});

export const RestaurantDetailsSchema = z.object({
  links: z.array(
    z.object({
      name: z.string().min(1),
      url: z.string().min(1),
    })
  ),
});
