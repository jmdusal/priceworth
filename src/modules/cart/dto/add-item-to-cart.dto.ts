import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddItemToCartDto {
  @ApiProperty({
    required: true,
    example: 1,
    description: 'Product Variant id',
  })
  @IsNumber()
  readonly productVariantId: number;

  @ApiProperty({
    required: true,
    example: 1,
    description: 'Product Variant Quantity',
  })
  @IsNumber()
  readonly quantity: number;

  @ApiProperty({
    required: true,
    description: 'Shopping Cart UUID',
  })
  @IsString()
  readonly shoppingCartId: string;
}
