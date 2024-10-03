import Constants from '@src/helpers/constants';
import ResponseHandler from '@src/helpers/ResponseHandler';
import { Response } from 'express';
import z, { ZodSchema } from 'zod';
export default class Validator {



  public static async validate(params: any, schema: ZodSchema, res: Response): Promise<any> {
    try {
      schema.parse(params);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation error
        console.error('Validation Error:', error.errors);
        return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_BAD_REQUEST, 'Validation failed', error.errors);
      } else {
        // Handle other errors
        console.error('Error:', error);
        return ResponseHandler.error(res, Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, 'Validation failed', error);
      }
    }

  }

}