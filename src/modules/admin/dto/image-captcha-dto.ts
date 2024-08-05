import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class ImageCaptchaDto {
  @ApiProperty({
    required: false,
    default: 100,
    description: 'Verification code width',
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly width: number = 100;

  @ApiProperty({
    required: false,
    default: 50,
    description: 'Verification code height',
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly height: number = 50;
}
