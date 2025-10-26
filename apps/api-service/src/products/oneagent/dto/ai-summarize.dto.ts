import { IsNotEmpty } from "class-validator"

export enum EntityType {
  ASSET = "asset",
  INSTITUTION = "institution",
  DEBT = "debt",
  GOAL = "goal",
  NEWS = "news",
}

export class AISummarizeDto {
  @IsNotEmpty()
  entityType: EntityType

  @IsNotEmpty()
  entityId: string

  newsTitle: string | null | undefined
  newsDescription: string | null | undefined
  newsContent: string | null | undefined
}
