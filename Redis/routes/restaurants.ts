import { Router, Response, Request, NextFunction } from "express";
import { Restaurant, RestaurantSchema } from "../schemas/restaurants";
import { initializeRedisClient } from "../utils/redis";
import { restaurantKeyById } from "../utils/keys";
import { successResponse } from "../utils/response";
import { nanoid } from "nanoid";
import { validate } from "../middleware/validate";

const router = Router();
router.post(
  "/",
  validate(RestaurantSchema),
  async (
    req: Request<{}, any, Restaurant>,
    res: Response,
    next: NextFunction
  ) => {
    const data = req.body as Restaurant;

    try {
      const client = await initializeRedisClient();
      const id = nanoid();
      const restaurantKey = restaurantKeyById(id);
      const hashData = { id, name: data.name, location: data.location };
      const addResult = await client.hSet(restaurantKey, hashData);
      console.log(`Added data ${addResult}`);

      return successResponse(res, hashData, "Added new restaurant");
    } catch (error) {
      next(error);
    }
  }
);
export default router;
