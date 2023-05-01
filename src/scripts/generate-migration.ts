import { ClickHouseModule } from '../clickhouse/clickhouse.module';
import { ConfigModule } from '../config/config.module';
import { AppConfig } from '../app.config';
import { ClickhouseMigrationService } from '../clickhouse/clickhouse-migration.service';
import * as process from 'process';
import { parseCli } from './utils';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

const options = parseCli(process.argv.slice(3));

@Module({ imports: [ClickHouseModule, ConfigModule.forRoot(AppConfig)] })
class GenerateMigrationModule {}

(() => {
  if (!options.name) {
    return console.error('parameter "name" is required');
  }
  generateMigration(options.name).catch((e) => console.error(e));
})();

async function generateMigration(name) {
  const app = await NestFactory.create(GenerateMigrationModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  await app.init();

  const migrationService = app.get<ClickhouseMigrationService>(ClickhouseMigrationService);
  await migrationService.createMigration(name);
  await app.close();
}
