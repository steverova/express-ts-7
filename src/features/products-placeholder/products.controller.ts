import type { NextFunction, Request, Response } from "express";
import type { CreateProductBody, ProductParam, ProductQuery } from "./products.schema";
import { productsService } from "./products.service";

export const productsController = {
  getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = productsService.getAll(req.query as unknown as ProductQuery);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = productsService.getById(req.params as unknown as ProductParam);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = productsService.create(req.body as CreateProductBody);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
};
