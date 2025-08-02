import { Institution } from "@/core/institution/schemas/institution.schema"
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
    ref: Institution.name,
    required: true,
  })
  institutionId: Types.ObjectId // COMMON

  @Prop({ required: true })
  assetType: AssetType // COMMON

  @Prop({ required: true })
  assetName: string // COMMON

  @Prop({ required: true })
  identifier: string // COMMON

  @Prop()
  startDate?: Date // FD, RD, SIP, LUMPSUM

  @Prop()
  maturityDate?: Date // FD, RD, SIP, LUMPSUM

  @Prop()
  amountInvested?: number // FD, LUMPSUM

  @Prop()
  expectedReturnRate?: number // FD, RD, SIP, LUMPSUM

  @Prop()
  contributionAmount?: number // RD, SIP

  @Prop()
  contributionFrequency?: RecurringFrequency // RD, SIP

  @Prop()
  valuationOnPurchase?: number // PROPERTY, BOND, METAL, OTHER

  @Prop()
  currentValuation?: number // EPF, PPF, CASH, SAVINGS, PROPERTY, BOND, METAL, OTHER

  @Prop()
  units?: number // EQUITY, CRYPTO

  @Prop()
  unitPurchasePrice?: number // EQUITY, CRYPTO
}

export const AssetSchema = SchemaFactory.createForClass(Asset)
