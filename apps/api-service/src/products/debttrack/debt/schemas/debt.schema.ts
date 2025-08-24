import { User } from "@/auth/schemas/user.schema"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({
  versionKey: false,
  collection: "debts",
  timestamps: { createdAt: true, updatedAt: false },
})
export class Debt extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  debtPurpose: string

  @Prop({ required: true })
  identifier: string

  @Prop()
  startDate: Date

  @Prop()
  endDate: Date

  @Prop()
  principalAmount: number

  @Prop()
  interestRate: number

  @Prop()
  installment: number
}

export const DebtSchema = SchemaFactory.createForClass(Debt)
