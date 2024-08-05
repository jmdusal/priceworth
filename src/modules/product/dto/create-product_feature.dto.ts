import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductFeatureDto {
  @ApiProperty({
    required: true,
    example: 'key1',
    description: 'Product Feature key',
  })
  @IsString()
  readonly key: string = 'key1';

  @ApiProperty({
    required: true,
    example: 'value1',
    description: 'Product Feature value',
  })
  @IsString()
  readonly value: string = 'value1';

  @ApiProperty({
    required: true,
    example: 1,
    description: 'Product id',
  })
  @IsNumber()
  readonly productId: number = 1;
}
