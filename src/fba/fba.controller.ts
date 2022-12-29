import { Controller } from '@nestjs/common';
import { Get, Post, Body } from '@nestjs/common';
import { FbaService } from './fba.service';

@Controller('fba')
export class FbaController {
  constructor(private readonly fbaService: FbaService) {}
  @Post()
  async getReferralFee(@Body() body: any) {
    console.log(body);
    const amazonFee = await this.fbaService.CalculateAmazonFee(
      body.category,
      body.price,
    )
    return {amazonFee};
  }
}
