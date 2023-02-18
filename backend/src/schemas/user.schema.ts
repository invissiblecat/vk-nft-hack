import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  vkId: string;

  @Prop({ required: true })
  address: string;
}
