import { Currency } from "@/shared/constants/types"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema({
  versionKey: false,
  collection: "users",
  timestamps: { createdAt: true, updatedAt: false },
})
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  name: string

  @Prop({ default: "user" })
  role: string

  @Prop({ default: Currency.USD })
  baseCurrency: Currency

  @Prop({ default: null })
  wealthGoal: number | null

  @Prop({ default: 0 })
  currentLiabilities: number

  @Prop({ type: Boolean, default: true })
  reduceCarbonEmissions: boolean

  @Prop({ type: Boolean, default: true })
  activityLog: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)
