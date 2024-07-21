export type OrderItemType = {
  name: string;
  photo: string;
  price: string;
  quantity: string;
  _id: string;
};

export type ShippingInfoType={
    address:string;
    city:string;
    state:string;
    country:string;
    pincode:number
}

export interface newOrderReq{
    shippingInfo:ShippingInfoType;
    user:string;
    subtotal:number;
    tax:number;
    shippingCharges:number;
    discount:number;
    total:number;
    orderItems:OrderItemType[];
}
