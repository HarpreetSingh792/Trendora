import {Response, Request , NextFunction} from "express";
import ErrorHandler from "../utils/uitlity-class.js";
import { ControllersType } from "../types/users.js";


// Creating a Middleware for custom errors....
export const errorMiddleware=(error:ErrorHandler,req:Request,res:Response,next:NextFunction)=>{
    error.message||="Internal Server Error";
    error.status||=500;
    if(error.name==="CastError") error.message="Invalid ID"
    return res.status(error.status).json({
      success:false,
      message:error.message
    })
} 


// Try Catch Wrapper Function .....
export const TryCatch=(func:ControllersType)=>(req:Request,res:Response,next:NextFunction)=>{
    return Promise.resolve(func(req,res,next)).catch(next);
}