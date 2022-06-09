import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schema/user.schema';

export type OrderDesignDocument = OrderDesign & Document;

@Schema()
export class OrderDesign {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user?: User;
  @Prop({ type: String })
  plateform: string;
  @Prop({ type: String })
  typeapp: string;
  @Prop({ type: String })
  appName: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: [String] })
  Goal: [string];
  @Prop({ type: String })
  target: string;
  @Prop({ type: String })
  moodBoard: string;
  @Prop({ type: String })
  wireframe: string;
  @Prop({
    type: [
      {
        public_id: { type: String, required: false },
        url: { type: String, required: false },
        format: { type: String, required: false },
      },
    ],
  })
  design?: {
    public_id: string;
    url: string;
    format: string;
  }[];
  @Prop({ type: [String] })
  functionnality: [string];

  @Prop({ type: Date })
  date: Date;
}

export const OrderDesignSchema = SchemaFactory.createForClass(OrderDesign);
