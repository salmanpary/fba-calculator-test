import { Module } from '@nestjs/common';
import { AsinService } from './asin.service';

@Module({
  providers: [AsinService]
})
export class AsinModule {}
