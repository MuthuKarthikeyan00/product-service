import fs from 'fs';


export default class FilesServices {


    public static  getFiles(path : string) : Array<string> {

        if(path =='') return [] ;
        return  fs.readdirSync(path);
    }



}