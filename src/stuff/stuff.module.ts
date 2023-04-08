import { StuffController } from './stuff.controller';
import { StuffService } from './stuff.service';
import { Module } from '@nestjs/common';
import { ClickHouseModule } from '../clickhouse/clickhouse.module';

@Module({
  imports: [ClickHouseModule],
  controllers: [StuffController],
  providers: [StuffService],
})
export class StuffModule {}
