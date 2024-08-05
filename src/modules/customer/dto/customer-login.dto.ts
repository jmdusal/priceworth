import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CustomerLoginDto {
  @ApiProperty({
    required: true,
    example: 'null@null.com',
    description: 'Customer email / username',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: 'Test123!',
    description: 'Customer password',
  })
  @IsString()
  password: string;
}
