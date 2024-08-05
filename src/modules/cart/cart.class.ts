import { ApiProperty } from '@nestjs/swagger';

export class CartId {
  @ApiProperty({
    description: 'Shopping Cart UUID',
  })
  shoppingCartId: string;
}
