import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Repository } from 'typeorm';
import ShoppingCart from '@/entities/shoppingcart.entity';
import ShoppingCartItem from '@/entities/shoppingcartitem.entity';
import ProductVariant from '@/entities/product_variant.entity';
import Customer from '@/entities/customer.entity';

describe('CartController', () => {
    let cartController: CartController;
    let cartService: CartService;
    let shoppingCartRepository: Repository<ShoppingCart>;
    let shoppingCartItemRepository: Repository<ShoppingCartItem>;
    let productVariantRepository: Repository<ProductVariant>;
    let customerRepository: Repository<Customer>;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [CartController],
        providers: [
            CartService,
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

        cartController = module.get<CartController>(CartController);
        cartService = module.get<CartService>(CartService);
        shoppingCartItemRepository = module.get('ShoppingCartItemRepository');
        shoppingCartRepository = module.get('ShoppingCartRepository');
        customerRepository = module.get('CustomerRepository');
        productVariantRepository = module.get('ProductVariantRepository');
    });

    it('should be defined', () => {
      expect(cartController).toBeDefined();
    });

    let mockShoppingCart: ShoppingCart = {
        id: 'cart_id',
        total: 0,
        customer: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        shoppingCartItems: [],
    }

    describe('create', () => {

        it('should return a new shopping cart', async () => {

            jest.spyOn(cartService, 'create').mockResolvedValue(mockShoppingCart);

            const result = await cartController.create();
            expect(result).toBe(mockShoppingCart);
        });

    });

    describe('getCustomer', () => {

        it('should return a shopping cart for a given customer ID', async () => {
            const mockCustomerId = 123;
            jest.spyOn(cartService, 'getByCustomerId').mockResolvedValue(mockShoppingCart);

            const result = await cartController.getCustomer(mockCustomerId);

            expect(result).toBe(mockShoppingCart);
            expect(cartService.getByCustomerId).toHaveBeenCalledWith(mockCustomerId);
        });


    });

    describe('get', () => {

        it('should return a shopping cart for a given ID', async () => {
            const mockCartId = 'abc123';
            jest.spyOn(cartService, 'getById').mockResolvedValue(mockShoppingCart);
            const result = await cartController.get(mockCartId);

            expect(result).toBe(mockShoppingCart);
            expect(cartService.getById).toHaveBeenCalledWith(mockCartId);
          });

    });



});
