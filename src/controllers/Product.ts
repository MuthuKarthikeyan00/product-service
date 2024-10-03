import { NextFunction, Request, Response } from "express";
import ProductModel from "@src/models/Product";
import ResponseHandler from "@src/helpers/ResponseHandler";
import Constants from "@src/helpers/constants";
import ProductTypeModel from "@src/models/ProductType";
import { PrismaClient, Prisma } from "@prisma/client";
import Validator from "@src/validator/Validator";
import { productValidationSchema, ZodProductParams } from "@src/validator/schema";
import { z } from 'zod';
import ErrorHandler from "@src/helpers/ErrorHandler";
import UnitOfMeasurementModel from "@src/models/UnitOfMeasurement";


type ProductParams = Prisma.ProductCreateInput & {
    type_id: number;
    unit_of_measurement: number;
    parent_id?: number;
};

export default class Product {


    private static async checkProductFilds(params : ZodProductParams ){

    }
        // valiadtion   

    private static async handleData(
        body: any,
        res: Response
    ): Promise<ProductParams > {
      
        let categoryIds = Array.isArray(body.category_ids)
            ? body.category_ids.map((item: any) => Number(item))
            : [];

        let children = Array.isArray(body.children)
            ? body.children.map((item: any) => Number(item))
            : [];    
        children = { create: [] };

        let sku = `sku1${body.name}`;

        return {
            sku: sku,
            name: body.name,
            hsn_code:
                typeof body.hsn_code === "number" ? body.hsn_code : Number(body.hsn_code),
            sac_code:
                typeof body.sac_code === "number" ? body.sac_code : Number(body.sac_code),
            tax_rate:
                typeof body.tax_rate === "number" ? body.tax_rate : Number(body.tax_rate),
            tax: typeof body.tax === "number" ? body.tax : Number(body.tax),
            unit_of_measurement:body.unit_of_measurement,
            type_id:body.type_id,
            price: typeof body.price === "number" ? body.price : Number(body.price),
            description: body.description,
            category_ids: categoryIds,
            attributes: body.attributes,
            children: children,
            weight:
                typeof body.weight === "number" ? body.weight : Number(body.weight),
            length:
                typeof body.length === "number" ? body.length : Number(body.length),
            height:
                typeof body.height === "number" ? body.height : Number(body.height),
            width: typeof body.width === "number" ? body.width : Number(body.width),
        };
    }

    public static async create(req: Request, res: Response) {
        try {
            const body = req.body;
            const params = await Product.handleData(body, res);

            params.created_by = 1;
            params.created_at = new Date();

            const data = await ProductModel.create(params);
            if (data.id > 0)
                return ResponseHandler.success(
                    res,
                    Constants.HTTP_STATUS_CODE_CREATED,
                    data
                );
            return ResponseHandler.error(res);
        } catch (error) {
            return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, 'Validation failed', error);
        }
    }

    public static async update(req: Request, res: Response) {
        try {
            const body = req.body;
            const id =
                typeof req.params.id === "number"
                    ? req.params.id
                    : Number(req.params.id);

            if (id <= 0 || !(await ProductModel.isValid(Number(id))))
                return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_NOT_FOUND);

            const params = await Product.handleData(body, res);
            params.updated_at = new Date();
            params.updated_by = 1;

            const data = await ProductModel.update(id, params);
            if (data.id > 0)
                return ResponseHandler.success(
                    res,
                    Constants.HTTP_STATUS_CODE_OK,
                    data,
                    "product updated"
                );

            return ResponseHandler.error(res);
        } catch (error) {
            return ResponseHandler.error(res);
        }
    }

    public static async validate(req: Request, res: Response, next: NextFunction) {

        try {
            const status = await Validator.validate(req.body, productValidationSchema, res)
            if (status) return next();
        } catch (error) {
            return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, 'Validation failed', error);
        }

    }


    public static async validateProductData(req: Request, res: Response, next: NextFunction) : Promise<Response | void>{ 

        try {
            let { name , type_id ,unit_of_measurement } = req.body;

            name =
            typeof name === "string"
                ? name
                : String(name);
    
                const isNameExists = await ProductModel.isNameExists(name);
                if (isNameExists) {
                   return ResponseHandler.error(
                        res,
                        Constants.HTTP_STATUS_CODE_NOT_FOUND,
                        "Product name all  ready exists"
                    );
                }
                   
    
            const typeId =
                typeof type_id === "number"
                    ? type_id
                    : Number(type_id);
    
            const isValidProductType = await ProductTypeModel.isValid(typeId);
            if (!isValidProductType) {
                return ResponseHandler.error(
                    res,
                    Constants.HTTP_STATUS_CODE_NOT_FOUND,
                    "Product type not found"
                );
            }
    
            const unitOfMeasurement =
                typeof unit_of_measurement === "number"
                    ? unit_of_measurement
                    : Number(unit_of_measurement);
    
            const isValidUnitOfMeasurement = await UnitOfMeasurementModel.isValid(unitOfMeasurement);
            if (!isValidUnitOfMeasurement) {
                return ResponseHandler.error(
                    res,
                    Constants.HTTP_STATUS_CODE_NOT_FOUND,
                    "Unit Of Measurement type not found"
                );
            }
            return next();
        } catch (error) {
            return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, 'Validation failed', error);
        }

    }
}
