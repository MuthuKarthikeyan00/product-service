import { PrismaClient, Prisma } from '@prisma/client';
import { NonZeroPositiveNumber } from '@src/types/types';

const prisma = new PrismaClient();

type params = Prisma.ProductCategoryCreateInput;


export default class Category{

    public static async create(params : params) {
        return await prisma.productCategory.create({
            data: params
        })
    }

    public static async update(id:number,params : params) {

        return await prisma.productCategory.update({
            where: {
                id,
              },
              data: params
        })

    }

    public static async get<T extends number>(id : NonZeroPositiveNumber<T> ) {

        return await prisma.productCategory.findUnique({
            where: { id }
          });
    }


    public static async getByName(name : string) {
        return await prisma.productAttribute.findUnique({
            where: { name }
          });
    }


    public static async isNameExists(name : string)  : Promise<boolean>{
        const attribute = await Category.getByName(name);
        return !!attribute?.id
    }

    public static async isValid<T extends number>(id : NonZeroPositiveNumber<T> ) {

        const category = await Category.get(id);
        return !!category?.id
        
    }

    
    

}