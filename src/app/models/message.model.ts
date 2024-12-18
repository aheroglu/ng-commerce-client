import { BaseModel } from './base.model';

export class MessageModel extends BaseModel {
  name: string = '';
  email: string = '';
  topic: string = '';
  content: string = '';
}
