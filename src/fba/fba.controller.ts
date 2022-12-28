import { Controller } from '@nestjs/common';
import { Get,Post,Body } from '@nestjs/common';
import { FbaService } from './fba.service';

@Controller('fba')
export class FbaController {
    constructor(private readonly fbaService: FbaService) {}
  @Post()
  getReferralFee(@Body() body: any) {
    console.log(body)
    return this.fbaService.CalculateReferralfee(body.category, body.price);
  }
}
