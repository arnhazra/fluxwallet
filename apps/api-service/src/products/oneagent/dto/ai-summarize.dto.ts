import { IsNotEmpty } from "class-validator"

export enum EntityType {
  ASSET = "asset",
  INSTITUTION = "institution",
  DEBT = "debt",
  GOAL = "goal",
}

export class AISummarizeDto {
  @IsNotEmpty()
  entityId: string

  @IsNotEmpty()
  entityType: EntityType
}
