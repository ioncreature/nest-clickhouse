import { Module } from '@nestjs/common';
import { ClickHouseService } from './clickhouse.service';
import { ClickhouseMigrationService } from './clickhouse-migration.service';

@Module({
  providers: [ClickHouseService, ClickhouseMigrationService],
  exports: [ClickHouseService, ClickhouseMigrationService],
})
export class ClickHouseModule {}
