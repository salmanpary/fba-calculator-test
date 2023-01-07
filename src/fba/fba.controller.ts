import { Controller } from '@nestjs/common';
import { Get, Post, Body } from '@nestjs/common';
import { FbaService } from './fba.service';

@Controller('fba')
export class FbaController {
  constructor(private readonly fbaService: FbaService) {}
  @Post()
  async getReferralFee(@Body() body: any) {
    const amazonFee = await this.fbaService.CalculateAmazonFee(
      body.category,
      body.price,
    );
    return { amazonFee };
  }
  @Post('/test')
  async test(@Body() body: any) {
    return this.fbaService.CalculateDetailsForFulfillment(
      body.length,
      body.width,
      body.height,
      body.weight,
      body.unit,
    );
  }
  @Post('/test2')
  async test2(@Body() body: any) {
    return this.fbaService.CalculateProductSizeTier(
      body.weight,
      body.length,
      body.width,
      body.height,
      body.unit,
    );
  }
  @Post('/test3')
  async test3(@Body() body: any) {
    return this.fbaService.CalculateDetailsForFulfillment(
      body.length,
      body.width,
      body.height,
      body.weight,
      body.unit,
    )
  }
  @Post('/test4')
  async test4(@Body() body: any) {
    return this.fbaService.CalculateFulfillmentFee(
      body.length,
      body.width,
      body.height,
      body.weight,
      body.unit,
      body.category,
      body.addOn,
      body.shippingToAmazon
    )
  }
  @Post ('/test5')
  async test5(@Body() body: any) {
    return this.fbaService.CalculateStorageFee(
      body.length,
      body.width,
      body.height,
      body.weight,
      body.unit,
      body.monthStart,
      body.monthEnd,
      body.averageInventoryStored,
      body.monthlyUnitsSold
    )
  }
  @Post('/test6')
  async test6(@Body() body: any) {
    return this.fbaService.CalculateOtherCosts(
      body.costsOfGoodsSold,
      body.miscCost,
    )
  }
  @Post('/test7')
  async test7(@Body() body: any) {
    return this.fbaService.CalculateAllDetails(
      body.length,
      body.width,
      body.height,
      body.weight,
      body.unit,
      body.price,
      body.category,
      body.addOn,
      body.shippingToAmazon,
      body.monthStart,
      body.monthEnd,
      body.averageInventoryStored,
      body.monthlyUnitsSold,
      body.costsOfGoodsSold,
      body.miscCost,
      body.estimatedSales,
      

    )
  }
}
