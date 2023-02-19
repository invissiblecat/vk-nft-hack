import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Application } from 'express';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop({ required: true })
  address: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Application' }] })
  applications?: Application[];
}
export const UserSchema = SchemaFactory.createForClass(User);
