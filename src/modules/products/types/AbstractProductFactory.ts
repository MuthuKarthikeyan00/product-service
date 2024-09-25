import { productParams } from "@src/types/types";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type ProductParams = Prisma.ProductCreateInput;
export default abstract class AbstractProductFactory {

    public abstract create(params: ProductParams): Promise<any>
    public abstract get(params: Array<any>): Promise<any>
    public abstract update(params: Array<any>): Promise<any>
    public abstract delete(params: Array<any>): Promise<any>

}