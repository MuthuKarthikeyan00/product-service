import { Router } from 'express';
import Product from '@src/controllers/Product';
import Attribute from '@src/controllers/Attribute';
import ProductType from '@src/controllers/ProductType';
import Category from '@src/controllers/Category';
import UnitOfMeasurement from '@src/controllers/UnitOfMeasurement';

export default class ProductsRouters {
    private static router = Router();

    public static init(): Router {

        if (!this.router) {
            throw new Error('This.router is null');
        }

        this.router.post('/', Product.validate, Product.validateProductData, Product.create);
        this.router.put('/:id', Product.validate, Product.validateProductData, Product.update);

        this.router.post('/attribute/', Attribute.validate, Attribute.validateProductData, Attribute.create);
        this.router.put('/attribute/:id', Attribute.validate, Attribute.validateProductData, Attribute.update);

        this.router.post('/type/', ProductType.validate, ProductType.validateProductData, ProductType.create);
        this.router.put('/type/:id', ProductType.validate, ProductType.validateProductData, ProductType.update);

        this.router.post('/category/', Category.validate, Category.validateProductData, Category.create);
        this.router.put('/category/:id', Category.validate, Category.validateProductData, Category.update);

        this.router.post('/unitOfMeasurement/', UnitOfMeasurement.validate, UnitOfMeasurement.validateProductData, UnitOfMeasurement.create);
        this.router.put('/unitOfMeasurement/:id', UnitOfMeasurement.validate, UnitOfMeasurement.validateProductData, UnitOfMeasurement.update);

        return this.router;
    }
}