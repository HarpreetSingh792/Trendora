import {Request,Response,NextFunction} from "express"


export interface newUserRequest {
    _id:string;
    name:string;
    email:string;
    photo:string;
    role:string;
    gender:string;
    dob:Date;
}

export type ControllersType=(req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>