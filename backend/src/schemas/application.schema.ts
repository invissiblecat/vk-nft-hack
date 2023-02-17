import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Metadata } from './metadata.schema';

export type ApplicationDocument = HydratedDocument<Application>;

@Schema()
export class Application {
  @Prop({ required: true })
  userAddress: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Metadata' })
  desiredTokenMetadata: Metadata;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
