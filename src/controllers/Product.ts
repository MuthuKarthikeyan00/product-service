import { Request, Response } from 'express';
import ProductModel from '@src/models/Product';
import ResponseHandler from '@src/helpers/ResponseHandler';
import Constants from '@src/helpers/constants';
import ProductType from '@src/models/ProductType';


import { PrismaClient, Prisma } from '@prisma/client';


type ProductParams = Prisma.ProductCreateInput & {
    type_id: number,
    parent_id?: number

};

export default class Product {


    private static async handleData(body: any, res: Response): Promise<ProductParams> {

        // valiadtion  

        // sanditaion 

        const type_id = (typeof body.type_id === 'number') ? body.type_id : await ProductType.isValid(Number(body.type_id));

        !type_id && ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_NOT_FOUND, 'Product type not found');

        let category_ids = JSON.parse(body.category_ids);
        category_ids = Array.isArray(category_ids) ? category_ids.map((item: any) => Number(item)) : [];

        let children = JSON.parse(body.children);
        children = Array.isArray(children) ? children.map((item: any) => ({ id: Number(item) })) : [];
        children = { create: [] }

        return {
            name: body.name,
            type_id: (typeof body.type_id === 'number') ? body.type_id : Number(body.type_id),
            price: (typeof body.price === 'number') ? body.price : Number(body.price),
            description: body.description,
            category_ids: category_ids,
            attributes: body.attributes,
            children: children,
            weight: (typeof body.weight === 'number') ? body.weight : Number(body.weight),
            length: (typeof body.length === 'number') ? body.length : Number(body.length),
            height: (typeof body.height === 'number') ? body.height : Number(body.height),
            width: (typeof body.width === 'number') ? body.width : Number(body.width),
        }


    }

    public static async create(req: Request, res: Response) {

        try {

            const body = req.body;
            const params = await Product.handleData(body, res);

            params.created_by = 1;
            params.created_at = new Date();

            const data = await ProductModel.create(params);
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

            if (id <= 0 || !await ProductModel.isValid(Number(id))) return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_NOT_FOUND);

            const params = await Product.handleData(body, res);
            params.updated_at = new Date();
            params.updated_by = 1;

            const data = await ProductModel.update(id, params);
            if (data.id > 0) return ResponseHandler.success(res, Constants.HTTP_STATUS_CODE_OK, data, 'product updated');

            return ResponseHandler.error(res);

        } catch (error) {
            return ResponseHandler.error(res);
        }
    }

}