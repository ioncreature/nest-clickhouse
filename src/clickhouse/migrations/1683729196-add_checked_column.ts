import { ClickHouseService } from '../clickhouse.service';
import { Migration } from '../migration';

export class Migration1683729196Add extends Migration {
  async up(clickHouse: ClickHouseService) {
    await clickHouse.exec(`
      ALTER TABLE dtu.rx_data ADD COLUMN IF NOT EXISTS
        "checked" Bool
      AFTER "value"
    `);
  }
}
