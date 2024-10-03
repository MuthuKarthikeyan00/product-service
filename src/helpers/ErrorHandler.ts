import { ZodError } from 'zod';

class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    // Set the prototype explicitly for extending built-in classes in TypeScript
    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }

  static handleZodError(error: ZodError): ErrorHandler {
    const message = error.errors.map(err => err.message).join(', ');
    return new ErrorHandler(message, 400);
  }

  static handleGenericError(error: Error): ErrorHandler {
    return new ErrorHandler(error.message, 500);
  }

  public static createError(error:string='Something went wrong'): ErrorHandler {
    return new ErrorHandler(error, 500);
  }


}

export default ErrorHandler;