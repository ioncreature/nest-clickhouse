import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class InteractionDto {
  @Expose()
  @ApiProperty({ type: String })
  ctag: string;

  @Expose()
  @ApiProperty({ type: Number })
  date_time: Number;

  @Expose()
  @ApiProperty({ type: String })
  element: string;

  @Expose()
  @ApiProperty({ type: String, isArray: true })
  element_path: string[];

  @Expose()
  @ApiProperty({ type: String })
  element_type: string;

  @Expose()
  @ApiProperty({ type: String })
  event_type: string;

  @Expose()
  @ApiProperty({ type: String })
  page_title: string;

  @Expose()
  @ApiProperty({ type: String })
  topic: string;

  @Expose()
  @ApiProperty({ type: String })
  uid: string;

  @Expose()
  @ApiProperty({ type: String })
  url_domain_name: string;

  @Expose()
  @ApiProperty({ type: String })
  url_parameters: string;

  @Expose()
  @ApiProperty({ type: String })
  url_path: string;

  @Expose()
  @ApiProperty({ type: String })
  url_port: string;

  @Expose()
  @ApiProperty({ type: String })
  url_scheme: string;

  @Expose()
  @ApiProperty({ type: String })
  value: string;
}
