import express, { type Request, type Response } from "express";
import helmet from "helmet";
import "dotenv/config";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "#config/env";
import { corsConfig } from "#middlewares/cors-config";
import { errorHandler } from "#middlewares/error-handler";
import { notFoundHandler } from "#middlewares/not-found";

const app = express();

app.use(helmet());
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World!");
  console.log("Response sent");
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`App running on http://localhost:${env.PORT} 🚀`);
});
