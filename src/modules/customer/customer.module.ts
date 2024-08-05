import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Customer from '@/entities/customer.entity';
import { AuthGuard } from '@/common/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import Order from '@/entities/order.entity';
import ShoppingCart from '@/entities/shoppingcart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Order, ShoppingCart]),
  ],
  providers: [
    CustomerService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [CustomerController],
})
export class CustomerModule {}
