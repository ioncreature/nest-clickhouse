import { ClickHouseService } from './clickhouse.service';

export class Migration {
  /**
   * Run the migration
   */
  async up(clickHouse: ClickHouseService): Promise<any> {}

  /**
   * Reverse the migration
   */
  down?(clickHouse: ClickHouseService): Promise<any>;
}
