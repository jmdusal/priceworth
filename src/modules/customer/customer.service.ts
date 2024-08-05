import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCustomerDto,
  UpdateActiveDto,
  UpdateCustomerDto,
  UpdatePasswordDto,
} from './dto';
// import Customer from '@/entities/customer.entity';
import Customer from '../../entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerLoginDto } from './dto/customer-login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginToken } from '../admin/admin.class';
// import { CUSTOMER_USER } from '@/constants/customer';
import { CUSTOMER_USER } from '../../constants/customer';
import ShoppingCart from '@/entities/shoppingcart.entity';

@Injectable()
export class CustomerService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(ShoppingCart)
    private cartRepository: Repository<ShoppingCart>,
  ) {}
  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<LoginToken> {
    const exsitedCustomer = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email },
    });
    if (exsitedCustomer) {
      throw new BadRequestException(
        'This email has been registered, please login instead',
      );
    }

    const cart = await this.cartRepository.findOne({
      where: { id: createCustomerDto.shoppingCartId },
      relations: ['customer'],
    });
    if (!cart) {
      throw new NotFoundException('The shopping cart cannot be found');
    }
    if (cart.customer) {
      throw new BadRequestException('This shopping cart is invalid');
    }

    const hashedPassword = await bcrypt.hash(createCustomerDto.password, 3);
    createCustomerDto.password = hashedPassword;
    const customer = this.customerRepository.create(createCustomerDto);
    const newCustomer = await this.customerRepository.save(customer);
    const token = this.jwtService.sign({
      id: newCustomer.id,
      role: CUSTOMER_USER,
    });
    return { token };
  }

  async login(customerLoginDto: CustomerLoginDto): Promise<LoginToken> {
    const customer = await this.customerRepository.findOne({
      where: { email: customerLoginDto.email },
    });
    if (!customer) {
      throw new BadRequestException(
        'This email is not registered with us, please register firstly',
      );
    }
    const isMatch = await bcrypt.compare(
      customerLoginDto.password,
      customer.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }

    const token = this.jwtService.sign({
      id: customer.id,
      role: CUSTOMER_USER,
    });
    return { token };
  }

  async getCustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id: id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID #${id} not found.`);
    }
    return customer;
  }

  async getCustomerByToken(token: string): Promise<Customer> {
    const user = this.jwtService.verify(token);
    const customer = await this.customerRepository.findOne({
      where: { id: user.id },
    });
    if (!customer) {
      throw new NotFoundException(`not valid token or customer is inactive`);
    }

    return customer;
  }

  async updateCustomerInfoById(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id: id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    Object.entries(updateCustomerDto).forEach(([key, value]) => {
      customer[key] = value;
    });

    await this.customerRepository.save(customer);
    return this.customerRepository.findOne({
      where: { id: id },
    });
  }

  async updatePasswordById(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const customer = await this.customerRepository.findOne({
      where: { id: id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    customer['password'] = updatePasswordDto.password;
    await this.customerRepository.save(customer);
  }

  async updateActiveById(
    id: number,
    updateActiveDto: UpdateActiveDto,
  ): Promise<void> {
    const customer = await this.customerRepository.findOne({
      where: { id: id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID #${id} not found`);
    }
    customer['active'] = updateActiveDto.active;
    await this.customerRepository.save(customer);
  }

  async deleteCustomerById(id: number): Promise<void> {
    const customerExsiting = await this.customerRepository.findOne({
      where: { id: id },
    });
    if (!customerExsiting) {
      throw new NotFoundException(`Customer with ID #${id} not found`);
    }
    await this.customerRepository.delete(id);
  }
}
