import { BaseModel } from './base.model';
import { UserModel } from './user.model';

export class BlacklistModel extends BaseModel {
  appUserId: string = '';
  appUser: UserModel = new UserModel();
  reason: string = '';
}
