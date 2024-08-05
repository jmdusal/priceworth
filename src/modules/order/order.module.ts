import OrderItem from '@/entities/orderitem.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import Order from '@/entities/order.entity';
import Customer from '@/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Customer])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
