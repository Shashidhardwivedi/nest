// user.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  mobile: string;

  @Prop()
  otp:number;

  @Prop({ default: false })
  isLoggedIn: boolean; 

  @Prop({ type: Date, default: Date.now }) 
  otpSentAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
