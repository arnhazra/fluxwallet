import { Institution } from "../../institution/schemas/institution.schema"
import { User } from "@/auth/schemas/user.schema"
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
  startDate?: Date // LUMPSUM_DEPOSIT, RECURRING_DEPOSIT, BOND

  @Prop()
  maturityDate?: Date // LUMPSUM_DEPOSIT, RECURRING_DEPOSIT, BOND

  @Prop()
  amountInvested?: number // LUMPSUM_DEPOSIT, BOND

  @Prop()
  expectedReturnRate?: number // LUMPSUM_DEPOSIT, RECURRING_DEPOSIT, BOND

  @Prop()
  contributionAmount?: number // RECURRING_DEPOSIT

  @Prop()
  contributionFrequency?: RecurringFrequency // RECURRING_DEPOSIT

  @Prop()
  valuationOnPurchase?: number // REAL_ESTATE, METAL, OTHER

  @Prop()
  currentValuation?: number // LIQUID, REAL_ESTATE, METAL, OTHER

  @Prop()
  units?: number // EQUITY, CRYPTO

  @Prop()
  unitPurchasePrice?: number // EQUITY, CRYPTO
}

export const AssetSchema = SchemaFactory.createForClass(Asset)
