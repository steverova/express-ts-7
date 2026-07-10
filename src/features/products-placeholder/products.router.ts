import { Router } from "express";
import { validate } from "#middlewares/validate-zod";
import { productsController } from "./products.controller";
import { createProductSchema, productParamSchema, productQuerySchema } from "./products.schema";

export const productsRouter: Router = Router();

productsRouter.get("/", validate(productQuerySchema), productsController.getAll);
productsRouter.get("/:id", validate(productParamSchema), productsController.getById);
productsRouter.post("/", validate(createProductSchema), productsController.create);
