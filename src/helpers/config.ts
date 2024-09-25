import path from 'path';

export default class Config {


  private static rootPath = __dirname; 

  
  public static getPaths() : object{

      
    return  {
      productsTypes: path.join(this.rootPath, '../modules/products/types'),
    }
   
  }

  public static getPath(key: string = '') : string{
    
    const paths = this.getPaths();

    if (paths[key as keyof typeof paths]) {
      return paths[key as keyof typeof paths];
    }
    return '';
   
  }
  
}

