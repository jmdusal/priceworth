import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ShoppingCart from '@/entities/shoppingcart.entity';
import ShoppingCartItem from '@/entities/shoppingcartitem.entity';
import Customer from '@/entities/customer.entity';
import ProductVariant from '@/entities/product_variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShoppingCart,
      ShoppingCartItem,
      Customer,
      ProductVariant,
    ]),
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
