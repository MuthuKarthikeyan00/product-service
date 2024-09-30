import express, { Request, Response, Router } from 'express';
import Product from '@src/controllers/Product';
import Attribute from '@src/controllers/Attribute';
import ProductType from '@src/controllers/ProductType';
import Category from '@src/controllers/Category';

export default class ProductsRouters {
    private static router = Router();

    public static init(): Router {

        this.router.post('/', Product.create);
        this.router.put('/:id', Product.update);

        this.router.post('/attribute/', Attribute.create);
        this.router.put('/attribute/:id', Attribute.update);

        this.router.post('/type/', ProductType.create);
        this.router.put('/type/:id', ProductType.update);

        this.router.post('/category/', Category.create);
        this.router.put('/category/:id', Category.update);

        return this.router;
    }
}