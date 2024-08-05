import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import ShoppingCart from '@/entities/shoppingcart.entity';
import {
  AddItemToCartDto,
  DeleteItemFromCartDto,
  UpdateItemFromCartDto,
} from './dto';
import { ApiOkResponseData } from '@/common/class/res.class';

@ApiTags('Shopping Cart Module')
@Controller('cart')
export class CartController {

    constructor(private cartService: CartService) {}
    @ApiOperation({ summary: 'Create a new Shopping Cart' })
    @ApiOkResponseData(ShoppingCart)
    @Post()
    @HttpCode(201)
    async create(): Promise<ShoppingCart> {
        return this.cartService.create();
    }

    @ApiOperation({ summary: 'Get Shopping Cart By Customer Id' })
    @ApiOkResponseData(ShoppingCart)
    @Get('customer/:id')
    async getCustomer(@Param('id') id: number): Promise<ShoppingCart> {
        return this.cartService.getByCustomerId(id);
    }

    @ApiOperation({ summary: 'Get Shopping Cart By Id' })
    @ApiOkResponseData(ShoppingCart)
    @Get(':id')
    async get(@Param('id') id: string): Promise<ShoppingCart> {
        return this.cartService.getById(id);
    }

    @ApiOperation({ summary: 'Add an item to Shopping Cart' })
    @ApiOkResponseData(ShoppingCart)
    @Post('items/add')
    @HttpCode(201)
    async add(@Body() dto: AddItemToCartDto): Promise<ShoppingCart> {
        return this.cartService.addItemToCart(dto);
    }

    @ApiOperation({ summary: 'Delete an item from Shopping Cart' })
    @ApiOkResponseData(ShoppingCart)
    @Delete('items/delete')
    @HttpCode(200)
    async delete(@Body() dto: DeleteItemFromCartDto): Promise<ShoppingCart> {
        return this.cartService.deleteItemFromCart(dto);
    }

    @ApiOperation({ summary: 'Update an item from Shopping Cart' })
    @ApiOkResponseData(ShoppingCart)
    @Put('items/update')
    @HttpCode(201)
    async update(@Body() dto: UpdateItemFromCartDto): Promise<ShoppingCart> {
        return this.cartService.updateItemFromCart(dto);
    }
}
