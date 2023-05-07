import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ type: Boolean })
  success: boolean;

  @ApiProperty({ type: String, required: false })
  message?: string;
}
