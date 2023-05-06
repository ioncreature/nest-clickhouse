import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class InteractionDto {
  @Expose()
  @ApiProperty({ type: String })
  ctag: string;

  @Expose()
  @ApiProperty({ type: Date })
  dateTime: Date;

  @Expose()
  @ApiProperty({ type: String })
  element: string;

  @Expose()
  @ApiProperty({ type: String, isArray: true })
  elementPath: string[];

  @Expose()
  @ApiProperty({ type: String })
  elementType: string;

  @Expose()
  @ApiProperty({ type: String })
  eventType: string;

  @Expose()
  @ApiProperty({ type: String })
  pageTitle: string;

  @Expose()
  @ApiProperty({ type: String })
  topic: string;

  @Expose()
  @ApiProperty({ type: String })
  uid: string;

  @Expose()
  @ApiProperty({ type: String })
  urlDomainName: string;

  @Expose()
  @ApiProperty({ type: String })
  urlParameters: string;

  @Expose()
  @ApiProperty({ type: String })
  urlPath: string;

  @Expose()
  @ApiProperty({ type: String })
  urlPort: string;

  @Expose()
  @ApiProperty({ type: String })
  urlScheme: string;

  @Expose()
  @ApiProperty({ type: String })
  value: string;
}
