import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String })
  googleId?: string;
  @Prop({ required: true, type: String })
  firstName: string;
  @Prop({ required: true, type: String })
  lastName: string;
  @Prop({ required: true, type: String })
  email: string;
  @Prop({ type: String, default: '0' })
  phone: string;
  @Prop({ type: String })
  password?: string;
  @Prop({ type: [String], enum: ['admin', 'user'], default: ['user'] })
  roles: string[];
  @Prop({ type: String })
  resetPasswordToken?: string;
  @Prop({ type: Date })
  resetPasswordExpiration?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
