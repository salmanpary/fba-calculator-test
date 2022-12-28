import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FbaController } from './fba/fba.controller';
import { FbaService } from './fba/fba.service';
import { FbaModule } from './fba/fba.module';
import { FbmController } from './fbm/fbm.controller';
import { FbmModule } from './fbm/fbm.module';
import { FbaSmallController } from './fba-small/fba-small.controller';
import { FbaSmallModule } from './fba-small/fba-small.module';
import { BulkService } from './bulk/bulk.service';
import { BulkModule } from './bulk/bulk.module';
import { AsinController } from './asin/asin.controller';
import { AsinModule } from './asin/asin.module';

@Module({
  imports: [FbaModule, FbmModule, FbaSmallModule, BulkModule, AsinModule],
  controllers: [AppController, FbaController, FbmController, FbaSmallController, AsinController],
  providers: [AppService, BulkService],
})
export class AppModule {}
