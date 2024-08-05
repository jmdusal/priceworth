import { ApiProperty } from '@nestjs/swagger';
import {
  IsStrongPassword,
} from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    required: true,
    example: 'Test123!',
    description: 'Customer password',
  })
  @IsStrongPassword()
  readonly password: string = 'Test123!';
}
