import { NextFunction, Response, Request } from "express";
import { errorResponse } from "../utils/response";
import { initializeRedisClient } from "../utils/redis";
import { restaurantKeyById } from "../utils/keys";

export const checkRestaurantExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;
  if (!restaurantId) {
    return errorResponse(res, 400, "Restaurant ID not found");
  }
  const client = await initializeRedisClient();
  const restaurantKey = restaurantKeyById(restaurantId);
  const exists = await client.exists(restaurantKey);
  if (!exists) {
    return errorResponse(res, 404, "Restuarant no found");
  }
  next();
};
