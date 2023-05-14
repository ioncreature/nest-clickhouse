import { ClickHouseService } from '../clickhouse.service';
import { Migration } from '../migration';

export class Migration1684102652AddUgidsColumn extends Migration {
  async up(clickHouse: ClickHouseService) {
    await clickHouse.exec(`
      ALTER TABLE dtu.rx_data ADD COLUMN IF NOT EXISTS
        "ugids" Array(String)
      AFTER "uid"
    `);
  }
}
