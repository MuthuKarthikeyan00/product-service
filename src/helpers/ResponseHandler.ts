import  {  Response } from 'express';
import Constants from './constants';
export default class ResponseHandler {

    public static success(res: Response, code : number = Constants.HTTP_STATUS_CODE_OK, data: any = {},message: string='') {

        code = Constants.getSuccessfulHttpStatusCode().includes(code) ? code : Constants.HTTP_STATUS_CODE_OK ;
        message =  message || Constants.getHttpStatusCodeMessage(code);
        data = data || [];

        return res.status(code).json({
            status: code,
            message ,
            data
        });
    }

    public static error (res: Response, code : number = Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR ,error: string = '', ) {

        code = Constants.getClientErrorHttpStatusCodes().includes(code) ? code : Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR ;
        error = error || Constants.getHttpStatusCodeMessage(code);

        return res.status(code).json({
            status: code,
            error 
        });
    }

}