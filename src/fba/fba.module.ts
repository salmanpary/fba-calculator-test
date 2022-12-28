import { Module } from '@nestjs/common';
import { FbaRepository } from './fba.repository';
import { FbaService } from './fba.service';
import { FbaController } from './fba.controller';
@Module({
    exports: [FbaService],
    imports: [],
    controllers: [FbaController],
    providers: [FbaService, FbaRepository],

})
export class FbaModule {
}
