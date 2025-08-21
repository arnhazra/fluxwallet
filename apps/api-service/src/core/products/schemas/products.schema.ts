import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema({
  versionKey: false,
  collection: "products",
  timestamps: { createdAt: true, updatedAt: false },
})
export class Products extends Document {
  @Prop({ required: true })
  productName: string

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

export const ProductsSchema = SchemaFactory.createForClass(Products)
