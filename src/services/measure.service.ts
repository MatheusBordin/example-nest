import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Measure } from 'src/schemas/measures.schema';

@Injectable()
export class MeasureService {
  constructor(
    @InjectModel(Measure.name) private measureModel: Model<Measure>,
  ) {}

  async listMeasuresByCustomer(customer: string) {
    return await this.measureModel.find({ customer_code: customer });
  }

  async create(body: Measure) {
    const hasAnotherMeasure = await this.measureModel.findOne({
      $and: [
        {
          $expr: {
            $and: [
              {
                $eq: [
                  { $month: '$measure_datetime' },
                  { $month: new Date(body.measure_datetime) },
                ],
              },
              {
                $eq: [
                  { $year: '$measure_datetime' },
                  { $year: new Date(body.measure_datetime) },
                ],
              },
            ],
          },
        },
        { customer_code: body.customer_code },
        { measure_type: body.measure_type },
      ],
    });

    if (hasAnotherMeasure) {
      throw new ConflictException(
        `Another measure was been done in the same month for this user.`,
      );
    }

    return await this.measureModel.create(body);
  }
}
