import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductFeatureDto {
  @ApiProperty({
    example: 'key1',
    description: 'Product Feature key',
  })
  @IsOptional()
  @IsString()
  key?: string;

  @ApiProperty({
    example: 'value1',
    description: 'Product Feature value',
  })
  @IsOptional()
  @IsString()
  value?: string;
}
