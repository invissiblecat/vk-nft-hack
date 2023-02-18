import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Metadata } from './metadata.schema';
import { User } from './user.schema';

export type ApplicationDocument = HydratedDocument<Application>;

@Schema()
export class Application {
  @Prop({ type: Boolean, default: false })
  isAccepted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Metadata' })
  desiredTokenMetadata: Metadata;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
