import { Worker } from "bullmq";
import IORedis from "ioredis";

import dotenv from "dotenv";
import { saveFeedback } from "./db";
import { analyzeSentiments } from "./utils/ai";
import { sendEmail } from "./utils/email";
import { completedQueue, deadLetterQueue } from "./queue";

dotenv.config();
const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const worker = new Worker("feedback-queue", async (job) => {
  console.log("Processing job:", job.id, job.data);
  await saveFeedback(job.data);
  const sentiments = analyzeSentiments(job.data.message);
  console.log("Sentiments", sentiments);

  await sendEmail(
    "New Feedback Recived",
    `user: ${job.data.user}\n Message:${job.data.message}`
  );
  return { status: "processed", sentiments };
});

worker.on("completed", async (job) => {
  await completedQueue.add("completed-job", {
    id: job.id,
    data: job.data,
  });
  console.log(`job ${job.id} completed`);
});

worker.on("failed", async (job, err) => {
  if (job.attemptsMade >= job.opts.attempts) {
    await deadLetterQueue.add("failed-job", {
      id: job.id,
      data: job.data,
      reason: err.message,
    });
  }
  console.error("job failed", job.id);
});
