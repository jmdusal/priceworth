import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    example: 'model1',
    description: 'Product model',
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({
    example: 'name1',
    description: 'Product name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 1,
    description: 'Product category id',
  })
  @IsOptional()
  @IsNumber()
  productCategoryId?: number;

  @ApiProperty({
    example: 'short description',
    description: 'Product short description',
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({
    example: 'long description',
    description: 'Product long description',
  })
  @IsOptional()
  @IsString()
  longDescription?: string;

  @ApiProperty({
    example: true,
    description: 'Product Published',
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
