export class UserModel {
  id: string = '';
  fullName: string = '';
  userName: string = '';
  email: string = '';
  birthDate: Date = new Date();
  phoneNumber: string = '';
  role: string = '';
  isBlocked: boolean = false;
}
