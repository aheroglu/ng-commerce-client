import { BaseModel } from './base.model';
import { UserModel } from './user.model';

export class AddressModel extends BaseModel {
  appUserId: string = '';
  appUser: UserModel = new UserModel();
  street: string = '';
  city: string = '';
  district: string = '';
  postalCode: string = '';
  fullAddress: string = '';
  addressType: string = '';
}
