import { Module } from '@nestjs/common';
import { FbaSmallService } from './fba-small.service';

@Module({
  providers: [FbaSmallService]
})
export class FbaSmallModule {}
