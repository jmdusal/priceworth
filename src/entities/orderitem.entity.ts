import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Order from './order.entity';

@Entity({ name: 'orderitem' })
export default class OrderItem {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Order item id',
  })
  id: number;

  @ApiProperty({
    description: 'Order id',
  })
  orderId: number;

  @ApiProperty({
    description: 'Product Variant id',
  })
  productVariantId: number;

  @ApiProperty({
    description: 'Product Variant quantity',
  })
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
