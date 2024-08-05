import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({
    required: true,
    example: 'name1',
    description: 'Product Variant name',
  })
  @IsString()
  readonly name: string = 'name1';

  @ApiProperty({
    required: true,
    example: '123456',
    description: 'Product Variant sku',
  })
  @IsString()
  readonly sku: string = '123456';

  @ApiProperty({
    required: true,
    example: '#FF0000',
    description: 'Product Variant color',
  })
  @IsString()
  readonly color: string = '#FF0000';

  @ApiProperty({
    required: true,
    default: 100,
    description: 'Product Variant Dimension Height',
  })
  @IsNumber()
  readonly dimensionHeight: number = 100;

  @ApiProperty({
    required: true,
    default: 100,
    description: 'Product Variant Dimension Length',
  })
  @IsNumber()
  readonly dimensionLength: number = 100;

  @ApiProperty({
    required: true,
    default: 100,
    description: 'Product Variant Dimension Width',
  })
  @IsNumber()
  readonly dimensionWidth: number = 100;

  @ApiProperty({
    required: true,
    example: 100,
    description: 'Product Variant Weight',
  })
  @IsNumber()
  readonly weight: number = 100;

  @ApiProperty({
    required: true,
    example: 100,
    description: 'Product Variant price',
  })
  @IsNumber()
  readonly price: number = 100;

  @ApiProperty({
    example: 5,
    description: 'Product totalInventory',
  })
  @IsNumber()
  readonly totalInventory: number = 5;

  @ApiProperty({
    description: 'Product id',
  })
  @IsNumber()
  readonly productId: number = 1;

  @ApiProperty({
    description: 'Product SKU images',
    type: [String],
  })
  @IsArray()
  readonly images: string[] = ['/'];
}
