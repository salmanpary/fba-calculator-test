import { Module } from '@nestjs/common';
import { FbmService } from './fbm.service';

@Module({
  providers: [FbmService]
})
export class FbmModule {}
