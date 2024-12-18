import { AddressModel } from "./address.model";
import { BaseModel } from "./base.model";
import { CreditCardModel } from "./credit-card.model";
import { UserModel } from "./user.model";

export class OrderModel extends BaseModel {
  orderId: string = '';
  appUserId: string = '';
  appUser: UserModel = new UserModel();
  orderStatus: number = 0;
  totalPrice: number = 0;
  addressId: string = '';
  address: AddressModel = new AddressModel();
  creditCardId: string = '';
  creditCard: CreditCardModel = new CreditCardModel();
}
