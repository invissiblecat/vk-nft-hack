import { Content } from './Content';
import { User } from './User';

export interface Application {
  _id: string
  user: User
  isAccepted: boolean
  desiredTokenMetadata?: Content
}
