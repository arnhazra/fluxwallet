import { Portfolio } from "@/core/portfolio/schemas/portfolio.schema"
import { User } from "@/core/user/schemas/user.schema"
import { AssetType, RecurringFrequency } from "@/shared/constants/types"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({
  versionKey: false,
  collection: "assets",
  timestamps: { createdAt: true, updatedAt: false },
})
export class Asset extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId // COMMON

  @Prop({
    type: Types.ObjectId,
    ref: Portfolio.name,
    required: true,
  })
  portfolioId: Types.ObjectId // COMMON

  @Prop({ required: true })
  assetType: AssetType // COMMON

  @Prop({ required: true })
  assetName: string // COMMON

  @Prop({ required: true })
  identifier: string // COMMON

  @Prop()
  startDate?: Date // FD, RD, MUTUAL_FUND, SIP, LUMPSUM

  @Prop()
  maturityDate?: Date // FD, RD, MUTUAL_FUND, SIP, LUMPSUM

  @Prop()
  amountInvested?: number // FD, MUTUAL_FUND, LUMPSUM

  @Prop()
  expectedReturnRate?: number // FD, RD, MUTUAL_FUND, SIP, LUMPSUM

  @Prop()
  contributionAmount?: number // RD, SIP

  @Prop()
  contributionFrequency?: RecurringFrequency // RD, SIP

  @Prop()
  valuationOnPurchase?: number // PROPERTY, BOND, METAL, OTHER

  @Prop()
  currentValuation?: number // EPF, PPF, CASH

  @Prop()
  units?: number // EQUITY

  @Prop()
  unitPurchasePrice?: number // EQUITY
}

export const AssetSchema = SchemaFactory.createForClass(Asset)
