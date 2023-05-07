import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { Module } from '@nestjs/common';
import { ClickHouseModule } from '../clickhouse/clickhouse.module';

@Module({
  imports: [ClickHouseModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
