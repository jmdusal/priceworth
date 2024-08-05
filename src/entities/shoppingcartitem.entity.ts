import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import ProductVariant from './product_variant.entity';
import ShoppingCart from './shoppingcart.entity';

@Entity({ name: 'shoppingcartitem' })
export default class ShoppingCartItem {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Shopping Cart Item id',
  })
  id: number;

  @Column()
  @ApiProperty({
    description: 'Product Variant id',
  })
  productVariantId: number;

  @Column()
  @ApiProperty({
    description: 'Product Variant quantity',
  })
  quantity: number;

  @Column()
  @ApiProperty({
    description: 'Shopping Cart UUId',
  })
  shoppingCartId: string;

  @Column()
  @ApiProperty({
    description: 'Subtotal',
  })
  subtotal: number;

  @ManyToOne(
    () => ShoppingCart,
    (shoppingCart) => shoppingCart.shoppingCartItems,
  )
  @JoinColumn({ name: 'shoppingCartId' })
  shoppingCart: ShoppingCart;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'productVariantId' })
  productVariant: ProductVariant;
}
