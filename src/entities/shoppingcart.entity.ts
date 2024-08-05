import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import ShoppingCartItem from './shoppingcartitem.entity';
import Customer from './customer.entity';

@Entity({ name: 'shoppingcart' })
export default class ShoppingCart extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Shopping Cart uuid',
  })
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @ApiProperty({
    description: 'Shopping Cart total price',
  })
  total: number;

  @OneToMany(
    () => ShoppingCartItem,
    (shoppingCartItem) => shoppingCartItem.shoppingCart,
    { cascade: true },
  )
  shoppingCartItems: ShoppingCartItem[];

  @OneToOne(() => Customer, (customer) => customer.shoppingCart)
  customer: Customer;
}
