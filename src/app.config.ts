import { IsNumber, IsString } from 'class-validator';
import { DefaultConfig } from './config/config.service';

export class AppConfig extends DefaultConfig {
  @IsNumber() HTTP_PORT: number;

  @IsString() CLICKHOUSE_HOST: string;
  @IsNumber() CLICKHOUSE_PORT: number;
  @IsString() CLICKHOUSE_NAME: string;
  @IsString() CLICKHOUSE_USER: string;
  @IsString() CLICKHOUSE_PASSWORD: string;
}
