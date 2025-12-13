import { Asset } from "@/apps/wealthanalyzer/asset/schemas/asset.schema"
import { User } from "@/auth/schemas/user.schema"
import {
  createSchemaFromClass,
  Entity,
  EntityProp,
  IdentifiableEntitySchmea,
  ObjectId,
  ObjectIdType,
} from "@/shared/entity/entity.schema"

enum FlowDirection {
  Inward = "inward",
  Outward = "outward",
}

@Entity({ collection: "cashflows" })
export class Goal extends IdentifiableEntitySchmea {
  @EntityProp({ type: ObjectIdType, ref: User.name, required: true })
  userId: ObjectId

  @EntityProp({ type: ObjectIdType, required: true, ref: Asset.name })
  targetAsset: ObjectId

  @EntityProp({ required: true })
  flowDirection: FlowDirection

  @EntityProp({ required: true })
  amount: number
}

export const GoalSchema = createSchemaFromClass(Goal)
