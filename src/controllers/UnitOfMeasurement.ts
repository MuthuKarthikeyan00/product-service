import { Request, Response } from 'express';
import UnitOfMeasurementModel from '@src/models/UnitOfMeasurement';
import ResponseHandler from '@src/helpers/ResponseHandler';
import Constants from '@src/helpers/constants';


import { Prisma } from '@prisma/client';


type ParamsType = Prisma.ProductUnitOfMeasurementCreateInput ;

export default class UnitOfMeasurement {


    private static async handleData(body: any, res: Response): Promise<ParamsType> {

        // valiadtion  

        // sanditaion 

        return {
            name: body.name,
            code: body.code,
            description: body.description,
        }


    }

    public static async create(req: Request, res: Response) {

        try {

            const body = req.body;
            const params = await UnitOfMeasurement.handleData(body, res);

            params.created_by = 1;
            params.created_at = new Date();

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
            const id = (typeof req.params.id === 'number') ? req.params.id : Number(req.params.id);       

            if (id <= 0 || !await UnitOfMeasurementModel.isValid(Number(id))) return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_NOT_FOUND);
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

}