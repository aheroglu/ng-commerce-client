import { BaseModel } from "./base.model";
import { ProductModel } from "./product.model";

export class ProductImageModel extends BaseModel {
  image: string = '';
  productId: string = ''
  product: ProductModel = new ProductModel();
}
