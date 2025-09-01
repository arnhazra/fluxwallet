import { User } from "../schemas/user.schema"

export const blackListedAttributes: (keyof User)[] = [
  "_id",
  "role",
  "email",
  "hasTrial",
  "avatar",
]
