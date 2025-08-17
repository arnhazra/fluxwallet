import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema({
  versionKey: false,
  collection: "otps",
  timestamps: { createdAt: true, updatedAt: false },
})
export class OneTimePassword extends Document {
  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  hashedOTP: string
}

export const OTPSchema = SchemaFactory.createForClass(OneTimePassword)
