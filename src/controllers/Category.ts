import { NextFunction, Request, Response } from 'express';
import AttributeModel from '@src/models/Attribute';
import ResponseHandler from '@src/helpers/ResponseHandler';
import Constants from '@src/helpers/constants';
import CategoryModel from '@src/models/Category';


import { PrismaClient, Prisma } from '@prisma/client';
import { categoryValidationSchema } from '@src/validator/schema';
import Validator from '@src/validator/Validator';
import Utils from '@src/helpers/Utils';
import Sanitizer from '@src/helpers/Sanitizer';


type Params = Prisma.ProductCategoryCreateInput ;

export default class Category {


    private static async handleData(body: any, res: Response): Promise<Params> {

        // valiadtion  

        // sanditaion 

        return Sanitizer.sanitizeHtml({
            name: body.name,
            description: body.description,
        });


    }

    public static async create(req: Request, res: Response) {

        try {

            const body = req.body;
            const params = await Category.handleData(body, res);
            this.validateProductData(req, res);
            params.created_by = 1;
            params.created_at = new Date();

            const data = await CategoryModel.create(params);
            if (data.id > 0) return ResponseHandler.success(res, Constants.HTTP_STATUS_CODE_CREATED, data);

            return ResponseHandler.error(res);

        } catch (error) {
            console.log(error);
            
            return ResponseHandler.error(res);
        }

    }

    public static async update(req: Request, res: Response) {
        try {
            const body = req.body;
            const id = Utils.getHttpParam(req, 'id');
            if (!Utils.isGraterthenZero(id)) {
                return ResponseHandler.error(
                    res,
                    Constants.HTTP_STATUS_CODE_NOT_FOUND,
                    "invalid id"
                );
            }
            this.validateProductData(req, res);
            
            const params = await Category.handleData(body, res);
            params.updated_at = new Date();
            params.updated_by = 1

            const data = await CategoryModel.update(Number(id), params);
            if (Utils.isGraterthenZero(data.id)) return ResponseHandler.success(res, Constants.HTTP_STATUS_CODE_OK, data, 'Attribute updated');

            return ResponseHandler.error(res);

        } catch (error) {
            return ResponseHandler.error(res);
        }
    }

    public static async validate(req: Request, res: Response, next: NextFunction) {

        try {
            const status = await Validator.validate(req.body, categoryValidationSchema, res)
            if (status) return next();
        } catch (error) {
            return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, 'Validation failed', error);
        }

    }

    public static async validateProductData(req: Request, res: Response) : Promise<Response | Boolean>{ 

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
                Utils.isString(name)
                    ? name
                    : String(name);
            
            if(req.method=='PUT' && id > 0){
                const product = await CategoryModel.getByName(Sanitizer.sanitizeString(name)); 
                if (product && product?.id && product.id !== id) {
                    return ResponseHandler.error(
                        res,
                        Constants.HTTP_STATUS_CODE_NOT_FOUND,
                        "Category name all  ready exists"
                    );
                }else if (!(await CategoryModel.isValid(Number(id)))){
                    return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_NOT_FOUND);
                }
            }else {
                const isNameExists = await CategoryModel.isNameExists(name);
                if (isNameExists) {
                   return ResponseHandler.error(
                        res,
                        Constants.HTTP_STATUS_CODE_NOT_FOUND,
                        "Category name all  ready exists"
                    );
                }
            }
    
            return true;
        } catch (error) {
            return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, 'Validation failed', error);
        }

    }

}