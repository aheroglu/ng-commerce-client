import { BaseModel } from "./base.model";
import { UserModel } from "./user.model";

export class CreditCardModel extends BaseModel {
  appUserId: string = '';
  appUser: UserModel = new UserModel();
  holderName: string = '';
  number: string = '';
  expirationMonth: string = '';
  expirationYear: string = '';
  cvv: string = '';
}
