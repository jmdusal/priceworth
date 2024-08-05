import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductVariantDto {
  @ApiProperty({
    example: 'name1',
    description: 'Product Variant name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '123456',
    description: 'Product Variant sku',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    example: '#FF0000',
    description: 'Product Variant color',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    example: 100,
    description: 'Product Variant Dimension Height',
  })
  @IsNumber()
  dimensionHeight?: number;

  @ApiProperty({
    example: 100,
    description: 'Product Variant Dimension Length',
  })
  @IsNumber()
  dimensionLength?: number;

  @ApiProperty({
    example: 100,
    description: 'Product Variant Dimension Width',
  })
  @IsNumber()
  dimensionWidth?: number;

  @ApiProperty({
    example: 100,
    description: 'Product Variant Weight',
  })
  @IsNumber()
  weight?: number;

  @ApiProperty({
    example: 100.0,
    description: 'Product Variant price',
  })
  @IsNumber()
  price?: number;

  @ApiProperty({
    example: 5,
    description: 'Product totalInventory',
  })
  @IsNumber()
  totalInventory?: number;

  @ApiProperty({
    example: 1,
    description: 'Product id',
  })
  @IsNumber()
  productId?: number;
}
