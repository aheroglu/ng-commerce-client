import { BaseModel } from './base.model';
import { ProductModel } from './product.model';
import { UserModel } from './user.model';

export class CartItemModel extends BaseModel {
  appUserId: string = '';
  appUser: UserModel = new UserModel();
  productId: string = '';
  product: ProductModel = new ProductModel();
  quantity: number = 0;
}
