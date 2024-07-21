export interface newProdReq{
    name:string;
    price:number;
    stocks:number;
    category:string;
    description:string;
}

export interface searchProdQuery{
    search?:string;
    sort?:string;
    category?:string;
    page?:string;
    price?:string;
}

export interface SearchQuery{
    name?:{
        $regex:string,
        $options:string
    },
    price?:{
        $lte:number
    },
    category?:string
}


export type InvalidateCacheProps={
    product?:boolean;
    order?:boolean;
    admin?:boolean;
    orderId?:string;
    productId?:string|string[];
    userId?:string
}