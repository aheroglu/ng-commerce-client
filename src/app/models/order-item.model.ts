import { BaseModel } from "./base.model";
import { OrderModel } from "./order.model";
import { ProductModel } from "./product.model";

export class OrderItemModel extends BaseModel {
  orderId: string = '';
  order: OrderModel = new OrderModel();
  productId: string = '';
  product: ProductModel = new ProductModel();
  quantity: number = 0;
  totalPrice: number = 0;
}
