import { NextFunction, Request, Response } from 'express';
import UnitOfMeasurementModel from '@src/models/UnitOfMeasurement';
import ResponseHandler from '@src/helpers/ResponseHandler';
import Constants from '@src/helpers/constants';
import { Prisma } from '@prisma/client';
import Validator from '@src/validator/Validator';
import { unitOfMeasurementValidationSchema } from '@src/validator/schema';
import Utils from '@src/helpers/Utils';
import Sanitizer from '@src/helpers/Sanitizer';


type ParamsType = Prisma.ProductUnitOfMeasurementCreateInput;

export default class UnitOfMeasurement {


    private static async handleData(body: any, res: Response): Promise<ParamsType> {

        // valiadtion  

        // sanditaion 

        return Sanitizer.sanitizeHtml( {
            name: body.name,
            code: body.code,
            description: body.description,
        });


    }

    public static async create(req: Request, res: Response) {

        try {

            const body = req.body;
            const params = await UnitOfMeasurement.handleData(body, res);

            params.created_by = 1;
            params.created_at = new Date();
            this.validateProductData(req, res);
            const data = await UnitOfMeasurementModel.create(params);
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
            const id = Number(req.params.id);
            this.validateProductData(req, res);
            if ((req.method=='PUT') && ( !(id > 0) || Number.isNaN(id))) {
                return ResponseHandler.error(
                    res,
                    Constants.HTTP_STATUS_CODE_NOT_FOUND,
                    "invalid id"
                );
            }
            
            const params = await UnitOfMeasurement.handleData(body, res);
            params.updated_at = new Date();
            params.updated_by = 1

            const data = await UnitOfMeasurementModel.update(id, params);
            if (data.id > 0) return ResponseHandler.success(res, Constants.HTTP_STATUS_CODE_OK, data, 'Attribute updated');

            return ResponseHandler.error(res);

        } catch (error) {
            return ResponseHandler.error(res);
        }
    }

    public static async validate(req: Request, res: Response, next: NextFunction) {

        try {
            const status = await Validator.validate(req.body, unitOfMeasurementValidationSchema, res)
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
                const product = await UnitOfMeasurementModel.getByName(Sanitizer.sanitizeString(name)); 
                if (product && product?.id && product.id !== id) {
                    return ResponseHandler.error(
                        res,
                        Constants.HTTP_STATUS_CODE_NOT_FOUND,
                        "Category name all  ready exists"
                    );
                }else if (!(await UnitOfMeasurementModel.isValid(Number(id)))){
                    return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_NOT_FOUND);
                }
            }else {
                const isNameExists = await UnitOfMeasurementModel.isNameExists(name);
                if (isNameExists) {
                   return ResponseHandler.error(
                        res,
                        Constants.HTTP_STATUS_CODE_NOT_FOUND,
                        "Category name all  ready exists"
                    );
                }
            }
    
            return false;
        } catch (error) {
            return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, 'Validation failed', error);
        }

    }

}