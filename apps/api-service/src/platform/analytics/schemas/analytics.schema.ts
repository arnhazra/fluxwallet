import { User } from "@/auth/schemas/user.schema"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({
  versionKey: false,
  collection: "analytics",
  timestamps: { createdAt: true, updatedAt: false },
})
export class Analytics extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId | null

  @Prop({ required: true })
  method: string

  @Prop({ required: true })
  apiUri: string
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics)
