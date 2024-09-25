import express, { Request, Response, Router } from 'express';
import Base from './controllers/Base';
import Product from '@src/modules/products/controllers/Product';

export default class ProductsRouters {
    private static router = Router();

    public static init(): Router {

        this.router.post('/create', Product.create);


        return this.router;
    }
}