import { IsDateString, IsNotEmpty } from "class-validator"

export class CreateEventRequestDto {
  @IsDateString()
  eventDate: Date

  @IsNotEmpty()
  eventName: string
}
