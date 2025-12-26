import {
  createSchemaFromClass,
  Entity,
  EntityProp,
  IdentifiableEntitySchmea,
} from "@/shared/entity/entity.schema"

@Entity({ collection: "otps" })
export class OneTimePassword extends IdentifiableEntitySchmea {
  @EntityProp({ required: true, unique: true })
  email: string

  @EntityProp({ required: true })
  hashedOTP: string
}

export const OTPSchema = createSchemaFromClass(OneTimePassword)
