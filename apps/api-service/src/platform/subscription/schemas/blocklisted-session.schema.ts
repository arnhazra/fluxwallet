import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema({
  versionKey: false,
  collection: "blocklisted-session-id",
  timestamps: { createdAt: true, updatedAt: false },
})
export class BlockListedSession extends Document {
  @Prop({ required: true })
  stripeSessionId: string
}

export const BlockListedSessionSchema =
  SchemaFactory.createForClass(BlockListedSession)
