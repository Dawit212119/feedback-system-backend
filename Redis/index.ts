import express from "express";
import restaurantsRouter from "./routes/restaurants.js";
import cuisinesRouter from "./routes/cuisines.js";
const app = express();
app.use(express.json());
app.use("/restaurant", restaurantsRouter);
app.use("/cuisines", cuisinesRouter);

app
  .listen(3000, () => {
    console.log("Server start port:3000,  http://localhost:3000 ");
  })
  .on("error", (err) => {
    console.log(err);
    throw new Error(err.message);
  });
