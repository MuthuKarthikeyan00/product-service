import { productParams } from "@src/types/types";
import AbstractProductFactory from "./AbstractProductFactory";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type ProductParams = Prisma.ProductCreateInput;

export default  class Simple  extends AbstractProductFactory{

    

    public async create(params: ProductParams): Promise<any> {

        console.log(params);

            const news = await prisma.product.create({
                data: params
            })
        
        
    }

    public async get(params: Array<any>): Promise<any> {
        
    }

    public async update(params: Array<any>): Promise<any> {
        
    }

    public async delete(params: Array<any>): Promise<any> {
        
    }
    

}