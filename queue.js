import { Queue } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();
const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

export const feedbackQueue = new Queue("feedback-queue", { connection });
export const deadLetterQueue = new Queue("feedback-dead-queue", { connection });
export const completedQueue = new Queue("feedback-completed-queue", {
  connection,
});
