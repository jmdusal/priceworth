import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateActiveDto {
  @ApiProperty({
    required: true,
    default: true,
    description: 'Active',
  })
  @IsBoolean()
  readonly active: boolean = true;
}
