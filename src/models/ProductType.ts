import { PrismaClient, Prisma } from '@prisma/client';
import { NonZeroPositiveNumber } from '@src/types/types';

const prisma = new PrismaClient();

type ProductParams = Prisma.ProductTypeCreateInput;


export default class ProductType{

    public static async create(params : ProductParams) {

        return await prisma.productType.create({
            data: params
        })

    }

    public static async update(id:number,params : ProductParams) {

        return await prisma.productType.update({
            where: {
                id,
              },
              data: params
        })

    }

    public static async get<T extends number>(id : NonZeroPositiveNumber<T> ) {

        return await prisma.productType.findUnique({
            where: { id }
          });
    }

    public static async getByName(name : string) {
        return await prisma.productType.findUnique({
            where: { name }
          });
    }


    public static async isNameExists(name : string)  : Promise<boolean>{
        const attribute = await ProductType.getByName(name);
        return !!attribute?.id
    }

    public static async isValid<T extends number>(id : NonZeroPositiveNumber<T> ) {

        const productType = await ProductType.get(id);
        return !!productType?.id
        
    }
    

}