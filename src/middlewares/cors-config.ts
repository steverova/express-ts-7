import cors from "cors";
import { env } from "#config/env";

export const corsConfig = cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:4173",
    env.FRONTEND_URL, // producción
  ],
  credentials: true,
});
