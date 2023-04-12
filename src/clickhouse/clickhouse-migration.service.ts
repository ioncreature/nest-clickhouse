import { Injectable } from '@nestjs/common';
import { ClickHouseService } from './clickhouse.service';
import { ConfigService } from '../config/config.service';
import { AppConfig } from '../app.config';

@Injectable()
export class ClickhouseMigrationService {
  constructor(
    private readonly config: ConfigService<AppConfig>,
    private readonly clickhouse: ClickHouseService,
  ) {}

  async createMigration(postfix: string): Promise<string> {
    const ts = Math.floor(Date.now() / 1000);
    const filename = `${ts}${postfix || ''}.ts`;
    // todo: creates new file with scaffolded ts code for migration in migrations folder with properly ordered name
    return filename;
  }

  async doMigration() {
    await this.createDb();
    const migrationsFromDb = await this.getMigrationsFromDb();
    const migrationsFromFs = await this.getMigrationsFromFs();

    const maxFromDb = migrationsFromDb.reduce((res, cur) => (cur > res ? cur : res), null);
    const todoFromFs = migrationsFromFs.filter((name) => name > maxFromDb).sort();

    await this.runMigrations(todoFromFs);
  }

  private async createDb() {
    const { CLICKHOUSE_DATABASE } = this.config.getConfig();
    await this.clickhouse.exec(`CREATE DATABASE IF NOT EXIST ${CLICKHOUSE_DATABASE}`);
    await this.clickhouse.exec(
      `CREATE TABLE ${CLICKHOUSE_DATABASE}.migrations (name String) ENGINE = MergeTree() PRIMARY KEY (name)`,
    );
  }

  private async getMigrationsFromDb(): Promise<string[]> {
    return []; // todo: implement
  }

  private async getMigrationsFromFs(): Promise<string[]> {
    return []; // todo: implement
  }

  private async runMigrations(files: string[]): Promise<void> {
    // todo: implement
  }
}
