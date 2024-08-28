import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MeasureDocument = HydratedDocument<Measure>;

@Schema()
export class Measure {
  @Prop()
  customer_code: string;

  @Prop()
  measure_uuid: string;

  @Prop()
  measure_value: number;

  @Prop()
  image_url: string;

  @Prop()
  measure_type: string;

  @Prop({ type: Date })
  measure_datetime: Date;
}

export const MeasureSchema = SchemaFactory.createForClass(Measure);
