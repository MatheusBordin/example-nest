import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MeasureService } from 'src/services/measure.service';
import { v4 as uuid } from 'uuid';

@Controller()
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Get('/:customer/list')
  getMeasuresByCustomer(@Param('customer') customer: string) {
    return this.measureService.listMeasuresByCustomer(customer);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const base64 = file.buffer.toString('base64');
    const id = uuid();

    // todo: get measure value from Gemini.
    const measure_value = 10;

    return await this.measureService.create({
      customer_code: body.customer_code,
      image_url: `data:${file.mimetype};charset=${file.encoding};base64,${base64}`,
      measure_type: body.measure_type,
      measure_datetime: body.measure_datetime,
      measure_uuid: id,
      measure_value,
    });
  }
}
