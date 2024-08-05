import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateProductVariantDto } from './create-product_variant.dto';
import { Type } from 'class-transformer';
import { CreateProductFeatureDto } from './create-product_feature.dto';

export class CreateProductDto {
  @ApiProperty({
    required: true,
    example: 'model1',
    description: 'Product model',
  })
  @IsString()
  readonly model: string = 'model1';

  @ApiProperty({
    required: true,
    example: 'name1',
    description: 'Product name',
  })
  @IsString()
  readonly name: string = 'name1';

  @ApiProperty({
    required: true,
    example: 1,
    description: 'Product category id',
  })
  @IsNumber()
  readonly productCategoryId: number = 1;

  @ApiProperty({
    required: true,
    example: 'short description',
    description: 'Product short description',
  })
  @IsString()
  readonly shortDescription: string = 'short description';

  @ApiProperty({
    required: true,
    example: 'long description',
    description: 'Product long description',
  })
  @IsString()
  readonly longDescription: string = 'long description';

  @ApiProperty({
    required: true,
    default: true,
    description: 'Product Published',
  })
  @IsBoolean()
  readonly published: boolean = true;

  @ApiProperty({
    description: 'Product Features detail',
    type: [CreateProductFeatureDto],
    example: [
      {
        key: 'key1',
        value: 'value1',
        productId: 1,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductFeatureDto)
  readonly features: CreateProductFeatureDto[];

  @ApiProperty({
    description: 'Product Variants detail',
    type: [CreateProductVariantDto],
    example: [
      {
        name: 'name1',
        sku: '123456',
        color: '#FF0000',
        dimensionHeight: 100,
        dimensionWidth: 100,
        dimentsionLength: 100,
        weight: 100,
        price: 100,
        totalInventory: 5,
        productId: 1,
        images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  readonly productVariants: CreateProductVariantDto[];
}
