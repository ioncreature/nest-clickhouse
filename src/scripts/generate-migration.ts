import { Test } from '@nestjs/testing';
import { ClickHouseModule } from '../clickhouse/clickhouse.module';
import { ConfigModule } from '../config/config.module';
import { AppConfig } from '../app.config';
import { ClickhouseMigrationService } from '../clickhouse/clickhouse-migration.service';
import * as process from 'process';

const name = process.argv[process.argv.length - 1];

generateMigration().catch((e) => console.error(e));

async function generateMigration(name) {
  const module = await Test.createTestingModule({
    imports: [ClickHouseModule, ConfigModule.forRoot(AppConfig)],
  }).compile();
  const migrationService = module.get<ClickhouseMigrationService>(ClickhouseMigrationService);
  await migrationService.doMigration();
}
