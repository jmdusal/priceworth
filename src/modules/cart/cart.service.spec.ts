import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddItemToCartDto, DeleteItemFromCartDto, UpdateItemFromCartDto,} from './dto';
import { CartService } from './cart.service';
import ShoppingCart from '@/entities/shoppingcart.entity';
import ShoppingCartItem from '@/entities/shoppingcartitem.entity';
import ProductVariant from '@/entities/product_variant.entity';
import Customer from '@/entities/customer.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CartService', () => {
    let cartService: CartService;
    let shoppingCartRepository: Repository<ShoppingCart>;
    let shoppingCartItemRepository: Repository<ShoppingCartItem>;
    let productVariantRepository: Repository<ProductVariant>;
    let customerRepository: Repository<Customer>;
    let mockaddItemToCartDto: AddItemToCartDto;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            CartService,
            {
                provide: getRepositoryToken(ShoppingCart),
                useClass: Repository,
            },
            {
                provide: 'CustomerRepository',
                useValue: {
                    findOne: jest.fn(),
                },
            },
            {
                provide: 'ProductVariantRepository',
                useValue: {
                    findOne: jest.fn(),
                },
            },
            {
                provide: 'ShoppingCartRepository',
                useValue: {
                    findOne: jest.fn(),
                    save: jest.fn(),
                    create: jest.fn(),
                },
            },
            {
                provide: 'ShoppingCartItemRepository',
                useValue: {
                    findOne: jest.fn(),
                    save: jest.fn(),
                    create: jest.fn(),
                    delete: jest.fn().mockResolvedValue({}),
                },
            },
        ],
        }).compile();

        cartService = module.get<CartService>(CartService);
        shoppingCartItemRepository = module.get('ShoppingCartItemRepository');
        shoppingCartRepository = module.get('ShoppingCartRepository');
        customerRepository = module.get('CustomerRepository');
        productVariantRepository = module.get('ProductVariantRepository');
        // shoppingCartRepository = module.get<Repository<ShoppingCart>>(getRepositoryToken(ShoppingCart),);

    });

    it('should be defined', () => {
        expect(cartService).toBeDefined();
    });

    mockaddItemToCartDto = {
        quantity: 2,
        productVariantId: 33,
        shoppingCartId: 'cart_id',
    };

    describe('create', () => {
        it('should create a new shopping cart', async () => {
            const newCart = new ShoppingCart();
            const saveSpy = jest.spyOn(shoppingCartRepository, 'save').mockResolvedValue(newCart);
            const result = await cartService.create();

            expect(result).toEqual(newCart);
            expect(saveSpy).toHaveBeenCalledWith(newCart);
        });
    });

    describe('addItemToCart', () => {

        it('should throw BadRequestException if quantity is less than or equal to 0', async () => {
            const modifiedAddItemToCartDto: AddItemToCartDto = {
              ...mockaddItemToCartDto,
              quantity: 0,
            };

            await expect(cartService.addItemToCart(modifiedAddItemToCartDto)).rejects.toThrowError(BadRequestException);
        });

        it('should add item to cart if it does not exist', async () => {
            const addItemToCartDto: AddItemToCartDto = {
                productVariantId: 1,
                quantity: 1,
                shoppingCartId: 'cart_id',
            };

            jest.spyOn(shoppingCartRepository, 'findOne').mockResolvedValue({
                id: 'cart_id',
                total: 0,
                customer: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                shoppingCartItems: [],
            });

            const shoppingCartItemMock = new ShoppingCartItem();
            shoppingCartItemMock.quantity = 1;
            shoppingCartItemMock.productVariant = {
              id: 1,
              name: 'Product Variant Test',
              color: 'Green',
              sku: 'SKU123',
              dimensionHeight: 12,
              dimensionLength: 55,
              dimensionWidth: 33,
              weight: 26,
              price: 99,
              totalInventory: 1,
              product: null,
              images: [
                'product-variant-image-1.jpg',
                'product-variant-image-2.jpg',
                'product-variant-image-3.jpg',
              ],
            };

            jest.spyOn(shoppingCartItemRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(productVariantRepository, 'findOne').mockResolvedValue({
              id: 1,
              name: 'Product Variant Test',
              color: 'Green',
              sku: 'SKU123',
              dimensionHeight: 12,
              dimensionLength: 55,
              dimensionWidth: 33,
              weight: 26,
              price: 99,
              totalInventory: 1,
              product: null,
              images: [
                'product-variant-image-1.jpg',
                'product-variant-image-2.jpg',
                'product-variant-image-3.jpg',
              ],
            });

            const savedShoppingCartItem = new ShoppingCartItem();
            savedShoppingCartItem.quantity = 1;
            savedShoppingCartItem.productVariant = {
              id: 1,
              name: 'Product Variant Test',
              color: 'Green',
              sku: 'SKU123',
              dimensionHeight: 12,
              dimensionLength: 55,
              dimensionWidth: 33,
              weight: 26,
              price: 99,
              totalInventory: 1,
              product: null,
              images: [
                'product-variant-image-1.jpg',
                'product-variant-image-2.jpg',
                'product-variant-image-3.jpg',
              ],
            };
            savedShoppingCartItem.subtotal = 10;

            jest.spyOn(shoppingCartItemRepository, 'create').mockReturnValue(savedShoppingCartItem);
            const result = await cartService.addItemToCart(addItemToCartDto);

            expect(result.shoppingCartItems.length).toBe(0);
            expect(result.total).toBe(0);
        });

        it('should throw NotFoundException if shopping cart is not found', async () => {
            jest.spyOn(shoppingCartRepository, 'findOne').mockResolvedValue(null);

            try {
                await cartService.getById('cart_id');
                fail('Expected NotFoundException to be thrown');
            } catch (error) {

                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toEqual('Cart not found');
            }
        });

    });

    describe('deleteItemFromCart', () => {

        it('should delete item from cart and return updated cart', async () => {
            // jest.spyOn(shoppingCartItemRepository, 'delete').mockResolvedValueOnce({});
            jest.spyOn(shoppingCartItemRepository, 'delete').mockResolvedValueOnce({
                affected: 1,
                raw: {},
            });

            const shoppingCart = {
                id: 'cart_id',
                shoppingCartItems: [
                  {
                    id: 1,
                    quantity: 1,
                    shoppingCartId: 'cart_id',
                    shoppingCart: null,
                    productVariantId: 1,
                    productVariant: {
                      id: 1,
                      name: 'Product Variant Test',
                      color: 'Green',
                      sku: 'SKU123',
                      dimensionHeight: 12,
                      dimensionLength: 55,
                      dimensionWidth: 33,
                      weight: 26,
                      price: 99,
                      totalInventory: 1,
                      product: null,
                      images: [
                        'product-variant-image-1.jpg',
                        'product-variant-image-2.jpg',
                        'product-variant-image-3.jpg',
                      ],
                    },
                    subtotal: 10,
                  },
                ],
                total: 10,
                customer: null,
                createdAt: new Date(),
                updatedAt: new Date(),
              };

            jest.spyOn(shoppingCartRepository, 'findOne').mockResolvedValueOnce(shoppingCart);

            const deleteItemFromCartDto: DeleteItemFromCartDto = {
                productVariantId: 1,
                shoppingCartId: 'cart_id',
            };
            const result = await cartService.deleteItemFromCart(deleteItemFromCartDto);

            expect(shoppingCartItemRepository.delete).toHaveBeenCalledWith({
              productVariantId: deleteItemFromCartDto.productVariantId,
              shoppingCart: { id: deleteItemFromCartDto.shoppingCartId },
            });

            expect(shoppingCartRepository.findOne).toHaveBeenCalledWith({
              where: { id: deleteItemFromCartDto.shoppingCartId },
              relations: ['shoppingCartItems', 'shoppingCartItems.productVariant', 'shoppingCartItems.productVariant.product'],
            });

            expect(result.id).toBe(shoppingCart.id);
            expect(result.total).toBe(10);
            expect(result.shoppingCartItems.length).toBe(1);
        });

    });


    describe('updateItemFromCart', () => {

        it('should update item in cart and return updated cart', async () => {
            jest.spyOn(shoppingCartItemRepository, 'findOne').mockResolvedValueOnce({
                id: 1,
                quantity: 1,
                subtotal: 10,
                productVariantId: 1,
                shoppingCartId: 'cart_id',
                shoppingCart: null,
                productVariant: {
                    id: 1,
                    name: 'Product Variant Test',
                    color: 'Green',
                    sku: 'SKU123',
                    dimensionHeight: 12,
                    dimensionLength: 55,
                    dimensionWidth: 33,
                    weight: 26,
                    price: 99,
                    totalInventory: 1,
                    product: null,
                    images: [
                        'product-variant-image-1.jpg',
                        'product-variant-image-2.jpg',
                        'product-variant-image-3.jpg',
                    ],
                },
            });
            jest.spyOn(shoppingCartItemRepository, 'save').mockResolvedValueOnce({
                id: 1,
                quantity: 2,
                subtotal: 20,
                productVariantId: 1,
                shoppingCartId: 'cart_id',
                shoppingCart: null,
                productVariant: {
                    id: 1,
                    name: 'Product Variant Test',
                    color: 'Green',
                    sku: 'SKU123',
                    dimensionHeight: 12,
                    dimensionLength: 55,
                    dimensionWidth: 33,
                    weight: 26,
                    price: 99,
                    totalInventory: 1,
                    product: null,
                    images: [
                        'product-variant-image-1.jpg',
                        'product-variant-image-2.jpg',
                        'product-variant-image-3.jpg',
                    ],
                },
              });

            const shoppingCart = {
                id: 'cart_id',
                shoppingCartItems: [
                  {
                    id: 1,
                    quantity: 1,
                    shoppingCartId: 'cart_id',
                    shoppingCart: null,
                    productVariantId: 1,
                    productVariant: {
                      id: 1,
                      name: 'Product Variant Test',
                      color: 'Green',
                      sku: 'SKU123',
                      dimensionHeight: 12,
                      dimensionLength: 55,
                      dimensionWidth: 33,
                      weight: 26,
                      price: 99,
                      totalInventory: 1,
                      product: null,
                      images: [
                        'product-variant-image-1.jpg',
                        'product-variant-image-2.jpg',
                        'product-variant-image-3.jpg',
                      ],
                    },
                    subtotal: 10,
                  },
                ],
                total: 10,
                customer: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(shoppingCartRepository, 'findOne').mockResolvedValueOnce(shoppingCart);

            const updateItemFromCartDto: UpdateItemFromCartDto = {
                productVariantId: 1,
                shoppingCartId: 'cart_id',
                quantity: 2
            }

            const result = await cartService.updateItemFromCart(updateItemFromCartDto);

            expect(shoppingCartItemRepository.findOne).toHaveBeenCalledWith({
                where: {
                    productVariantId: updateItemFromCartDto.productVariantId,
                    shoppingCart: { id: updateItemFromCartDto.shoppingCartId },
                },
            });

            // expect(shoppingCartItemRepository.save).toHaveBeenCalledWith({
            //   ...shoppingCartItemRepository.findOne.mock.results[0].value,
            //   quantity: updateItemFromCartDto.quantity,
            // });
            jest.spyOn(shoppingCartItemRepository, 'save').mockResolvedValueOnce({
                id: 1,
                quantity: updateItemFromCartDto.quantity,
                subtotal: 20,
                productVariantId: 1,
                shoppingCartId: 'cart_id',
                shoppingCart: null,
                productVariant: {
                  id: 1,
                  name: 'Product Variant Test',
                  color: 'Green',
                  sku: 'SKU123',
                  dimensionHeight: 12,
                  dimensionLength: 55,
                  dimensionWidth: 33,
                  weight: 26,
                  price: 99,
                  totalInventory: 1,
                  product: null,
                  images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                  ],
                },
            });

            expect(shoppingCartRepository.findOne).toHaveBeenCalledWith({
              where: { id: updateItemFromCartDto.shoppingCartId },
              relations: ['shoppingCartItems', 'shoppingCartItems.productVariant', 'shoppingCartItems.productVariant.product'],
            });

            expect(result.id).toBe(shoppingCart.id);
            expect(result.total).toBe(10);
            expect(result.shoppingCartItems.length).toBe(1);
            expect(result.shoppingCartItems[0].quantity).toBe(1);
        });


    });


    describe('getByCustomerId', () => {

        it('should return shopping cart by customer id', async () => {
            const mockCustomerId = 1;
            const mockCustomer = {
                id: mockCustomerId,
                email: 'test@example.com',
                password: 'password123',
                firstName: 'Fname',
                lastName: 'Lname',
                gender: 'male',
                company: 'ABC pty ltd',
                streetAddress: 'ABC street',
                suburb: 'Smithfield',
                city: 'Sydney',
                country: 'Australia',
                state: 'NSW',
                postcode: '2164',
                phone: '1234567890',
                dateOfBirth: '01-01-2000',
                active: true,
                shoppingCartId: 'bc0f36c0-376c-4395-adfa-bfe941f791e2',
                shoppingCart: new ShoppingCart(),
                orders: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(mockCustomer);

            const result = await cartService.getByCustomerId(mockCustomerId);

            expect(result).toEqual(mockCustomer.shoppingCart);
            expect(customerRepository.findOne).toHaveBeenCalledWith({
              where: { id: mockCustomerId },
              relations: ['shoppingCart'],
            });
        });

    });

    describe('getById', () => {

        it('should return shopping cart by id', async () => {
            const mockCartId = 'abc123';
            const mockCart = new ShoppingCart();
            jest.spyOn(shoppingCartRepository, 'findOne').mockResolvedValue(mockCart);

            const result = await cartService.getById(mockCartId);

            expect(result).toEqual(mockCart);
            expect(shoppingCartRepository.findOne).toHaveBeenCalledWith({
              where: { id: mockCartId },
              relations: ['shoppingCartItems', 'shoppingCartItems.productVariant', 'shoppingCartItems.productVariant.product'],
            });
        });

    });


});
