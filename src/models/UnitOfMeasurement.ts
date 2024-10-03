import { PrismaClient, Prisma } from '@prisma/client';
import { NonZeroPositiveNumber } from '@src/types/types';

const prisma = new PrismaClient();

type paramsType = Prisma.ProductUnitOfMeasurementCreateInput;


export default class UnitOfMeasurement{

    public static async create(params : paramsType) {
        return await prisma.productUnitOfMeasurement.create({
            data: params
        })
    }

    public static async update(id:number,params : paramsType) {

        return await prisma.productUnitOfMeasurement.update({
            where: {
                id,
              },
              data: params
        })

    }

    public static async get<T extends number>(id : NonZeroPositiveNumber<T> ) {

        return await prisma.productUnitOfMeasurement.findUnique({
            where: { id }
          });
    }

    public static async isValid<T extends number>(id : NonZeroPositiveNumber<T> ) {

        const attribute = await UnitOfMeasurement.get(id);
        return !!attribute?.id
        
    }
    

}