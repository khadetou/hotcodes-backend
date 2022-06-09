import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schema/user.schema';

export type OrderMarketingDocument = OrderMarketing & Document;

@Schema()
export class OrderMarketing {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user?: User;
  @Prop({ type: Number })
  nombreClient: number;
  @Prop({ type: String })
  besoinClients: string;
  @Prop({ type: String })
  genresClient: string;
  @Prop({ type: Number })
  ageMoyen: number;
  @Prop({ type: String })
  status: string;
  @Prop({ type: [String] })
  moyenVentes: [string];
  @Prop({ type: String })
  problemeVente: string;
  @Prop({ type: String })
  nombreProduits: string;
}

export const OrderMarketingSchema =
  SchemaFactory.createForClass(OrderMarketing);
