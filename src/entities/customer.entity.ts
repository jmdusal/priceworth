// import { BaseEntity } from '@/entities/base.entity';
import { BaseEntity } from '../entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import ShoppingCart from './shoppingcart.entity';
import Order from './order.entity';

@Entity({ name: 'customer' })
export default class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Customer id',
  })
  id: number;

  @Column({ nullable: false, unique: true })
  @ApiProperty({
    description: 'Customer email / username',
  })
  email: string;

  @Column({ nullable: false })
  @ApiProperty({
    description: 'Password',
  })
  password: string;

  @Column({
    default: '',
  })
  @ApiProperty({
    description: 'First name',
  })
  firstName: string;

  @Column({
    default: '',
  })
  @ApiProperty({
    description: 'Last name',
  })
  lastName: string;

  @Column({
    default: '',
  })
  @ApiProperty({
    description: 'Gender',
  })
  gender: string;

  @Column({
    default: '',
  })
  @ApiProperty({
    description: 'Company',
  })
  company: string;

  @Column({
    default: '',
  })
  @ApiProperty({
    description: 'Street address',
  })
  streetAddress: string;

  @Column({
    default: '',
  })
  @ApiProperty({
    description: 'Suburb',
  })
  suburb: string;

  @Column({
    default: '',
  })
  @ApiProperty({
    description: 'City',
  })
  city: string;

  @Column({
    default: '',
  })
  @ApiProperty({
    description: 'Country',
  })
  country: string;

  @Column({
    default: '',
  })
  @ApiProperty({
    description: 'State',
  })
  state: string;

  @Column({
    default: '',
  })
  @ApiProperty({
    description: 'Postcode',
  })
  postcode: string;

  @Column({
    default: '',
  })
  @ApiProperty({
    description: 'Phone number',
  })
  phone: string;

  @Column({
    default: '',
  })
  @ApiProperty({
    description: 'Date of Birth',
  })
  dateOfBirth: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  @ApiProperty({
    description: 'Active',
  })
  active: boolean;

  @Column({ nullable: false, unique: true })
  @ApiProperty({
    description: 'Shopping Cart UUID',
  })
  shoppingCartId: string;

  @OneToOne(() => ShoppingCart, (shoppingCart) => shoppingCart.customer, {
    cascade: true,
  })
  @JoinColumn()
  shoppingCart: ShoppingCart;

  @OneToMany(() => Order, (order) => order.customerId)
  orders: Order[];
}
