import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Application } from './application.schema';
import { Collection } from './collection.schema';

export type MetadataDocument = HydratedDocument<Metadata>;

@Schema()
export class Metadata {
  @Prop({ required: true })
  tokenId: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Collection',
    required: true,
  })
  nftCollection: Collection;

  @Prop()
  title: string;

  @Prop()
  txHash: string;

  @Prop()
  tokenDescription?: string;

  @Prop()
  link?: string;

  @Prop()
  text?: string;

  @Prop()
  pathToImage?: string;

  @Prop()
  pathToPreview?: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Application' }],
  })
  applications?: Application[];
}

export const MetadataSchema = SchemaFactory.createForClass(Metadata);
