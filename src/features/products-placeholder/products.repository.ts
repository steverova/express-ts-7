import { type Product, products } from "./products.data";
import type { CreateProductBody, ProductParam, ProductQuery } from "./products.schema";

export const productsRepository = {
  findAll(filters: ProductQuery): Product[] {
    let result = products;

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.minRating !== undefined) {
      result = result.filter((p) => p.rating >= filters.minRating!);
    }

    return result;
  },

  findById(params: ProductParam): Product | undefined {
    return products.find((p) => p.id === params.id);
  },

  create(body: CreateProductBody): Product {
    const newProduct: Product = {
      id: products.length + 1,
      ...body,
    };
    products.push(newProduct);
    return newProduct;
  },
};
