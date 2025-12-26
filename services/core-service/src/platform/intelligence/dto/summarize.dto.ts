import { IsNotEmpty } from "class-validator"

export enum EntityType {
  ASSET = "asset",
  SPACE = "space",
  DEBT = "debt",
  GOAL = "goal",
  NEWS = "news",
}

export class SummarizeDto {
  @IsNotEmpty()
  entityType: EntityType

  @IsNotEmpty()
  entityDetails: string
}
