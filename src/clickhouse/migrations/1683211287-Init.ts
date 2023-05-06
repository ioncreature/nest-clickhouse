import { ClickHouseService } from '../clickhouse.service';
import { Migration } from '../migration';

export class Migration1683211287Init extends Migration {
  async up(clickHouse: ClickHouseService) {
    await clickHouse.exec(`
      CREATE TABLE IF NOT EXISTS dtu.rx_data (
        "ctag" String,
        "dateTime" DateTime64(3, 'UTC'),
        "element" String,
        "elementPath" Array(String),
        "elementType" String,
        "eventType" String,
        "pageTitle" String,
        "topic" String,
        "uid" String,
        "urlDomainName" String,
        "urlParameters" String,
        "urlPath" String,
        "urlPort" String,
        "urlScheme" String,
        "value" String
      )
      ENGINE = MergeTree
      ORDER BY "dateTime";`);
  }
}
