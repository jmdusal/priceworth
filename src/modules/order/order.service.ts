import Order from '@/entities/order.entity';
import OrderItem from '@/entities/orderitem.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import Customer from '@/entities/customer.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepostitory: Repository<OrderItem>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(order);
  }

  async getByOrderId(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: id } });
    if (!order) {
      throw new NotFoundException(`Order with id #${id} not found`);
    }
    return order;
  }

  async getByCustomerId(id: number): Promise<Order[]> {
    const customer = await this.customerRepository.findOne({
      where: { id: id },
      relations: ['orders'],
    });
    if (!customer) {
      throw new NotFoundException(`Customer with id #${id} not found`);
    }
    return customer.orders;
  }

  async getAllOrders(): Promise<Order[]> {
    const orders = await this.orderRepository.find();
    return orders;
  }

  async deleteById(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id: id } });
    if (!order) {
      throw new NotFoundException(`Order with id #${id} not found`);
    }
    await this.orderRepository.delete(id);
  }
}
