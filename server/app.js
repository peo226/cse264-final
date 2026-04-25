import express from "express";
import cors from "cors";
import "dotenv/config";

import * as movieRoutes from "./routes/movies.js";
import * as userRoutes from "./routes/users.js";
import { errorHandler } from "./middleware/errorHandler.js";

// create the app
const app = express();
// it's nice to set the port number so it's always the same
app.set("port", process.env.PORT || 3000);
// set up some middleware to handle processing body requests
app.use(express.json());
// set up some midlleware to handle cors
app.use(cors());

// base route
app.get("/", (req, res) => {
  res.send("Movie Watchlist API");
});

app.use("/movies", movieRoutes.router);
app.use("/users", userRoutes.router);

app.use(errorHandler);

app.listen(app.get("port"), () => {
  console.log(
    "App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env"),
  );
  console.log("  Press CTRL-C to stop\n");
});
