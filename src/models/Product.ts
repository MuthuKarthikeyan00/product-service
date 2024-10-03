import { PrismaClient, Prisma } from '@prisma/client';
import { NonZeroPositiveNumber } from '@src/types/types';

const prisma = new PrismaClient();

type ProductParams = Prisma.ProductCreateInput;


export default class Product{

    public static async create(params : ProductParams) {
        return await prisma.product.create({
            data: params
        })
    }

    public static async update(id:number,params : ProductParams) {

        return await prisma.product.update({
            where: {
                id,
              },
              data: params
        })

    }

    public static async get<T extends number>(id : NonZeroPositiveNumber<T> ) {

        return await prisma.product.findUnique({
            where: { id }
          });
    }
    
    public static async isValid<T extends number>(id : NonZeroPositiveNumber<T> ) {
        const product = await Product.get(id);
        return !!product?.id
    }



    public static async getByName(name : string) {

        return await prisma.product.findUnique({
            where: { name }
          });
    }


    public static async isNameExists(name : string) {
        const product = await Product.getByName(name);
        return !!product?.id
    }
    

}