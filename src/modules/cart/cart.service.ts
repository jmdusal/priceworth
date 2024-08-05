import ShoppingCartItem from '@/entities/shoppingcartitem.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AddItemToCartDto,
  DeleteItemFromCartDto,
  UpdateItemFromCartDto,
} from './dto';
import ShoppingCart from '@/entities/shoppingcart.entity';
import { Decimal } from 'decimal.js';
import Customer from '@/entities/customer.entity';
import ProductVariant from '@/entities/product_variant.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(ShoppingCartItem)
    private ShoppingCartItemRepository: Repository<ShoppingCartItem>,
    @InjectRepository(ShoppingCart)
    private shoppingCartRepository: Repository<ShoppingCart>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
  ) {}

  async create(): Promise<ShoppingCart> {
    const newCart = new ShoppingCart();
    return await this.shoppingCartRepository.save(newCart);
  }

  async addItemToCart(
    addItemToCartDto: AddItemToCartDto,
  ): Promise<ShoppingCart> {
    if (addItemToCartDto.quantity <= 0) {
      throw new BadRequestException('product quantity should be more than 0');
    }
    let shoppingCartItem = await this.ShoppingCartItemRepository.findOne({
      where: {
        productVariantId: addItemToCartDto.productVariantId,
        shoppingCart: { id: addItemToCartDto.shoppingCartId },
      },
      relations: ['productVariant'],
    });

    if (shoppingCartItem) {
      // if shopping item exsits, add quantity
      shoppingCartItem.quantity += addItemToCartDto.quantity;
      const quantity = new Decimal(shoppingCartItem.quantity);
      const price = new Decimal(shoppingCartItem.productVariant.price);
      shoppingCartItem.subtotal = quantity
        .times(price)
        .toDecimalPlaces(2)
        .toNumber();
    } else {
      // if shopping item exsits, create item
      shoppingCartItem =
        this.ShoppingCartItemRepository.create(addItemToCartDto);
      const productVariant = await this.productVariantRepository.findOne({
        where: { id: addItemToCartDto.productVariantId },
      });
      const quantity = new Decimal(addItemToCartDto.quantity);
      const price = new Decimal(productVariant.price);
      const subtotal = quantity.times(price).toDecimalPlaces(2).toFixed(2);
      shoppingCartItem.subtotal = parseFloat(subtotal);
    }
    await this.ShoppingCartItemRepository.save(shoppingCartItem);
    const shoppingCart = await this.shoppingCartRepository.findOne({
      where: { id: addItemToCartDto.shoppingCartId },
      relations: ['shoppingCartItems', 'shoppingCartItems.productVariant','shoppingCartItems.productVariant.product'],
    });
    if (!shoppingCart) {
      throw new NotFoundException('Shopping cart not found');
    }

    let totalPrice = new Decimal(0);
    shoppingCart.shoppingCartItems.forEach((item) => {
      totalPrice = totalPrice.plus(item.subtotal);
    });
    const total = totalPrice.toDecimalPlaces(2).toFixed(2);
    shoppingCart.total = parseFloat(total);
    await this.shoppingCartRepository.save(shoppingCart);

    return shoppingCart;
  }

  async deleteItemFromCart(
    deleteItemFromCartDto: DeleteItemFromCartDto,
  ): Promise<ShoppingCart> {
    await this.ShoppingCartItemRepository.delete({
      productVariantId: deleteItemFromCartDto.productVariantId,
      shoppingCart: { id: deleteItemFromCartDto.shoppingCartId },
    });
    const shoppingCart = await this.shoppingCartRepository.findOne({
      where: { id: deleteItemFromCartDto.shoppingCartId },
      relations: ['shoppingCartItems', 'shoppingCartItems.productVariant','shoppingCartItems.productVariant.product'],
    });
    if (!shoppingCart) {
      throw new NotFoundException('Shopping cart not found');
    }

    let totalPrice = new Decimal(0);
    shoppingCart.shoppingCartItems.forEach((item) => {
      totalPrice = totalPrice.plus(item.subtotal);
    });
    const total = totalPrice.toDecimalPlaces(2).toFixed(2);
    shoppingCart.total = parseFloat(total);

    await this.shoppingCartRepository.save(shoppingCart);

    return shoppingCart;
  }

  async updateItemFromCart(
    updateItemFromCartdTO: UpdateItemFromCartDto,
  ): Promise<ShoppingCart> {
    const shoppingCartItem = await this.ShoppingCartItemRepository.findOne({
      where: {
        productVariantId: updateItemFromCartdTO.productVariantId,
        shoppingCart: { id: updateItemFromCartdTO.shoppingCartId },
      },
    });
    if (updateItemFromCartdTO.quantity > 0) {
      shoppingCartItem['quantity'] = updateItemFromCartdTO.quantity;
    }
    await this.ShoppingCartItemRepository.save(shoppingCartItem);
    const shoppingCart = await this.shoppingCartRepository.findOne({
      where: { id: updateItemFromCartdTO.shoppingCartId },
      relations: ['shoppingCartItems', 'shoppingCartItems.productVariant','shoppingCartItems.productVariant.product'],
    });
    if (!shoppingCart) {
      throw new NotFoundException('Shopping cart not found');
    }

    let totalPrice = new Decimal(0);
    shoppingCart.shoppingCartItems.forEach((item) => {
      totalPrice = totalPrice.plus(item.subtotal);
    });
    const total = totalPrice.toDecimalPlaces(2).toFixed(2);
    shoppingCart.total = parseInt(total);
    await this.shoppingCartRepository.save(shoppingCart);

    return shoppingCart;
  }

  async getByCustomerId(id: number): Promise<ShoppingCart> {
    const customer = await this.customerRepository.findOne({
      where: { id: id },
      relations: ['shoppingCart'],
    });
    if (!customer) {
      throw new NotFoundException(`Customer with Id #{id} not found`);
    }
    return customer.shoppingCart;
  }

  async getById(id: string): Promise<ShoppingCart> {
    const cart = await this.shoppingCartRepository.findOne({
      where: { id: id },
      relations: ['shoppingCartItems', 'shoppingCartItems.productVariant','shoppingCartItems.productVariant.product'],
    });
    if (!cart) {
      throw new NotFoundException(`Cart not found`);
    }
    return cart;
  }
}
