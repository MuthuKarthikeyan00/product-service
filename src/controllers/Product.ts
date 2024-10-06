import { NextFunction, Request, Response } from "express";
import ProductModel from "@src/models/Product";
import ResponseHandler from "@src/helpers/ResponseHandler";
import Constants from "@src/helpers/constants";
import ProductTypeModel from "@src/models/ProductType";
import { Prisma } from "@prisma/client";
import Validator from "@src/validator/Validator";
import { productValidationSchema, ZodProductParams } from "@src/validator/schema";
import UnitOfMeasurementModel from "@src/models/UnitOfMeasurement";
import Sanitizer from "@src/helpers/Sanitizer";
import Utils from "@src/helpers/Utils";


type ProductParams = Prisma.ProductCreateInput & {
    type_id: number;
    unit_of_measurement: number;
    parent_id?: number;
};

export default class Product {

    private static async handleData(
        body: any,
        res: Response
    ): Promise<ProductParams> {

        let categoryIds = Utils.isArray(body.category_ids)
            ? body.category_ids.map((item: any) => Number(item))
            : [];

        let children = Utils.isArray(body.children)
            ? body.children.map((item: any) => Number(item))
            : [];
        children = { create: [] };

        let sku = `sku1${body.name}`;

        return Sanitizer.sanitizeHtml({
            sku: sku,
            name: body.name,
            hsn_code:
                Utils.isNumber(body.hsn_code) ? body.hsn_code : Number(body.hsn_code),
            sac_code:
                Utils.isNumber(body.sac_code) ? body.sac_code : Number(body.sac_code),
            tax_rate:
                Utils.isNumber(body.tax_rate) ? body.tax_rate : Number(body.tax_rate),
            tax: Utils.isNumber(body.tax) ? body.tax : Number(body.tax),
            unit_of_measurement: body.unit_of_measurement,
            type_id: body.type_id,
            price: Utils.isNumber(body.price) ? body.price : Number(body.price),
            description: body.description,
            category_ids: categoryIds,
            attributes: body.attributes,
            children: children,
            weight:
                Utils.isNumber(body.weight) ? body.weight : Number(body.weight),
            length:
                Utils.isNumber(body.length) ? body.length : Number(body.length),
            height:
                Utils.isNumber(body.height) ? body.height : Number(body.height),
            width: Utils.isNumber(body.width) ? body.width : Number(body.width),
        });
    }

    public static async create(req: Request, res: Response) {
        try {
            const body = req.body;
            const params = await Product.handleData(body, res);
            this.validateProductData(req, res);

            params.created_by = 1;
            params.created_at = new Date();

            const data = await ProductModel.create(params);
            if (Utils.isGraterthenZero(data.id))
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

            this.validateProductData(req, res);

            const id = Number(req.params.id);
            if ((Utils.checkRequestMethod(req, 'PUT')) && (Utils.isGraterthenZero(id))) {
                return ResponseHandler.error(
                    res,
                    Constants.HTTP_STATUS_CODE_NOT_FOUND,
                    "invalid id"
                );
            }

            const params = await Product.handleData(body, res);
            params.updated_at = new Date();
            params.updated_by = 1;

            const data = await ProductModel.update(id, params);
            if (Utils.isGraterthenZero(id))
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

    public static async validateProductData(req: Request, res: Response): Promise<Response | Boolean> {

        try {
            let { name, type_id, unit_of_measurement } = req.body;
            const id = Utils.getHttpParam(req, 'id');
            if (!Utils.isGraterthenZero(id)) {
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

            if (Utils.isGraterthenZero(id)) {
                const product = await ProductModel.getByName(Sanitizer.sanitizeString(name));
                if (product && product?.id && product.id !== id) {
                    return ResponseHandler.error(
                        res,
                        Constants.HTTP_STATUS_CODE_NOT_FOUND,
                        "Product name all  ready exists"
                    );
                } else if (!(await ProductModel.isValid(Number(id)))) {
                    return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_NOT_FOUND);
                }
            } else {
                const isNameExists = await ProductModel.isNameExists(name);
                if (isNameExists) {
                    return ResponseHandler.error(
                        res,
                        Constants.HTTP_STATUS_CODE_NOT_FOUND,
                        "Product name all  ready exists"
                    );
                }
            }

            const typeId =
                Utils.isNumber(type_id)
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
                Utils.isNumber(unit_of_measurement)
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
            return true;
        } catch (error) {
            return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, 'Validation failed', error);
        }

    }

    public static async validate(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        try {
            const status = await Validator.validate(req.body, productValidationSchema, res)
            if (status) return next();
        } catch (error) {
            return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, 'Validation failed', error);
        }

    }
}



