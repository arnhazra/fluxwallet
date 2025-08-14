import { User } from "@/auth/schemas/user.schema"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({
  versionKey: false,
  collection: "tokens",
  timestamps: { createdAt: true, updatedAt: false },
})
export class Token extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  token: string
}

export const TokenSchema = SchemaFactory.createForClass(Token)
