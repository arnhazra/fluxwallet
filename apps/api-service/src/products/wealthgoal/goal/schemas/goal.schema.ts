import { User } from "@/auth/schemas/user.schema"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({
  versionKey: false,
  collection: "goals",
  timestamps: { createdAt: true, updatedAt: false },
})
export class Goal extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  goalDate: Date

  @Prop({ required: true })
  goalAmount: number
}

export const GoalSchema = SchemaFactory.createForClass(Goal)
