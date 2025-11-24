import { User } from "@/auth/schemas/user.schema"
import {
  createSchemaFromClass,
  Entity,
  EntityProp,
  IdentifiableEntitySchmea,
  ObjectId,
  ObjectIdType,
} from "@/shared/entity/entity.schema"

@Entity({ collection: "debts" })
export class Debt extends IdentifiableEntitySchmea {
  @EntityProp({ type: ObjectIdType, ref: User.name, required: true })
  userId: ObjectId

  @EntityProp({ required: true })
  debtPurpose: string

  @EntityProp({ required: true })
  identifier: string

  @EntityProp()
  startDate: Date

  @EntityProp()
  endDate: Date

  @EntityProp()
  principalAmount: number

  @EntityProp()
  interestRate: number
}

export const DebtSchema = createSchemaFromClass(Debt)
