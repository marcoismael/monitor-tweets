import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document, Schema as MongooseSchema} from 'mongoose'

@Schema()
export class MailList {
    @Prop({type: MongooseSchema.Types.ObjectId})
    id: String
    @Prop({type: [String]})
    emails: string[]
}

export type mailListDocument = MailList & Document
export const mailListSchema = SchemaFactory.createForClass(MailList)
