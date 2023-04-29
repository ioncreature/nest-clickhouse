import { Test } from '@nestjs/testing';
import { ClickHouseModule } from '../clickhouse/clickhouse.module';
import { ConfigModule } from '../config/config.module';
import { AppConfig } from '../app.config';
import { ClickhouseMigrationService } from '../clickhouse/clickhouse-migration.service';

runMigrations().catch((e) => console.error(e));

async function runMigrations() {
  const module = await Test.createTestingModule({
    imports: [ClickHouseModule, ConfigModule.forRoot(AppConfig)],
  }).compile();
  const migrationService = module.get<ClickhouseMigrationService>(ClickhouseMigrationService);
  await migrationService.doMigration();
}
