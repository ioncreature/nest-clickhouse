import { ClickHouseService } from '../clickhouse.service';
import { Migration } from '../migration';

export class Migration1683653629ElementPathString extends Migration {
  async up(clickHouse: ClickHouseService) {
    await clickHouse.exec(`
      ALTER TABLE dtu.rx_data ADD COLUMN IF NOT EXISTS
        "element_path_string" String
      AFTER "element_path"
    `);
  }
}
