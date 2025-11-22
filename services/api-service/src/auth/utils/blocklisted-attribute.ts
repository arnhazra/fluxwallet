import { User } from "../schemas/user.schema"

export const blockListedAttributes: (keyof User)[] = [
  "_id",
  "role",
  "email",
  "hasTrial",
  "avatar",
]
