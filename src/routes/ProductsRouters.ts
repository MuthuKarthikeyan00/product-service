import express, { Request, Response, Router } from 'express';
import Product from '@src/controllers/Product';

export default class ProductsRouters {
    private static router = Router();

    public static init(): Router {

        this.router.post('/create', Product.create);
        return this.router;
    }
}