import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type ProductParams = Prisma.ProductCreateInput;


export default class Product{

    public static async create(params : ProductParams) {

        const product = await prisma.product.create({
            data: params
        })

        return product;
       
    }
    

}