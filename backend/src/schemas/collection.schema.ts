import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Metadata } from './metadata.schema';

export type CollectionDocument = HydratedDocument<Collection>;

@Schema()
export class Collection {
  @Prop({ required: true, unique: true })
  collectionAddress: string;

  @Prop({ required: true, unique: true })
  ownerId: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Metadata' }] })
  tokensMetadata: Metadata[];
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
