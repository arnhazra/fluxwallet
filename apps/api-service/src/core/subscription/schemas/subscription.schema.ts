import { User } from "@/auth/schemas/user.schema"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({
  versionKey: false,
  collection: "subscriptions",
  timestamps: { createdAt: true, updatedAt: false },
})
export class Subscription extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  price: number

  @Prop({
    type: Date,
    default: () => new Date(Date.now() + 1000 * 86400 * 365),
  })
  endsAt: Date
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription)
