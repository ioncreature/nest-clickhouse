import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DefaultConfig } from './config/config.service';

export class AppConfig extends DefaultConfig {
  @IsNumber() HTTP_PORT: number;

  @IsString() CLICKHOUSE_URL: string;
  @IsString() CLICKHOUSE_DATABASE: string;
  @IsString() CLICKHOUSE_USER: string;
  @IsString() @IsOptional() CLICKHOUSE_PASSWORD: string;
}
