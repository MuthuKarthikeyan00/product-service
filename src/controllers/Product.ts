import { Request, Response } from 'express';
import ProductModel from '@src/models/Product';
;


export default class Product{

    public static async create(req: Request, res: Response) {


        try {
        const body = req.body;

        let  type_id = (typeof  body.type_id === 'number') ? body.type_id  : Number(body.type_id);

        // const productTypeExists = await prisma.productType.findUnique({
        //     where: { id: type_id }
        //   });

    
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
            created_at: new Date()
        }
        
        const data = await ProductModel.create(params);

         if (data.id > 0) {
            return  res.status(200).json({
                message : "Product created successfully",
                data : data
            })
         }
          

        }catch (error){
            console.log("The error is", error);

                return res.status(500).json({
                    status: 500,
                    message: "Something went wrong.Please try again.",
                });
            

        }
        

    }
    

}