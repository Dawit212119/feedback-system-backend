import express from "express";

const app = express();

app
  .listen(3000, () => {
    console.log("Server start port:3000,  http://localhost:3000 ");
  })
  .on("error", (err) => {
    console.log(err);
  });
