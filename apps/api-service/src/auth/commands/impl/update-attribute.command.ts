import { Currency } from "country-code-enum"
import { User } from "../../schemas/user.schema"

export class UpdateAttributeCommand {
  constructor(
    public readonly userId: string,
    public readonly attributeName: keyof User,
    public readonly attributeValue: string | number | boolean | null | Currency
  ) {}
}
