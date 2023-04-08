import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { Module } from '@nestjs/common';
import { ClickHouseModule } from '../clickhouse/clickhouse.module';

@Module({
  imports: [ClickHouseModule],
  controllers: [InteractionsController],
  providers: [InteractionsService],
})
export class InteractionsModule {}
