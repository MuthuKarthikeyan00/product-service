import { NextFunction, Request, Response } from 'express';
import ResponseHandler from '@src/helpers/ResponseHandler';
import Constants from '@src/helpers/constants';
import ProductTypeModel from '@src/models/ProductType';
import {  Prisma } from '@prisma/client';
import { productTypeValidationSchema } from '@src/validator/schema';
import Validator from '@src/validator/Validator';
type Params = Prisma.ProductTypeCreateInput ;

export default class ProductType {


    private static async handleData(body: any, res: Response): Promise<Params> {

        // valiadtion  

        // sanditaion 

        return {
            name: body.name,
            description: body.description,
        }


    }

    public static async create(req: Request, res: Response) {

        try {

            const body = req.body;
            const params = await ProductType.handleData(body, res);

            params.created_by = 1;
            params.created_at = new Date();

            const data = await ProductTypeModel.create(params);
            if (data.id > 0) return ResponseHandler.success(res, Constants.HTTP_STATUS_CODE_CREATED, data);

            return ResponseHandler.error(res);

        } catch (error) {
            return ResponseHandler.error(res);
        }

    }

    public static async update(req: Request, res: Response) {
        try {
            const body = req.body;

            const id = Number(req.params.id);
            if ((req.method=='PUT') && ( !(id > 0) || Number.isNaN(id))) {
                return ResponseHandler.error(
                    res,
                    Constants.HTTP_STATUS_CODE_NOT_FOUND,
                    "invalid id"
                );
            }

            const params = await ProductType.handleData(body, res);
            params.updated_at = new Date();
            params.updated_by = 1

            const data = await ProductTypeModel.update(id, params);
            if (data.id > 0) return ResponseHandler.success(res, Constants.HTTP_STATUS_CODE_OK, data, 'type updated');

            return ResponseHandler.error(res);

        } catch (error) {
            return ResponseHandler.error(res);
        }
    }


    public static async validateProductData(req: Request, res: Response, next: NextFunction) : Promise<Response | void>{ 

        try {
            let { name  } = req.body; 
            const id = Number(req.params.id);
            if ((req.method=='PUT') && ( !(id > 0) || Number.isNaN(id))) {
                return ResponseHandler.error(
                    res,
                    Constants.HTTP_STATUS_CODE_NOT_FOUND,
                    "invalid id"
                );
            }

            name =
            typeof name === "string"
                ? name
                : String(name);
            
            if(req.method=='PUT' && id > 0){
                const product = await ProductTypeModel.getByName(name); 
                if (product && product?.id && product.id !== id) {
                    return ResponseHandler.error(
                        res,
                        Constants.HTTP_STATUS_CODE_NOT_FOUND,
                        "Category name all  ready exists"
                    );
                }else if (!(await ProductTypeModel.isValid(Number(id)))){
                    return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_NOT_FOUND);
                }
            }else {
                const isNameExists = await ProductTypeModel.isNameExists(name);
                if (isNameExists) {
                   return ResponseHandler.error(
                        res,
                        Constants.HTTP_STATUS_CODE_NOT_FOUND,
                        "Category name all  ready exists"
                    );
                }
            }
    
            return next();
        } catch (error) {
            return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, 'Validation failed', error);
        }

    }


    public static async validate(req: Request, res: Response, next: NewableFunction) : Promise<Response | void> {
        try {
            if (!req.body) {
                return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_BAD_REQUEST, 'No data provided');
            }
            const status = await Validator.validate(req.body, productTypeValidationSchema, res);
            if (status) return next();
        } catch (error) {
            console.error(error);
            return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, 'Validation failed', error);
        }

    }


}