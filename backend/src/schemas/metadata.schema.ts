import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MetadataDocument = HydratedDocument<Metadata>;

@Schema()
export class Metadata {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ required: true })
  tokenId: string;

  @Prop({ required: true })
  collectionAddress: string;

  @Prop()
  link?: string;

  @Prop()
  text?: string;

  @Prop()
  pathToImage?: string;
}

export const MetadataSchema = SchemaFactory.createForClass(Metadata);
