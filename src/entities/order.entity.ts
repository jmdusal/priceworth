import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import Customer from './customer.entity';
import OrderItem from './orderitem.entity';

@Entity({ name: 'order' })
export default class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Order id' })
  id: number;

  @ApiProperty({ description: 'Customer id' })
  customerId: number | null;

  @ApiProperty({ description: 'Billing Address' })
  billingAddress: string;

  @ApiProperty({ description: 'Shipping method id' })
  shippingMethodId: number;

  @ApiProperty({ description: 'Shipping Address' })
  shippingAddress: string;

  @ApiProperty({ description: 'Pick up in store or not' })
  isPickup: boolean;

  @ApiProperty({ description: 'Pick up address' })
  pickupAddress: string;

  @ApiProperty({ description: 'Payment status' })
  paymentStatus: string;

  @ApiProperty({ description: 'Order status' })
  orderStatus: string;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.orderId, {
    cascade: true,
  })
  orderItems: OrderItem[];
}
