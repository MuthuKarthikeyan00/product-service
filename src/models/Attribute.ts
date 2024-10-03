import { PrismaClient, Prisma } from '@prisma/client';
import { NonZeroPositiveNumber } from '@src/types/types';

const prisma = new PrismaClient();

type AttributeParams = Prisma.ProductAttributeCreateInput;


export default class Attribute{

    public static async create(params : AttributeParams) {
        return await prisma.productAttribute.create({
            data: params
        })
    }

    public static async update(id:number,params : AttributeParams) {

        return await prisma.productAttribute.update({
            where: {
                id,
              },
              data: params
        })

    }

    public static async get<T extends number>(id : NonZeroPositiveNumber<T> ) {

        return await prisma.productAttribute.findUnique({
            where: { id }
          });
    }

    public static async getByName(name : string) {
        return await prisma.productAttribute.findUnique({
            where: { name }
          });
    }


    public static async isNameExists(name : string)  : Promise<boolean>{
        const attribute = await Attribute.getByName(name);
        return !!attribute?.id
    }
    

    public static async isValid<T extends number>(id : NonZeroPositiveNumber<T> ) {

        const attribute = await Attribute.get(id);
        return !!attribute?.id
        
    }
    

}