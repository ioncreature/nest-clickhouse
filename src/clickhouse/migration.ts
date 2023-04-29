import { ClickHouseService } from './clickhouse.service';

export class Migration {
  /**
   * Run the migrations.
   */
  async up(clickHouse: ClickHouseService): Promise<any> {}

  /**
   * Reverse the migrations.
   */
  down?(clickHouse: ClickHouseService): Promise<any>;
}
