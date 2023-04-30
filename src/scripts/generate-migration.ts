import { Test } from '@nestjs/testing';
import { ClickHouseModule } from '../clickhouse/clickhouse.module';
import { ConfigModule } from '../config/config.module';
import { AppConfig } from '../app.config';
import { ClickhouseMigrationService } from '../clickhouse/clickhouse-migration.service';
import * as process from 'process';
import { parseCli } from './utils';

const options = parseCli(process.argv.slice(3));

(() => {
  if (!options.name) {
    return console.error('parameter "name" is required');
  }
  generateMigration(options.name).catch((e) => console.error(e));
})();

async function generateMigration(name) {
  const module = await Test.createTestingModule({
    imports: [ClickHouseModule, ConfigModule.forRoot(AppConfig)],
  }).compile();
  const migrationService = module.get<ClickhouseMigrationService>(ClickhouseMigrationService);
  const filename = await migrationService.createMigration(name);
  console.log(`Migration generated: ${filename}`);
}
