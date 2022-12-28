import { Module } from '@nestjs/common';
import { BulkController } from './bulk.controller';

@Module({
  controllers: [BulkController]
})
export class BulkModule {}
