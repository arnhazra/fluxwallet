import { User } from "@/auth/schemas/user.schema"
import { ExpenseCategory } from "@/shared/constants/types"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({
  versionKey: false,
  collection: "expenses",
  timestamps: { createdAt: true, updatedAt: false },
})
export class Expense extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId

  @Prop()
  title?: string

  @Prop({ required: true })
  expenseAmount: number

  @Prop({ required: true, enum: ExpenseCategory })
  expenseCategory: ExpenseCategory

  @Prop({ required: true })
  expenseDate: Date
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense)
