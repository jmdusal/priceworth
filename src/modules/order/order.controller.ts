import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto';
import { ApiOkResponseData } from '@/common/class/res.class';
import Order from '@/entities/order.entity';

@ApiTags('Order Module')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) { }

  @ApiProperty({
    description: 'Create order',
  })
  @ApiOkResponseData(Order)
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateOrderDto) {
    this.orderService.create(dto);
  }

  @ApiProperty({
    description: 'Get Order By Order Id'
  })
  @Get(':id')
  getByOrderId(@Param() id: number) {
    this.orderService.getByOrderId(id);
  }

  @ApiProperty({
    description: "Get Orders By Customer Id"
  })
  @Get()
  getByCustomerId(@Query('customer') id: number) {
    this.orderService.getByCustomerId(id)
  }

  @ApiProperty({
    description: "Get All orders"
  })
  @Get()
  getAll() {
    this.orderService.getAllOrders()
  }

  @ApiProperty({})
  @Delete(":id")
  deleteById(@Param() id: number) {
    this.orderService.deleteById(id)
  }
}
