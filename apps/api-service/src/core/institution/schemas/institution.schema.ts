import { User } from "@/core/user/schemas/user.schema"
import { InstitutionType } from "@/shared/constants/types"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({
  versionKey: false,
  collection: "institutions",
  timestamps: { createdAt: true, updatedAt: false },
})
export class Institution extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  institutionName: string

  @Prop({ enum: InstitutionType, default: InstitutionType.OTHER })
  institutionType: InstitutionType
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution)
