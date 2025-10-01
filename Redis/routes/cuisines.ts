import { NextFunction, Router, Response, Request } from "express";
import { initializeRedisClient } from "../utils/redis";
import { cuisinesKey, cuisineKey, restaurantKeyById } from "../utils/keys";
import { successResponse } from "../utils/response";
const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await initializeRedisClient();
    const cuisine = await client.sMembers(cuisinesKey);
    return successResponse(res, cuisine);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:cuisines",
  async (
    req: Request<{ cuisines: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { cuisines } = req.params;
    try {
      const client = await initializeRedisClient();
      const cuisine = cuisineKey(cuisines);
      const restaurantIds = await client.sMembers(cuisine);
      const restaurant = await Promise.all(
        restaurantIds.map((id) => client.hGet(restaurantKeyById(id), "name"))
      );
      return successResponse(res, restaurant);
    } catch (error) {
      next(error);
    }
  }
);
export default router;
