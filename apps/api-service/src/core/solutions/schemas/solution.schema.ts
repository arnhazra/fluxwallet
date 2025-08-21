import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema({
  versionKey: false,
  collection: "solutions",
  timestamps: { createdAt: true, updatedAt: false },
})
export class Solution extends Document {
  @Prop({ required: true })
  solutionName: string

  @Prop({ required: true })
  displayName: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  icon: string

  @Prop({ required: true })
  image: string

  @Prop({ required: true })
  tags: string[]

  @Prop({ required: true })
  url: string
}

export const SolutionSchema = SchemaFactory.createForClass(Solution)
