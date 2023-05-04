import { ClickHouseService } from '../clickhouse.service';
import { Migration } from '../migration';

export class Migration1683211287Init extends Migration {
  async up(clickHouse: ClickHouseService) {
    await clickHouse.exec(`
      CREATE TABLE IF NOT EXISTS dtu.rx_data (
        "ctag" String,
        "date_time" DateTime64(3, 'UTC'),
        "element" String,
        "element_path" Array(String),
        "element_type" String,
        "event_type" String,
        "page_title" String,
        "topic" String,
        "uid" String,
        "url_domain_name" String,
        "url_parameters" String,
        "url_path" String,
        "url_port" String,
        "url_scheme" String,
        "value" String
      )
      ENGINE = MergeTree
      ORDER BY "date_time";`);
  }
}
