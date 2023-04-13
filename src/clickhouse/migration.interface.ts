import { ClickHouseService } from './clickhouse.service';

export interface MigrationInterface {
  /**
   * Run the migrations.
   */
  up(clickHouse: ClickHouseService): Promise<any>;

  /**
   * Reverse the migrations.
   */
  down?(clickHouse: ClickHouseService): Promise<any>;
}
