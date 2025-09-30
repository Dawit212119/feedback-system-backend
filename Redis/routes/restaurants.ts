import { Router, Response, Request, NextFunction } from "express";
import {
  Restaurant,
  RestaurantDetailsSchema,
  RestaurantSchema,
} from "../schemas/restaurants";
import { initializeRedisClient } from "../utils/redis";
import {
  restaurantKeyById,
  reviewKeyById,
  reviewDetailsKeyById,
} from "../utils/keys";
import { successResponse,errorResponse } from "../utils/response";
import { nanoid } from "nanoid";
import { validate } from "../middleware/validate";
import { Review, ReviewSchema } from "../schemas/review";
import { checkRestaurantExists } from "../middleware/checkRestaurantId";
import { success } from "zod/mini";

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

router.get(
  "/:restaurantId",
  checkRestaurantExists,
  async (
    req: Request<{ restaurantId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { restaurantId } = req.params;
    try {
      const client = await initializeRedisClient();
      const restaurantKey = restaurantKeyById(restaurantId);
      const [viewCount,restaurant] = await Promise.all([client.hIncrBy(restaurantKey,"viewCount",1),client.hGetAll(restaurantKey); ]) 
      return successResponse(res, restaurant);
    }catch (error) {
      next(error);
    }
  }
);
router.post("/:restaurantId/details", validate(RestaurantDetailsSchema));
router.post(
  "/:restaurantId/review",
  checkRestaurantExists,
  validate(ReviewSchema),
  async (
    req: Request<{ restaurantId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { restaurantId } = req.params;
    const data = req.body as Review;
    try {
      const client = await initializeRedisClient();
      const reviewId = nanoid();
      const reviewKey = reviewKeyById(restaurantId);
      const reviewDetailsKey = reviewDetailsKeyById(reviewId);
      const reviewData = {
        id: reviewId,
        ...data,
        timestamp: Date.now(),
        restaurantId,
      };
     await Promise.all([
        client.lPush(reviewKey,reviewId),
        client.hSet(reviewDetailsKey,reviewData),
      ]);
      return successResponse(res,reviewData,"Review added")
    } catch (error) {
      next(error);
    }
  }
);
router.get("/:restaurantId/reviews",checkRestaurantExists),
async(req:Request<{restaurantId:string},{},{},{page:string?,limit:string?}>,res:Response,next:NextFunction)=>{
     const {restaurantId}=req.params;
     const {page=1,limit=10}=req.query;
     const start=Number(page)-1 * Number(limit)
     const end=start +  Number(limit) -1
     try{
      const client=await initializeRedisClient()
      const reviewKey=reviewKeyById(restaurantId);
      const reviewsId=await client.lRange(reviewKey,start,end);
      const reviews=await Promise.all(reviewsId.map(id=>await client.hGetAll(reviewDetailsKeyById(id))))
      return successResponse(res,reviews,"Restaurant review")
    }catch(error){
      next(error)
     }
}
router.delete("/:restaurantId/reviews/:reviewId", async(req:Request<{restaurantId:string,reviewId:string}>,res:Response,next:NextFunction)=>{
  const {restaurantId,reviewId}=req.params;

  try{
    const client=await initializeRedisClient();
    const reviewKey=reviewKeyById(restaurantId);
    const reviewDetailsKey=reviewDetailsKeyById(reviewId);
    const [removeResult,deleteResult]=await Promise.all([
      client.lRem(reviewKey,0,reviewId),
      client.del(reviewDetailsKey)
    ])
    if(removeResult ===0 && deleteResult===0){
      return errorResponse(res,404,"Review not found")
    }
    return successResponse(res,reviewId,"Review deleted")
  }catch(error){next(error)}
  
})


export default router;
