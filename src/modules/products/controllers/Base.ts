import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import Config from '../../../helpers/config';
import path from 'path';

import AbstractProductFactory from '@src/modules/products/types/AbstractProductFactory';
import { json } from 'stream/consumers';

type modules = { type: string, name: string, path: string }
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export default class Base {

    private static getModuleList() {

        return {
            simple: {
                type: 'simple',
                name: 'SimpleProductFactory',
                path: '@src/modules/products/types/Simple'
            }
        }

    }

    private static getModule(type: string): modules | false {

        const modules = Base.getModuleList();
        return modules[type as keyof typeof modules] ? modules[type as keyof typeof modules] : false;
    }

    private static async createInstance(type: string) {

        const module = Base.getModule(type);
        if (!module) return false;
        const { default: Class } = await import(module.path);
        if (!(Class.prototype instanceof AbstractProductFactory)) return false;
        return new Class();
    }

    public static async create(req: Request, res: Response) {


        // console.log(req);
        const body = req.body;



        // validation


        const obj = await Base.createInstance('simple');
        if (typeof obj.create !== 'function') return false;


        let  type_id = (typeof  body.type_id === 'number') ? body.type_id  : Number(body.type_id);

        const productTypeExists = await prisma.productType.findUnique({
            where: { id: type_id }
          });


          
    
        let category_ids = JSON.parse(body.category_ids);
        category_ids =  Array.isArray(category_ids)? category_ids.map((item:any)=> Number(item)) : [] ;

        let children = JSON.parse(body.children);
        children =  Array.isArray(children)? children.map((item:any)=>  ({id:Number(item)}) ) : [] ;
        children = { create: [] }

        const params = {
            name: body.name,
            type_id: (typeof  body.type_id === 'number') ? body.type_id  : Number(body.type_id),
            price:(typeof  body.price === 'number') ? body.price  : Number(body.price),
            description: body.description,
            category_ids: category_ids,
            attributes: body.attributes,
            parent_id: null,
            children:children,
            weight: (typeof  body.weight === 'number') ? body.weight  : Number(body.weight),
            length: (typeof  body.length === 'number') ? body.length  : Number(body.length),
            height: (typeof  body.height === 'number') ? body.height  : Number(body.height),
            width: (typeof  body.width === 'number') ? body.width  : Number(body.width),
            created_by: 1,
            created_at: body.created_at
        }

        obj.create(params);

    }
}