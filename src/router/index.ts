import { Router } from "express";
import { authRouter } from "#features/auth/auth.router";
import { productsRouter } from "#features/products-placeholder/index";

export const router: Router = Router();

router.use("/auth", authRouter);
router.use("/products", productsRouter);
