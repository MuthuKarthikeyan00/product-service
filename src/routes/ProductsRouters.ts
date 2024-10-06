import { Router } from 'express';
import Product from '@src/controllers/Product';
import Attribute from '@src/controllers/Attribute';
import Category from '@src/controllers/Category';
import UnitOfMeasurement from '@src/controllers/UnitOfMeasurement';
import Type from '@src/controllers/Type';

export default class ProductsRouters {
    private static router = Router();

    public static init(): Router {

        if (!this.router) {
            throw new Error('This.router is null');
        }

        this.router.post('/', Product.validate, Product.create);
        this.router.put('/:id', Product.validate, Product.update);

        this.router.post('/attribute/', Attribute.validate,  Attribute.create);
        this.router.put('/attribute/:id', Attribute.validate,  Attribute.update);

        this.router.post('/type/', Type.validate,  Type.create);
        this.router.put('/type/:id', Type.validate,  Type.update);

        this.router.post('/category/', Category.validate,  Category.create);
        this.router.put('/category/:id', Category.validate,  Category.update);

        this.router.post('/unitOfMeasurement/', UnitOfMeasurement.validate,  UnitOfMeasurement.create);
        this.router.put('/unitOfMeasurement/:id', UnitOfMeasurement.validate, UnitOfMeasurement.update);

        return this.router;
    }
}