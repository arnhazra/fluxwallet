import { User } from "@/auth/schemas/user.schema"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({
  versionKey: false,
  collection: "spaces",
  timestamps: { createdAt: true, updatedAt: false },
})
export class Space extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  spaceName: string
}

export const SpaceSchema = SchemaFactory.createForClass(Space)
