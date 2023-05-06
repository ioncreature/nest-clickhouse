import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDTO {
  @ApiProperty({ type: Boolean })
  success: boolean;

  @ApiProperty({ type: String, required: false })
  message?: string;
}
