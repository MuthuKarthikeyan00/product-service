export default class Constants {

    public static readonly HTTP_STATUS_CODE_OK = 200;
    public static readonly HTTP_STATUS_CODE_CREATED = 201;
    public static readonly HTTP_STATUS_CODE_BAD_REQUEST = 400;
    public static readonly HTTP_STATUS_CODE_UNAUTHORIZED = 401;
    public static readonly HTTP_STATUS_CODE_FORBIDDEN = 403;
    public static readonly HTTP_STATUS_CODE_NOT_FOUND = 404;
    public static readonly HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR = 500;

    public static  getSuccessfulHttpStatusCode() : Array<number> {
        return [Constants.HTTP_STATUS_CODE_OK, Constants.HTTP_STATUS_CODE_CREATED];
    }


    public static  getClientErrorHttpStatusCodes() : Array<number> {
        return [Constants.HTTP_STATUS_CODE_BAD_REQUEST, Constants.HTTP_STATUS_CODE_UNAUTHORIZED, Constants.HTTP_STATUS_CODE_FORBIDDEN,Constants.HTTP_STATUS_CODE_NOT_FOUND];
    }


    public static  getServerErrorHttpStatusCodes() : Array<number> {
        return [Constants.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR];
    }

    public static  getHttpStatusCodeMessage(code : number ) : string {
        const statusCode: { [key: number]: string } = {
            200 : 'success',
            201 : 'created', 
            400 : 'Client Side Error',
            401 : 'Unauthorized',
            403 : 'Forbidden',
            404 : 'Resource not found',
            500 : 'Something went wrong.Please try again'
        }
        return statusCode?.[code] ?? '';
    }
}
