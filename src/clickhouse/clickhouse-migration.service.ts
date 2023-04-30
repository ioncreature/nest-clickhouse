import { Injectable, Logger } from '@nestjs/common';
import { ClickHouseService } from './clickhouse.service';
import { ConfigService } from '../config/config.service';
import { AppConfig } from '../app.config';
import { readdir, writeFile } from 'fs/promises';
import { Migration } from './migration';
import { join } from 'path';
import { camelCase } from 'lodash';

const nameRe = /^\d{10}-\w+\.ts$/;

const scaffoldedClass = `import { ClickHouseService } from '../clickhouse.service';
import { Migration } from '../migration';

export class Migration1682867061Test extends Migration {
  async up(clickHouse: ClickHouseService) {}
}
`;

interface MigrationRow {
  name: string;
}

export type GenericConstructor<T> = new () => T;

@Injectable()
export class ClickhouseMigrationService {
  private readonly logger = new Logger(ClickhouseMigrationService.name);

  constructor(
    private readonly config: ConfigService<AppConfig>,
    private readonly clickhouse: ClickHouseService,
  ) {}

  async createMigration(postfix: string): Promise<string> {
    const { CLICKHOUSE_MIGRATIONS } = this.config.getConfig();
    const tag = `${Math.floor(Date.now() / 1000)}${postfix ? '-' + postfix : ''}`;
    const filename = join(CLICKHOUSE_MIGRATIONS, `${tag}.ts`);
    const content = scaffoldedClass.replace(/ConcreteMigration/gm, `Migration${camelCase(tag)}`);
    await writeFile(filename, content);
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
    await this.clickhouse.exec(`CREATE DATABASE IF NOT EXISTS ${CLICKHOUSE_DATABASE}`);
    await this.clickhouse.exec(
      `CREATE TABLE IF NOT EXISTS ${CLICKHOUSE_DATABASE}.migrations (name String) ENGINE = MergeTree() ORDER BY name;`,
    );
  }

  private async getMigrationsFromDb(): Promise<string[]> {
    const migrations = await this.clickhouse.query<MigrationRow[]>(
      `SELECT * FROM migrations ORDER BY name`,
    );
    return migrations.map((m) => m.name);
  }

  private async getMigrationsFromFs(): Promise<string[]> {
    const { CLICKHOUSE_MIGRATIONS } = this.config.getConfig();
    const dirContent = await readdir(CLICKHOUSE_MIGRATIONS);

    return dirContent.filter((name) => nameRe.test(name));
  }

  private async runMigrations(files: string[]): Promise<void> {
    files.sort();
    for (const name of files) {
      const mod = require(name);
      const migrationClass = findClass(mod);
      if (!migrationClass) {
        this.logger.error(`No migration class found for ${name}`);
      }
      const instance = new migrationClass();
      this.logger.log(`Running ${name}`);
      await instance.up(this.clickhouse);
      await this.clickhouse.insert('migrations', [{ name }]);
      this.logger.log(`Migration ${name} done`);
    }
  }
}

function findClass(mod: any): GenericConstructor<Migration> | null {
  for (const item in mod) {
    if (mod[item] instanceof Migration) {
      return mod[item];
    }
  }
  return null;
}
