import { Space } from "../../space/schemas/space.schema"
import { User } from "@/auth/schemas/user.schema"
import { AssetType, RecurringFrequency } from "@/shared/constants/types"
import {
  createSchemaFromClass,
  Entity,
  EntityProp,
  IdentifiableEntitySchmea,
  ObjectId,
  ObjectIdType,
} from "@/shared/entity/entity.schema"

@Entity({ collection: "assets" })
export class Asset extends IdentifiableEntitySchmea {
  @EntityProp({ type: ObjectIdType, ref: User.name, required: true })
  userId: ObjectId // COMMON

  @EntityProp({
    type: ObjectIdType,
    ref: Space.name,
    required: true,
  })
  spaceId: ObjectId // COMMON

  @EntityProp({ required: true })
  assetType: AssetType // COMMON

  @EntityProp({ required: true })
  assetName: string // COMMON

  @EntityProp({ required: true })
  identifier: string // COMMON

  @EntityProp()
  startDate?: Date // LUMPSUM_DEPOSIT, RECURRING_DEPOSIT, BOND

  @EntityProp()
  maturityDate?: Date // LUMPSUM_DEPOSIT, RECURRING_DEPOSIT, BOND

  @EntityProp()
  amountInvested?: number // LUMPSUM_DEPOSIT, BOND

  @EntityProp()
  expectedReturnRate?: number // LUMPSUM_DEPOSIT, RECURRING_DEPOSIT, BOND

  @EntityProp()
  contributionAmount?: number // RECURRING_DEPOSIT

  @EntityProp()
  contributionFrequency?: RecurringFrequency // RECURRING_DEPOSIT

  @EntityProp()
  valuationOnPurchase?: number // REAL_ESTATE, METAL, OTHER

  @EntityProp()
  currentValuation?: number // LIQUID, REAL_ESTATE, METAL, OTHER

  @EntityProp()
  units?: number // EQUITY, CRYPTO

  @EntityProp()
  unitPurchasePrice?: number // EQUITY, CRYPTO
}

export const AssetSchema = createSchemaFromClass(Asset)
