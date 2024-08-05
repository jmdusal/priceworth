import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'User name' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Verification code identification' })
  @IsString()
  captchaId: string;

  @ApiProperty({ description: 'Verification code entered by the user' })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  verifyCode: string;
}
