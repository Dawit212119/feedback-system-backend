import express from "express";
import dotenv from "dotenv";
import { feedbackQueue } from "./queue.js";
import { feedbacks } from "./db.js";
dotenv.config();
const app = express();
app.use(express.json());
app.post("/feedback", async (req, res) => {
  const { user, message } = req.body;
  await feedbackQueue.add(
    "proccess-feedback",
    { user, message },
    { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
  );
  const failed = await feedbackQueue.getFailed();
  console.log(failed);
  const completed = await feedbackQueue.getCompleted();
  console.log(completed);
  const waiting = await feedbackQueue.getWaiting();
  console.log(waiting);
  return res.status(201).json({ message: "Feedback submitted" });
});
app.get("/feedback/completed", async (req, res) => {
  const jobs = await feedbackQueue.getCompleted();
  res.json(jobs);
});

app.get("/feedback/failed", async (req, res) => {
  const jobs = await feedbackQueue.getFailed();
  res.json(jobs);
});
app.get("/getfeedback", (req, res) => {
  const feedback = feedbacks;
  return res.json({ feedback });
});

app.listen(process.env.PORT, () => {
  console.log("Server start ", process.env.PORT);
});
