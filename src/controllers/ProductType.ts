import { Request, Response } from 'express';
import AttributeModel from '@src/models/Attribute';
import ResponseHandler from '@src/helpers/ResponseHandler';
import Constants from '@src/helpers/constants';
import ProductTypeModel from '@src/models/ProductType';


import { PrismaClient, Prisma } from '@prisma/client';
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
            const id = (typeof req.params.id === 'number') ? req.params.id : Number(req.params.id);       

            if (id <= 0 || !await ProductTypeModel.isValid(Number(id))) return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_NOT_FOUND);
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

}