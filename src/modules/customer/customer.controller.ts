import { AuthGuard } from '@/common/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import Customer from '@/entities/customer.entity';
import { ApiOkResponseData } from '@/common/class/res.class';
import {
  CreateCustomerDto,
  UpdateActiveDto,
  UpdateCustomerDto,
  UpdatePasswordDto,
  CustomerLoginDto,
} from './dto';
import { LoginToken } from '../admin/admin.class';
import { Roles } from '@/common/decorators/role.decorator';
import { ADMIN_PREFIX, ADMIN_USER } from '@/constants/admin';
import { Keep } from '@/common/decorators/keep.decorator';

@ApiTags('Customer Module')
@Controller('customer')
@UseGuards(AuthGuard)
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @ApiOperation({ summary: 'Create a customer' })
  @ApiOkResponse({ type: LoginToken })
  @Post()
  @HttpCode(201)
  @Keep()
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<LoginToken> {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @ApiOperation({ summary: 'Customer Login' })
  @ApiOkResponse({ type: LoginToken })
  @Post('login')
  @HttpCode(200)
  @Keep()
  async login(@Body() customerLoginDto: CustomerLoginDto): Promise<LoginToken> {
    return this.customerService.login(customerLoginDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a customer information By id' })
  @ApiOkResponseData(Customer)
  @ApiSecurity(ADMIN_PREFIX)
  @Get(':id')
  @HttpCode(200)
  @Roles(ADMIN_USER)
  async getById(@Param('id') id: number): Promise<Customer> {
    return this.customerService.getCustomerById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a customer information By Token' })
  @ApiOkResponseData(Customer)
  @ApiSecurity(ADMIN_PREFIX)
  @Get()
  @HttpCode(200)
  async getByToken(@Headers('authorization') token: string): Promise<Customer> {
    return this.customerService.getCustomerByToken(token);
  }

  @ApiOperation({ summary: 'Delete a customer By id' })
  @Delete(':id')
  @HttpCode(200)
  async deleteById(@Param('id') id: number): Promise<void> {
    return this.customerService.deleteCustomerById(id);
  }

  @ApiOperation({ summary: 'Update a customer information By id' })
  @ApiOkResponseData(Customer)
  @Put(':id/info')
  @HttpCode(200)
  async updateInfoById(
    @Param('id') id: number,
    @Body() dto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.updateCustomerInfoById(id, dto);
  }

  @ApiOperation({ summary: 'Update a customer password By id' })
  @Put(':id/password')
  @HttpCode(200)
  async updatePasswordById(
    @Param('id') id: number,
    @Body() dto: UpdatePasswordDto,
  ): Promise<void> {
    await this.customerService.updatePasswordById(id, dto);
  }

  @ApiOperation({ summary: 'Update a customer active status By id' })
  @Put(':id/active')
  @HttpCode(200)
  async updateActiveById(
    @Param('id') id: number,
    @Body() dto: UpdateActiveDto,
  ): Promise<void> {
    await this.customerService.updateActiveById(id, dto);
  }
}
