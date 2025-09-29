import { NextFunction, Response, Request } from "express";
import z from "zod";
export const validate =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const Validate = schema.safeParse(req.body);
    if (!Validate.success) {
      return res.status(400).json({
        message: "Validation failed",
        erors: Validate.error,
      });
    }
    next();
  };
